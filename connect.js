var WebSocketClient = require('websocket').client;

var retryTime = 10; // Time (in seconds) before the bot retries a failed connection.

var con;

function connect() {
    var client = new WebSocketClient();

    client.on('connectFailed', error => {
        errorMsg('Connection failed with error: ' + error + ". Retrying in " + retryTime + "s.");
        setTimeout(connect, retryTime * 1000);
    });

    client.on('connect', connection => {
        Connection = connection;
        statusMsg('WebSocket Client Connected');
        connection.on('error', error => {
            errorMsg(error + ". Reconnecting in " + retryTime + "s.");
            setTimeout(connect, retryTime * 1000);
        });
        connection.on('close', () => {
            statusMsg("Closed connection, reconnecting in " + retryTime + "s.");
            setTimeout(connect, retryTime * 1000);
        });
        connection.on('message', message => {
            Handler.parse(message.utf8Data);
        });
    });

    statusMsg("Connecting...");
    client.connect('ws://' + Config.host + ':' + Config.port + '/showdown/websocket');
}

connect();
