const express = require('express');
const Game = require("./model.js");
const url = require('url');
const cookieParser = require('cookie-parser');

var WebSocketServer = require('ws').Server
const app = express();
const port = 8000; 
wss = new WebSocketServer({port: port+1})

// lobbyCode : gameInstance
var gameDB = {};
// userCookies : lobbyCode
var userDB = {};
// lobbyCode : [userWebsockets]
var wsCache = {}
const questionBank = readQuestions();
const totalQuestions = 723;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

app.listen(port, function () {
    console.log('Example app listening on port '+port);
});


app.post('/api/createLobby', function (req, res) {
    let lobbyCode = '';
    for (let i=0;i<4;i++) {
        lobbyCode += characters.charAt(Math.floor(Math.random() * 36))
    }
    const cookie = Math.random().toString(36).substring(2);
	res.cookie('usercookie', cookie);
    gameDB[lobbyCode] = new Game();
    gameDB[lobbyCode].playerCount++;
    gameDB[lobbyCode].setQuestion(questionBank[Math.random() * totalQuestions])
    userDB[cookie] = [lobbyCode];
    res.status(200).json({ lobbyCode });
});

app.post('/api/JoinLobby/:lobbyCode', function (req, res) {
    // if (req.cookies.usercookie) {
        let lobbyCode=req.params.lobbyCode;
        if (!gameDB[lobbyCode]) {res.status(404); return;}
        const cookie = Math.random().toString(36).substring(2);
        res.cookie('usercookie', cookie);
        gameDB[lobbyCode].playerCount++;
        userDB[cookie] = lobbyCode;
        res.status(200).json({ lobbyCode });
});

wss.broadcast = function(lobbyCode, message) {
    wsCache[lobbyCode].forEach(function (ws){ws.send(JSON.stringify(message))});
}

wss.on('close', function() {
});

wss.on('connection', function(ws, req) {
	var lobbyCode =  url.parse(req.url, true).pathname.split('/')[2];
    console.log('lobbyCode:'+lobbyCode);
    if (wsCache[lobbyCode]) {
        wsCache[lobbyCode].push(ws);
    } else {
        wsCache[lobbyCode] = [ws];
    }
	wss.broadcast(lobbyCode, {'players' : gameDB[lobbyCode].playerCount});
});

wss.on('listening', () => {
    console.log('WebSocket server listening on port 8001');
});

function readQuestions() {
    try {
        const data = fs.readFileSync('questionbank.csv', 'utf8');
        return parseCSVData(data);
    } catch (error) {
        console.error('Error reading question bank data:', error);
        process.exit(1); // Terminate the process if an error occurs
    }
}

function parseCSVData(csvData) {
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    const parsedData = [];
    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',');
        const rowData = {};
        for (let j = 0; j < headers.length; j++) {
            rowData[headers[j].trim()] = columns[j].trim();
        }
        parsedData.push(rowData);
    }
    return parsedData;
}


// when someone clicks start, server starts the timer and broadcasts the first question then the timer every seccond, 
// on timer end color the question board with correct and false answers then after 3 seconds
// reset and broadcast the new question and restart timer