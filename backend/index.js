const express = require('express');
var WebSocketServer = require('ws').Server

const app = express();
const port = 8000; 
wss = new WebSocketServer({port: port+1})
// const cookieParser = require('cookie-parser');



app.listen(port, function () {
    console.log('Example app listening on port '+port);
});