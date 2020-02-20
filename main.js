const socket = io('http://localhost:3000');
$('#chat').hide();
socket.on('LIST_ONLINE', arrInfo =>
{
    $('#chat').show();
    $('#signUp').hide();
    arrInfo.forEach( user=>
        {
            const {name ,peerId} = user;
            $('#userOnline').append(`<li id= "${peerId}" class="liOnline">${name}</li></br>`)
        });
        socket.on('USER_NEW', user =>
        {
            const {name ,peerId} = user;
            $('#userOnline').append(`<li id= "${peerId}" class="liOnline">${name}</li></br>`)
        });
        socket.on('SOMEONE_DISCONNECT',peerId =>
        {
            $(`#${peerId}`).remove();
        });
});
socket.on('SIGN_UP_FAIL',()=> alert(' Vui lòng chọn tên người dùng khác !'));
function openStrem()
{
    const config = {audio : true,video : true};
    return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag,stream)
{
    const video = document.getElementById(idVideoTag);
    video.srcObject =stream;
    video.play();
}
// openStrem()
// .then(stream => playStream('localStream',stream));
const peer = new Peer();
peer.on('open',id =>{
    $('#btnSignUp').click(() =>
    {
        const userName = $('#yourName').val();
        socket.emit('USER_SIGN_UP', {name: userName , peerId : id});
        $('#myId').append(userName);
    });
});
//caller
$('#btnCall').click(() =>
{
    const id = $('#callId').val();
    openStrem()
    .then(stream => 
        {
            playStream('localStream',stream);
            const call = peer.call(id,stream);
            call.on('stream',remoteStream => 
            {
                playStream('remoteStream',remoteStream);
            });
        });
    
});
//Answer
peer.on('call', call =>
{
    openStrem()
    .then(stream =>
        {
            call.answer(stream);
            playStream('localStream',stream);
            call.on('stream',remoteStream => 
            {
                playStream('remoteStream',remoteStream);
            });
        });
});
$('#userOnline').on('click','li',function()
{
    const id = $(this).attr('id');
    openStrem()
    .then(stream => 
        {
            playStream('localStream',stream);
            const call = peer.call(id,stream);
            call.on('stream',remoteStream => 
            {
                playStream('remoteStream',remoteStream);
            });
        });
});