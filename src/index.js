import p5 from 'p5';
import marked from 'marked';

let audio = new Audio(require('./audios/end_credits_royalty_free_music_6793518358239397151.mp3'));
let capture;
let font;
let ctx;
let width = window.innerWidth;
let height = window.innerHeight;
const inputContainer = document.getElementById('input-container');
const textInput = document.getElementById('text-input');
const canvasOverlay = document.getElementById('canvas-overlay');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
var isPlaying = false;

var mde = new SimpleMDE({
    element: textInput,
    toolbar: ['bold', 'italic', 'heading'],
    status: false
});

playBtn.onclick = () => {
    goFullScreen();

    audio.play();
    audio.loop = true;

    isPlaying = true;
    canvasOverlay.innerHTML = marked(mde.value());
    canvasOverlay.style.bottom = `${-1 * (canvasOverlay.offsetHeight + 20)}px`;

    stopBtn.style.visibility = 'visible';
    var intervalToHideContainer = setInterval(() => {
        inputContainer.style.right = `${parseInt(inputContainer.style.right) - 40}px`;

        if (parseInt(inputContainer.style.right) <= -inputContainer.offsetWidth) {
            clearInterval(intervalToHideContainer);
            var intervalToShowButton = setInterval(() => {
                stopBtn.style.right = `${parseInt(stopBtn.style.right) + 10}px`;

                if (parseInt(stopBtn.style.right) >= 10)
                    clearInterval(intervalToShowButton);
            }, 16);
        }
    }, 16);
}

document.addEventListener("fullscreenchange", () => {
    if (isPlaying && !document.fullscreenElement)
        stopBtn.click();

    if (!isPlaying && document.fullscreenElement)
        playBtn.click();
})

stopBtn.onclick = () => {
    audio.pause();
    audio.currentTime = 0;

    exitFullScreen();

    isPlaying = false;
    canvasOverlay.style.bottom = '-20px';
    canvasOverlay.innerHTML = '';

    var intervalToHideButton = setInterval(() => {
        stopBtn.style.right = `${parseInt(stopBtn.style.right) - 10}px`;

        if (parseInt(stopBtn.style.right) <= -100) {
            clearInterval(intervalToHideButton);
            var intervalToShowContainer = setInterval(() => {
                inputContainer.style.right = `${Math.min(10, parseInt(inputContainer.style.right) + 40)}px`;

                if (parseInt(inputContainer.style.right) >= 10)
                    clearInterval(intervalToShowContainer);
            }, 16);
        }
    }, 16);
}

function goFullScreen() {

    var elem = document.body;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    }
    else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
    else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (!document.fullscreenElement)
        return;

    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

}

const sketch = (s) => {
    s.windowResized = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        s.resizeCanvas(width, height);
    }
    s.preload = () => {
        font = s.loadFont(require('./fonts/PressStart2P-Regular.ttf'));
    }
    s.setup = () => {
        const parent = document.getElementById('canvas-parent');
        const cnv = s.createCanvas(width, height);
        ctx = cnv.canvas.getContext('2d');
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 10;
        cnv.parent(parent);

        capture = s.createCapture(s.VIDEO);
        capture.hide();
        s.textAlign(s.CENTER);
        s.textFont(font);
        s.fill('#ffffff');
        s.textSize(30);
    }

    s.draw = () => {
        s.background(0);
        s.image(capture, 0, 0, width, height);

        if (isPlaying) {
            canvasOverlay.style.bottom = `${parseInt(canvasOverlay.style.bottom) + 1}px`;
        }
    }
}

const sketchInstance = new p5(sketch);