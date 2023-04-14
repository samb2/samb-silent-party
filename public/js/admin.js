const socket = io();
var audio = document.getElementById('myaudio');

function play(music) {
    audio.src = `/stream/${music}`;
    audio.play();
    socket.emit('select', { music });
}

audio.addEventListener('play', function () {
    socket.emit('play');
});
audio.addEventListener('pause', function () {
    socket.emit('pause');
});
