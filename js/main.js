require.config({
    baseUrl: 'js',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',

    }


});

require(['jquery', 'morseGen/morseDecode', 'morseGen/morseGen', 'morseGen/switchBoardCodes'], function($,  morseDecode, morseGen, switchBoardCodes) {
    $(function() {
        morseGen.makeMorseTable();
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

        //morseGen.play({phrase:"Wild West Telegraph Operator Job", pulseTime: 0.125,variance: 0.005});


        $('#wpm').change(function(event) {
            //pulsetime = secondsinminute / (wordsperminute * wordlengthconstant * averagemorselength )
            mainPulse = 60 / ($('#wpm').val() * 7 * 5);
            $('.ms').html(mainPulse);

            mainVariance = mainPulse / pulseError;
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


            morseGen.bleepOn();

        });

        $('#lewiskey').mouseup(function(event) {


            morseGen.bleepOff();


            // Prevent any default action.
            event.preventDefault();
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
        });

        $('#hearMorse').click(function() {


            morseGen.play({
                phrase: $('#phrase').val(),
                pulseTime: Number($('.ms').html())
            });

        });
    });



});