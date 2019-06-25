console.log('hello, I am the events page');

let pinger;

const HOST = location.href.replace(/^http/, 'ws');

const ws = new WebSocket(HOST);

var app = new Vue({
    el: '#app',
    data: {
      messages: []
    }
});

ws.onopen = function () {
  console.log('WS is open!');
  pinger = setInterval(() => {
    ws.send('ping');
  }, 5000);
};
  
ws.onclose = function () {
  console.log('WS is closing');
  clearInterval(pinger);
};
  
ws.onmessage = function (event) {
  // console.log(event.data);
  const newData = JSON.parse(event.data).payload;
  console.log(newData);
  app.messages.push(newData);
};

const logout = () => {    
  jsforce.browser.logout();
  window.location.href = '/logout';
}
