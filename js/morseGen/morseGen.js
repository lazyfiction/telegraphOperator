/*
@Author: Petrus J Pretorius.
*/

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


    var makeMorseTable = function() {
        var table = $('<table class="morseTable"/>');
        var row, cnt = 0,
            columns = 10;
        $.each(patternMap, function(k, v) {

            if (cnt == 0) {
                if (row) table.append(row);
                row = $('<tr/>');
            }
            row.append($('<td class="morseKey">' + k + '</td><td class="morseVal">' + v + '</td>'))
            cnt++;
            cnt = cnt%columns;


        })
        if (row) table.append(row);
        $('body').append(table);
    }



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
        pausePulse = false,
        done = true,
        pulsePlaying = false,
        frameTime = 30; //ms


    var scheduleAudio = function() {
        var currentTime = audioCtx.currentTime;

        triggerPulse(currentTime);
        scheduleMorse(currentTime);
        if (!done) setTimeout(scheduleAudio, frameTime);
    };

    var triggerPulse = function(currentTime) {
        if (pausePulse) return;
        var options = _export.options;
        var currPulseCode = patternMap[options.phrase[phrasePos]];

        if (typeof(currPulseCode) === 'undefined') return;


        var currPulse = currPulseCode[morsePos];

        if (!pulsePlaying) {
            var pulseLength = currPulse == '.' ? 0.2 : 0.8;

            var beepSource = audioCtx.createOscillator();
            beepSource.frequency = 800;
            beepSource.connect(compressor);
            beepSource.start(currentTime);
            beepSource.stop(currentTime + (options.pulseTime * pulseLength));

            console.log("bleep " + currentTime + ":" + lastPulsetime + ":" + currPulse);
            pulsePlaying = true;
        }
    }

    var scheduleMorse = function(currentTime) {

        var options = _export.options;
        if (pausePulse) {
            if (currentTime > (options.pulseTime + lastPulsetime)) {
                lastPulsetime = currentTime;
                pausePulse = false;
            }
        }
        else {
            var currPulseCode = patternMap[options.phrase[phrasePos]];
            if (currPulseCode) {

                if (currentTime > (options.pulseTime + lastPulsetime)) {
                    pulsePlaying = false;
                    morsePos++;
                    lastPulsetime = currentTime;
                };

                if (morsePos >= currPulseCode.length) {
                    morsePos = 0;
                    phrasePos++;
                    pausePulse = true;
                    pulsePlaying = false;
                }
            }
            else { //the spaces
                if (currentTime > (options.pulseTime * 2 + lastPulsetime)) {
                    phrasePos++;
                    lastPulsetime = currentTime;
                }
            }

            if (phrasePos >= options.phrase.length) {
                done = true;
                return;
            }
        }
    };


    var _export = {
        options: {
            phrase: 'Foo',
            pulseTime: 0.5,
            variance: 0.02,
        },
        beepSourceRT: null,
        play: function(options) {

            $.extend(_export.options, _export.options, options);

            _export.options.phrase = _export.options.phrase.toUpperCase();
            phrasePos = 0;
            morsePos = 0;
            lastPulsetime = audioCtx.currentTime;
            done = false;
            scheduleAudio();
        },
        bleepOn: function() {
            var beepSource = _export.beepSourceRT = audioCtx.createOscillator();
            beepSource.frequency = 800;
            beepSource.connect(compressor);
            beepSource.start(0);
        },
        bleepOff: function() {
            _export.beepSourceRT.stop(0);
        },
        makeMorseTable: makeMorseTable
    };


    return _export;

});