if (typeof(define) === 'undefined') var define = function(name, fn) {
    this[name] = fn()
};

define('morseGen', function() {

    var audioSupported;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        audioSupported = true;
    }
    else {
        return console.log("No audio support in this browser.");
    }

    var patternMap = {
        "0": "-----",
        "1": ".----",
        "2": "..---",
        "3": "...--",
        "4": "....-",
        "5": ".....",
        "6": "-....",
        "7": "--...",
        "8": "---..",
        "9": "----.",
        "A": ".-",
        "B": "-...",
        "C": "-.-.",
        "D": "-..",
        "E": ".",
        "F": "..-.",
        "G": "--.",
        "H": "....",
        "I": "..",
        "J": ".---",
        "K": "-.-",
        "L": ".-..",
        "M": "--",
        "N": "-.",
        "O": "---",
        "P": ".--.",
        "Q": "--.-",
        "R": ".-.",
        "S": "...",
        "T": "-",
        "U": "..-",
        "V": "...-",
        "W": ".--",
        "X": "-..-",
        "Y": "-.--",
        "Z": "--..",
        ".": ".-.-",
        ",": "--..--",
        "?": "..--..",
        "'": ".----.",
        "!": "-.-.--",
        "/": "-..-.",
        "(": "-.--.",
        ")": "-.--.-",
        "&": ".-...",
        ":": "---...",
        ";": "-.-.-.",
        "=": "-...-",
        "+": ".-.-.",
        "-": "-....-",
        "_": "..--.-",
        "\"": ".-..-.",
        "$": "...-..-",
        "@": ".--.-."
    };


    var mainVol, compressor, audioCtx = new AudioContext();




    mainVol = audioCtx.createGainNode();
    // Connect MainVol to final destination
    mainVol.connect(audioCtx.destination);
    mainVol.gain.value = 0.5;
    compressor = audioCtx.createDynamicsCompressor();

    compressor.connect(mainVol);




    var phrasePos = 0,
        morsePos = 0,
        lastPulsetime = 0,
        done = true,
        pulsePlaying = false,
        frameTime = 30; //ms


    var _export = {
        options: {
            phrase: 'Foo',
            pulseTime: 0.5,
            variance: 0.02,
        },
        play: function(options) {

            $.extend(_export.options, _export.options, options);

            _export.options.phrase = _export.options.phrase.toUpperCase();
            phrasePos = 0;
            morsePos = 0;
            lastPulsetime = audioCtx.currentTime;
            done = false;
            _export.scheduleAudio();
        },
        scheduleAudio: function() {
            var currentTime = audioCtx.currentTime;
            _export.scheduleMorse(currentTime);
            if (!done) setTimeout(_export.scheduleAudio, frameTime);
        },
        scheduleMorse: function(currentTime) {
            var options = _export.options;

            var currPulseCode = patternMap[options.phrase[phrasePos]];

            if (currPulseCode) {

                if (currentTime > (options.pulseTime + lastPulsetime)) {
                    morsePos++;

                    lastPulsetime = currentTime;
                };

                if (morsePos >= currPulseCode.length) {
                    morsePos = 0;
                    phrasePos++;
                }

            }
            else { //the spaces
                if (currentTime > (options.pulseTime * 4 + lastPulsetime)) {
                    phrasePos++;
                    lastPulsetime = currentTime;
                }
            }

            if (phrasePos >= options.phrase.length) {
                done = true;
                return;
            }

            currPulseCode = patternMap[options.phrase[phrasePos]];

            if (typeof(currPulseCode) === 'undefined') return;

            var currPulse = currPulseCode[morsePos];

            var pulsePos = (currentTime - lastPulsetime) / options.pulseTime;
            var pulseLength = currPulse == '.' ? 0.2 : 0.8;
            if ((pulsePos < pulseLength) && (!pulsePlaying)) {
                var beepSource = audioCtx.createOscillator();
                beepSource.frequency = 800;
                beepSource.connect(compressor);
                beepSource.start(currentTime);
                beepSource.stop(currentTime + (options.pulseTime * pulseLength));

                console.log("bleep " + currentTime +":"+lastPulsetime+":"+currPulse);
                pulsePlaying = true;
            }
            else if ((pulsePos > pulseLength) && (pulsePlaying)) {
                pulsePlaying = false;
            }

        },
    };


    return _export;

});