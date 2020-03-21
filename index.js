const express = require("express")();
const http = require("http").Server(express);
const serverSocket = require("socket.io")(http);

const porta = 8000;

http.listen(porta, function(){
	console.log("Servidor iniciado em http://localhost:" + porta);
});

express.get("/", function (requisicao, resposta) {
    resposta.sendFile(__dirname + "/index.html");
});

serverSocket.on("connection", function(socket){
    socket.login = "";

    socket.on("chat msg", function(msg){
        if(socket.login === ""){
            socket.login = msg;
            msg = socket.login + ": entrou...";
            console.log(msg);
            serverSocket.emit("chat msg", msg);
        }
        else{
            serverSocket.emit("chat msg", socket.login + ": " + msg);
        }

        console.log("Msg recebida do cliente " + socket.id + ": " + msg)

    });

    socket.on("status", function(msg){
        serverSocket.emit("status", msg);
    });

    socket.on("disconnect", function(msg){
        if(socket.login != ""){
            serverSocket.emit("chat msg", socket.login + ": saiu...");
        }
    });
});