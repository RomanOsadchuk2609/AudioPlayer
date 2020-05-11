let audio, file;

window.onload = function () {
    file = document.getElementById("fileChooser");
    audio = document.getElementById("audio");
    file.onchange = function () {
        console.log("file.onchange: " + file.value);
        let files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        drawAmplitude();
    };
};

function play() {
    audio.play();
}

function pause() {
    audio.pause();
}

function stop() {
    audio.pause();
    audio.currentTime = 0;
}

function restart() {
    audio.currentTime = 0;
    audio.play();
}

function drawAmplitude() {
    let context = new AudioContext();
    let src = context.createMediaElementSource(audio);
    let analyser = context.createAnalyser();

    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    let bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    let dataArray = new Uint8Array(bufferLength);

    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;

    let barWidth = (WIDTH / bufferLength) * 0.6;
    let barHeight;
    let x1 = WIDTH / 2;
    let x2 = WIDTH / 2;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x1 = WIDTH / 2;
        x2 = WIDTH / 2;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let r = barHeight + (1 * (i / bufferLength));
            let g = 50 * (i / bufferLength);
            let b = 200;

            /*let g = barHeight + (150 * (i/bufferLength));
            let r = 150 * (i/bufferLength);
            let b = 100;*/

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            barHeight = barHeight * 2;
            ctx.fillRect(x1, HEIGHT - barHeight, barWidth, barHeight * 1.5);
            ctx.fillRect(x2, HEIGHT - barHeight, barWidth, barHeight * 1.5);

            /*
            ctx.fillRect(x1, HEIGHT/2 - barHeight/2, barWidth, barHeight);
            ctx.fillRect(x2, HEIGHT/2 - barHeight/2, barWidth, barHeight);*/

            x1 += barWidth + 1;
            x2 -= barWidth + 1;
        }
    }

    renderFrame();
}
