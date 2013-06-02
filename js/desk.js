define(['jquery', 'morseGen/morseDecode', 'morseGen/morseGen', 'morseGen/switchBoardCodes', 'scoring/levenshtein', 'scoring/display', 'jquery.easing.min'], function($, morseDecode, morseGen, switchBoardCodes, levenshtein, displayscore, jqe) {

    var pulseError = 90;
    var mainPulse = 0.250;
    var mainVariance = mainPulse / pulseError;
    // Get the dot and dash durations (in milliseconds).
    var dotDuration = morseDecode.getDotDuration();
    var dashDuration = morseDecode.getDashDuration();
    var pauseDuration = morseDecode.getPauseDuration();
    // Store the date/time for the keydown.
    var keyDownDate = null;
    // Keep a timer for post-key resolution for characters.
    var resolveTimer = null;
    // Keep a timer for adding a new space to the message.
    var spaceTimer = null;
    var keydown = false;

    var showScore = function() {
        //score = (outputstring.length -levenshtein_distance(outputstring,inputstring) )/inpustring.length * 100
        var outpt = $('#output').val().toUpperCase();
        var inpt = $('#input').val().toUpperCase();
        // strings same length to prevent false positives
        if (outpt.length > inpt.length) {
            outpt = outpt.substring(0, inpt.length);
        }
        if (outpt.length < inpt.length) {
            while (outpt.length < inpt.length)
            outpt += " ";
        }
        var score = ((outpt.length - levenshtein.levenshteinenator(outpt, inpt)) / inpt.length) * 100;
        score = Math.floor(score);
        $('#score').html(score + '%');
        displayscore.show(score);
    }

    var lewisKeyDown = function() {
        if (keydown) return;
        keydown = true;
        morseGen.bleepOn();
        // Check to see if there is a key-down date. If
        // so, then exit - we only want the first press
        // event to be registered.
        if (keyDownDate) {
            // Don't process this event.
            return;
        }
        // Clear the resolution timer.
        clearTimeout(resolveTimer);
        // Clear the space timer.
        clearTimeout(spaceTimer);
        // Store the date for this key-down.
        keyDownDate = new Date();


    }

    var lewisKeyUp = function() {
        if (!keydown) return;
        keydown = false;
        morseGen.bleepOff();

        // Determine the keypress duration.
        var keyPressDuration = ((new Date()) - keyDownDate);
        // Clear the key down date so subsequent key
        // press events can be processed.
        keyDownDate = null;
        // Check to see if the duration indicates a dot
        // or a dash.
        if (keyPressDuration <= dotDuration) {
            // Push a dot.
            morseDecode.dot();
        }
        else {
            // Push a dash.
            morseDecode.dash();
        }
        // Display the possible characters for the current
        // sequence.
        $('.preview').html(morseDecode.resolvePartial().join(" , "));
        // Now that the key has been pressed, we need to
        // wait a bit to see if we need to resolve the
        // current sequence (if the user doesn't interact
        // with the interpreter, we'll resolve).
        resolveTimer = setTimeout(


        function() {
            // Try to resolve the sequence.
            try {
                // Get the character respresented by
                // the current sequence.
                var character = morseDecode.resolveSequence();
                $('#output').append(character);

                //morseGen.play({phrase:character, pulseTime:mainPulse});

            }
            catch (e) {
                // Reset the sequence - something
                // went wrong with the user's input.
                morseDecode.resetSequence();
            }
            // Clear the possible matches.
            $('.preview').html("");
            // Set a timer to add a new space to the
            // message.
            spaceTimer = setTimeout(

            function() {
                // Add a "space".
                $('#output').append(" ");
            }, (pauseDuration * 5));
        }, (pauseDuration * 3));
    }

    var setTime = function(date) {
        var mins = date.getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min").css({
            "transform": mrotate
        });

        var hours = date.getHours();
        var hdegree = hours * 6;
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#hour").css({
            "transform": hrotate
        });
    }

    var init = function(e) {

        if ($('#' + e)) $('#' + e).html(_export.html);
        displayscore.init();
        setTime(new Date());

        $('#wpm').change(function(event) {
            //pulsetime = secondsinminute / (wordsperminute * wordlengthconstant * averagemorselength )
            mainPulse = 60 / ($('#wpm').val() * 7 * 5);
            $('.ms').html(mainPulse);
            morseDecode.setDotDuration(mainPulse);
            mainVariance = mainPulse / pulseError;
        });
        
        $('#gamemode').change(function(event){
            if($('#gamemode').val() == 'easy')
            {
                $('#easymode').show();
            }else{
                $('#easymode').hide();
            }
        });

        $('#easymode').keydown(function(event) {
            if (event.which != 13 && event.which != 190 && event.which != 189) {
                event.preventDefault();
            }
            else {
                if (event.which == 13) {
                    try {
                        var out = morseDecode.resolveSequence();
                        $('#output').append(out);

                        morseGen.play({
                            phrase: out,
                            pulseTime: mainPulse,
                            variance: mainVariance
                        });
                    }
                    catch (err) {
                        alert("Invalid Morse Sukka Fool!");
                        morseDecode.resetSequence();
                    }

                    $('.preview').html("");
                    $('#easymode').val("");
                    event.preventDefault();
                }
                if (event.which == 190) {
                    morseDecode.dot();
                    $('.preview').html(morseDecode.resolvePartial().join(" , "));
                }
                if (event.which == 189) {
                    morseDecode.dash();
                    $('.preview').html(morseDecode.resolvePartial().join(" , "));
                }
            }

        });

        $('#lewiskey').mousedown(function(event) {
            // Prevent any default action.
            event.preventDefault();

            lewisKeyDown();
        });

        $('#lewiskey,#mainContent').mouseup(function(event) {

            // Prevent any default action.
            event.preventDefault();
            lewisKeyUp();

        });

        $('#hearMorse').click(function() {


            morseGen.play({
                phrase: $('#phrase').val(),
                pulseTime: Number($('.ms').html())
            });

        });

        $('#playButton').click(function() {
            $('#splashScreen').hide();
            $('#mainContent').show();
            morseGen.play({
                phrase: 'WWTOJ 1.0',
                pulseTime: Number($('.ms').html())
            });
        });

        $('#sscore').click(function() {
            showScore();
        });

        var applyCSSTransForm = function(sel, transform) {
            var e = $(sel);
            e.css('-webkit-transform', transform);
            e.css('-ms-transform', transform);
            e.css('-moz-transform', transform);
            e.css('-o-transform', transform);
            e.css('transform', transform);
        }

        $('#lewiskeyImg').mousedown(function(event) {
            lewisKeyDown();
            var transform = 'perspective(300px) translate(1px,-15px) rotateX(-8deg) translate(-1px,15px)';
            applyCSSTransForm(this, transform);
        });
        $('#lewiskeyImg').mouseup(function(event) {
            lewisKeyUp();
            var transform = 'rotate(0deg)';
            applyCSSTransForm(this, transform);
        });
        $('#lewiskeyImg').mouseleave(function(event) {
            lewisKeyUp();
            var transform = 'rotate(0deg)';
            applyCSSTransForm(this, transform);
        });

        $('#lewiskeyImg, #morseSheet').on('dragstart', function(event) {
            event.preventDefault();
        });

        var morseSheetOpen = false,
            transformClosed = 'perspective(582px) rotateX(28deg) translate(125px, 223px) scale(0.27)',
            transformOpen = 'translate(10px, 123px)';

        $('#morseSheet').click(function(event) {
            if (morseSheetOpen) {
                morseSheetOpen = false;
                applyCSSTransForm(this, transformClosed);
            }
            else {
                morseSheetOpen = true;
                applyCSSTransForm(this, transformOpen);
            }
        });

        $('#morseSheet').mouseleave(function(event) {

            morseSheetOpen = false;
            applyCSSTransForm(this, transformClosed);
        });

    }
    var _export = {
        html: '\
           <div id="exchange">\
                <input type="checkbox" id="ex0" checked />\
                <input type="checkbox" id="ex1" checked />\
                <input type="checkbox" id="ex2" checked />\
                <input type="checkbox" id="ex3" checked />\
                <input type="checkbox" id="ex4" checked />\
                <input type="checkbox" id="ex5" checked />\
            </div>\
            <textarea id="output"></textarea>\
            <div id="clock">\
                <div id="hour"></div>\
                <div id="min"></div>\
            </div>\
            <div id="scoreBox" style="display:none;" src="img/scoreBox.png" >\
                <div class="slots"  id="sb0">\
                    <div class="wrapper" ></div>\
                </div>\
                <div class="slots"  id="sb1">\
                    <div class="wrapper" ></div>\
                </div>\
                <div class="slots"  id="sb2">\
                <div class="wrapper" ></div>\
                </div>\
            </div>\
            <img id="lewiskeyImg" src="img/LewisKeysm.png" />\
            <img id="morseSheet" src="img/morseSheet.png" />\
        ',
        init: init
    };

    return _export;

});