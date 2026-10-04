```javascript
let recognition;

let isRecording = false;

let startTime = 0;

let timerInterval;

let finalTranscript = "";


// Get HTML elements

const startBtn =
    document.getElementById("startBtn");

const stopBtn =
    document.getElementById("stopBtn");

const statusText =
    document.getElementById("status");

const transcript =
    document.getElementById("transcript");

const wordCount =
    document.getElementById("wordCount");

const timeCount =
    document.getElementById("timeCount");

const wpm =
    document.getElementById("wpm");

const speedValue =
    document.getElementById("speedValue");

const speedMessage =
    document.getElementById("speedMessage");

const timer =
    document.getElementById("timer");


// Check browser support

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (!SpeechRecognition) {

    statusText.textContent =
        "Speech recognition is not supported. Please use Google Chrome.";

    startBtn.disabled = true;
}


// Start recording

function startRecording() {

    if (!SpeechRecognition) {
        return;
    }

    recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = true;

    recognition.interimResults = true;


    finalTranscript = "";

    transcript.textContent =
        "Listening...";


    recognition.onstart = function () {

        isRecording = true;

        startTime = Date.now();

        startBtn.disabled = true;

        stopBtn.disabled = false;

        statusText.textContent =
            "🎙️ Listening... Start speaking!";

        startTimer();

    };


    recognition.onresult = function (event) {

        let interimTranscript = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const text =
                event.results[i][0].transcript;

            if (
                event.results[i].isFinal
            ) {

                finalTranscript +=
                    text + " ";

            } else {

                interimTranscript += text;

            }
        }


        transcript.textContent =
            finalTranscript +
            interimTranscript;


        updateWordCount();

        calculateSpeed();

    };


    recognition.onerror = function (event) {

        console.log(
            "Speech recognition error:",
            event.error
        );

        statusText.textContent =
            "Speech recognition error: " +
            event.error;

    };


    recognition.onend = function () {

        if (isRecording) {

            try {
                recognition.start();
            } catch (error) {
                console.log(error);
            }

        }

    };


    try {

        recognition.start();

    } catch (error) {

        console.log(error);

    }

}


// Stop recording

function stopRecording() {

    isRecording = false;

    if (recognition) {

        recognition.stop();

    }

    stopTimer();

    startBtn.disabled = false;

    stopBtn.disabled = true;

    statusText.textContent =
        "Recording stopped.";

    calculateSpeed();

}


// Timer

function startTimer() {

    clearInterval(timerInterval);

    timerInterval =
        setInterval(function () {

            const elapsed =
                Math.floor(
                    (Date.now() - startTime) / 1000
                );

            updateTimer(elapsed);

        }, 1000);

}


// Stop timer

function stopTimer() {

    clearInterval(timerInterval);

}


// Update timer

function updateTimer(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    timer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0");

    timeCount.textContent =
        seconds + " sec";

}


// Update word count

function updateWordCount() {

    const text =
        finalTranscript.trim();

    if (text === "") {

        wordCount.textContent =
            "0";

        return;
    }

    const words =
        text.split(/\s+/);

    wordCount.textContent =
        words.length;

}


// Calculate WPM

function calculateSpeed() {

    const text =
        finalTranscript.trim();

    if (text === "") {

        wpm.textContent =
            "0 WPM";

        speedValue.textContent =
            "0";

        speedMessage.textContent =
            "Start speaking to calculate your speed.";

        return;
    }


    const words =
        text.split(/\s+/).length;


    let elapsedSeconds =
        (Date.now() - startTime) / 1000;


    if (elapsedSeconds < 1) {

        elapsedSeconds = 1;

    }


    const minutes =
        elapsedSeconds / 60;


    const calculatedWPM =
        Math.round(words / minutes);


    wpm.textContent =
        calculatedWPM + " WPM";

    speedValue.textContent =
        calculatedWPM;


    updateSpeedMessage(calculatedWPM);

}


// Speed message

function updateSpeedMessage(speed) {

    if (speed < 100) {

        speedMessage.textContent =
            "🐢 Your speaking speed is slow. Try speaking a little faster.";

    } else if (speed < 130) {

        speedMessage.textContent =
            "👍 Your speaking speed is comfortable and clear.";

    } else if (speed < 160) {

        speedMessage.textContent =
            "🌟 Great! Your speaking speed is in a good range.";

    } else if (speed < 190) {

        speedMessage.textContent =
            "⚡ You are speaking quite fast. Try to maintain clarity.";

    } else {

        speedMessage.textContent =
            "🚀 Very fast! Consider slowing down for better understanding.";
    }

}


// Clear analyzer

function clearAnalyzer() {

    isRecording = false;

    if (recognition) {

        recognition.stop();

    }

    stopTimer();

    finalTranscript = "";

    startTime = 0;

    transcript.textContent =
        "Your recognized speech will appear here...";

    wordCount.textContent =
        "0";

    timeCount.textContent =
        "0 sec";

    wpm.textContent =
        "0 WPM";

    speedValue.textContent =
        "0";

    speedMessage.textContent =
        "Start speaking to calculate your speed.";

    timer.textContent =
        "00:00";

    statusText.textContent =
        'Click "Start Speaking" and begin talking.';

    startBtn.disabled = false;

    stopBtn.disabled = true;
}
```
