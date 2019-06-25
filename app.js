const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const jsforce = require('jsforce');

const app = express();

const port = process.env.PORT || 8443;
const server = app.listen(port, function() {
    console.log(`Our app is running on port ${port}`);
});

const wss = new WebSocket.Server({ server, clientTracking: true });
const channel = process.env.channel || '/data/ChangeEvents';

let conns = {};
let subs = {};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.render('index', { title: 'CDC Demo' });
});
  
app.get('/logout', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public/logout.html'));
});

app.get('/events/:orgId', (req, res, next) => {

    // don't try to use old subs?

    const conn = conns[req.params.orgId];
    const sub = conn.streaming.topic(channel).subscribe(message => {         // subscribe to its events
        wss.clients.forEach( client => {
            if (client.url.includes(req.params.orgId) && client.readyState === client.OPEN ){
                client.send(JSON.stringify(message));
            }
        })
    });

    subs = { ...subs, [req.params.orgId] : sub };
    console.log(subs);
    
    res.sendFile(path.join(__dirname, '/public/events.html'));
});


app.post('/sessionId', bodyParser.json(), (req, res, next) => {
    const conn = new jsforce.Connection({
        loginUrl: req.body.loginUrl,
        instanceUrl: req.body.instanceUrl,
        accessToken: req.body.accessToken
    });

    conns = { ...conns, [req.body.orgId] : conn };
    console.log(conns);

    res.status(302).location(`/events/${req.body.orgId}`).end();
});

wss.on('connection', (ws, req) => {
    
    ws.url = req.url; // for future use tracking clients
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('That\'s an error.');
  })

module.exports = app;
