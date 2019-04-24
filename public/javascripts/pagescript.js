const channel = '/data/ChangeEvents';
const replayId = -1;
let subscription;

jsforce.browser.init({
    clientId: process.env.clientId,
    redirectUri: process.env.redirectUri,
    loginUrl : process.env.loginUrl,
    version: process.env.apiVersion,
});
  
jsforce.browser.on('connect', function(conn) {
    // post information to /sessionId, then follow redirect link
    fetch( '/sessionId' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            accessToken: conn.accessToken,
            instanceUrl: conn.instanceUrl,
            orgId: conn.userInfo.organizationId
        })
    })
    .then( response => {
        if (response.status = 302) {
            window.location.href = response.url;
        }
    })
});

const logout = () => {    
    jsforce.browser.logout();
}