const socket=io('/');
const videoGrid=document.getElementById("video-grid")
const myPeer=new Peer(undefined,{
    host:'/',
    port:'3001'
})
const myVideo=document.createElement('video');
const id =document.createElement("span")
myVideo.muted=true;
const peers={};
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(myVideo,stream);


    myPeer.on('call',call=>{
        const video = document.createElement('video');

        call.answer(stream);
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream);
        })
    })

    socket.on('user-connected',userId=>{
        connectToNewUser(userId,stream);
    });
});
socket.on('user-disconnected',userId=>{
    // console.log(userId);
    if(peers[userId])peers[userId].close();
})
function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video)
    // videoGrid.append(id)
}
myPeer.on('open',id=>{
    socket.emit("join-room",ROOM_ID,id);

})
function connectToNewUser(userId,stream){
    const video = document.createElement('video');
const call =myPeer.call(userId,stream);
call.on('stream',userVideoStream=>{
    addVideoStream(video,userVideoStream);
    // video.appendChild(`<p>${userId}</p>`)
})
call.on('close',()=>{
    video.remove();
})
peers[userId]=call;
}
// socket.on('user-connected',userId=>{
//     console.log("User connected " + userId);
// })