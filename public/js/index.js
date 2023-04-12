const socket = io();
const audioPlayer = document.getElementById('audioPlayer');
const streamPipeUrl = '/stream';
const source = document.createElement('source');
source.setAttribute('src', streamPipeUrl);
audioPlayer.appendChild(source);
audioPlayer.load();
audioPlayer.play();