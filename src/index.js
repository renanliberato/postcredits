import p5 from 'p5';

let audio = new Audio(require('./audios/end_credits_royalty_free_music_6793518358239397151.mp3'));
let capture;
let font;
let ctx;
let width = window.innerWidth;
let height = window.innerHeight;
const inputContainer = document.getElementById('input-container');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const castInput = document.getElementById('cast-input');
const offeredInput = document.getElementById('offered-input');
var texts = [];
var isPlaying = false;

const initialY = height + 20;
playBtn.onclick = () => {
    goFullScreen();

    audio.play();
    audio.loop = true;

    isPlaying = true;
    var y = initialY;
    texts = [
        { text: 'Cast', y: y },
        ...castInput.value.split('\n').map(t => ({
            text: t,
            y: y = y += 50
        })),
    ];

    texts = [
        ...texts,
        {
            y: y = y += 100,
            text: 'Offered to you by'
        },
        {
            y: y = y += 50,
            text: offeredInput.value
        },
        ,
    ];

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
    texts = [];

    stopBtn.style.visibility = 'hidden';

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
            texts.forEach(t => {
                s.text(t.text, width / 2, t.y);
                t.y -= 1;
            });
        }
    }
}

const sketchInstance = new p5(sketch);