const channel = '/data/ChangeEvents';
const replayId = -1;
let subscription;

jsforce.browser.init({
    clientId: '3MVG9CEn_O3jvv0zQGZ3RC8AeiMSjxon81whEHIKuwS6_CFiVtuINv6ojt1Ma0nS._BjkRmrN0RFL2ujuuPoU',
    redirectUri: 'http://localhost:1717',
    loginUrl : 'https://test.salesforce.com',
    version: '46.0',
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