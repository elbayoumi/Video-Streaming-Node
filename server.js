const express = require('express');
const app =express();
const server=require("http").Server(app);
const io = require("socket.io")(server);
const {v4:uuidV4}=require("uuid");
const PORT=3331;



app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/room", function(req,res){
res.redirect(`/${uuidV4()}`)
});
app.get("/",function(req,res){
    res.render("welcome")
})
app.get("/:room",(req,res)=>{
    res.render("room",{roomId:req.params.room})
});

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
  

        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on('disconnect',()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
    });
});



server.listen(PORT, function(){
    console.log(`Server listening on http://127.0.0.1:${PORT}`);
})