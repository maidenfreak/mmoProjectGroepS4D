var snd1  = new Audio();
var src1  = document.createElement("source");
src1.type = "audio/mpeg";
src1.src  = "sounds/gunshotswat.mp3";
snd1.appendChild(src1);

var snd2  = new Audio();
var src2  = document.createElement("source");
src2.type = "audio/mpeg";
src2.src  = "sounds/deatheffectrebels.mp3";
snd2.appendChild(src2);

var snd3  = new Audio();
var src3  = document.createElement("source");
src3.type = "audio/mpeg";
src3.src  = "sounds/ambience.mp3";
snd3.appendChild(src3);

//Zorgt voor loopende achtergrond muziek
snd3.addEventListener('timeupdate', function(){
  var buffer = .01
  if(this.currentTime > this.duration - buffer){
    this.currentTime = 0
    this.play()
  }
}, false);

var snd4  = new Audio();
var src4  = document.createElement("source");
src4.type = "audio/mpeg";
src4.src  = "sounds/join.mp3";
snd4.appendChild(src4);

var snd5  = new Audio();
var src5  = document.createElement("source");
src5.type = "audio/mpeg";
src5.src  = "sounds/deatheffectswat.mp3";
snd5.appendChild(src5);

var snd6  = new Audio();
var src6  = document.createElement("source");
src6.type = "audio/mpeg";
src6.src  = "sounds/startmatchswat.mp3";
snd6.appendChild(src6);

var snd7  = new Audio();
var src7  = document.createElement("source");
src7.type = "audio/mpeg";
src7.src  = "sounds/gunempty.mp3";
snd7.appendChild(src7);

var snd8  = new Audio();
var src8  = document.createElement("source");
src8.type = "audio/mpeg";
src8.src  = "sounds/ammopickup.mp3";
snd8.appendChild(src8);

var snd9  = new Audio();
var src9  = document.createElement("source");
src9.type = "audio/mpeg";
src9.src  = "sounds/healthpickup.mp3";
snd9.appendChild(src9);

var snd10  = new Audio();
var src10  = document.createElement("source");
src10.type = "audio/mpeg";
src10.src  = "sounds/bulletonwall.mp3";
snd10.appendChild(src10);

var snd11  = new Audio();
var src11  = document.createElement("source");
src11.type = "audio/mpeg";
src11.src  = "sounds/startmatchrebels.mp3";
snd11.appendChild(src11);

var snd12  = new Audio();
var src12  = document.createElement("source");
src12.type = "audio/mpeg";
src12.src  = "sounds/bulletonwall.mp3";
snd12.appendChild(src12);

var snd13  = new Audio();
var src13  = document.createElement("source");
src13.type = "audio/mpeg";
src13.src  = "sounds/enemyhitsound.mp3";
snd13.appendChild(src13);

var snd14  = new Audio();
var src14  = document.createElement("source");
src14.type = "audio/mpeg";
src14.src  = "sounds/hitbyenemy.mp3";
snd14.appendChild(src14);

var snd15  = new Audio();
var src15  = document.createElement("source");
src15.type = "audio/mpeg";
src15.src  = "sounds/bulletonwalldistant.mp3";
snd15.appendChild(src15);

snd3.play();

var channel_max = 15;										// number of channels
audiochannels = new Array();
for (a=0;a<channel_max;a++) {									// prepare the channels
    audiochannels[a] = new Array();
    audiochannels[a]['channel'] = new Audio();						// create a new audio object
    audiochannels[a]['finished'] = -1;							// expected end time for this channel
}
function play_multi_sound(s) {
    for (a=0;a<audiochannels.length;a++) {
        thistime = new Date();
        if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
            audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
            audiochannels[a]['channel'].src = document.getElementById(s).src;
            audiochannels[a]['channel'].load();
            audiochannels[a]['channel'].play();
            break;
        }
    }
}