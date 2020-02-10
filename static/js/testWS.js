//this file to test webSocket 
let sock=io.connect("ws://localhost:9000/");
document.onclick=function(){
    sock.emit('a',12,5);
};
