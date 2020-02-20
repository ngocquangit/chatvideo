const io = require('socket.io')(3000);
const arrInfo = [];
io.on('connection',socket =>
{
    socket.on('USER_SIGN_UP', user =>
    {
        const isExist = arrInfo.some(e => e.name === user.name);
        socket.peerId = user.peerId;
        if (isExist) {
            return socket.emit('SIGN_UP_FAIL'); 
        }
        arrInfo.push(user);
        socket.emit('LIST_ONLINE', arrInfo);
        socket.broadcast.emit('USER_NEW',user);
    });
    socket.on('disconnect',()=>
    {
        const index = arrInfo.findIndex(user =>
        user.peerId === socket.peerId);
        arrInfo.splice(index,1);
        io.emit('SOMEONE_DISCONNECT',socket.peerId);
    });
});
