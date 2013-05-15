if (typeof(define) === 'undefined') var define = function(name, fn) {
    this[name] = fn()
};

define('morseDecode', function() {
    var patternMap = {
        "-----": "0",
        ".----": "1",
        "..---": "2",
        "...--": "3",
        "....-": "4",
        ".....": "5",
        "-....": "6",
        "--...": "7",
        "---..": "8",
        "----.": "9",
        ".-": "A",
        "-...": "B",
        "-.-.": "C",
        "-..": "D",
        ".": "E",
        "..-.": "F",
        "--.": "G",
        "....": "H",
        "..": "I",
        ".---": "J",
        "-.-": "K",
        ".-..": "L",
        "--": "M",
        "-.": "N",
        "---": "O",
        ".--.": "P",
        "--.-": "Q",
        ".-.": "R",
        "...": "S",
        "-": "T",
        "..-": "U",
        "...-": "V",
        ".--": "W",
        "-..-": "X",
        "-.--": "Y",
        "--..": "Z",
        ".-.-": ".",
        "--..--": ",",
        "..--..": "?",
        ".----.": "'",
        "-.-.--": "!",
        "-..-.": "/",
        "-.--.": "(",
        "-.--.-": ")",
        ".-...": "&",
        "---...": ":",
        "-.-.-.": ";",
        "-...-": "=",
        ".-.-.": "+",
        "-....-": "-",
        "..--.-": "_",
        ".-..-.": "\"",
        "...-..-": "$",
        ".--.-.": "@"
    };



    var _export = {
        options: {
            pulseTime: 0.25,
        },
        addSequence: function(value) {
            // Check to make sure the value is valid.
            if (
            (value !== ".") && (value !== "-")) {
                // Invalid value.
                throw (new Error("InvalidTone"));
            };
            // Add the given value to the end of the current
            // sequence value.
            this._sequence += value;
            // Return this object reference.
            return (this);
        },
        dash: function() {
            // Reroute to the addSequence();
            return (this.addSequence("-"));
        },
        dot: function() {
            // Reroute to the addSequence();
            return (this.addSequence("."));
        },
        getAlphabet: function() {
            // Create the empty set.
            var characterSet = [];
            // Loop over the patterns to map them to a character
            // set item.
            for (var pattern in this._patternMap) {
                // Push it onto the set.
                characterSet.push({
                    sequence: pattern,
                    character: this._patternMap[pattern]
                });
            }
            // Sort the character set alphabetically.
            characterSet.sort(

            function(a, b) {
                return (a.character <= b.character ? -1 : 1);
            });
            // Return the character set.
            return (characterSet);
        },
        resetSequence: function() {
            // Clear the sequence.
            this._sequence = "";
        },
        resolvePartial: function() {
            // Create an array to hold our possible characters.
            var potentialCharacters = [];
            // Loop over the pattern match to find partial matches.
            for (var pattern in this._patternMap) {
                // Check to see if the current sequence can be
                // the start of the given pattern.
                if (pattern.indexOf(this._sequence) === 0) {
                    // Add this character to the list.
                    potentialCharacters.push(
                    this._patternMap[pattern]);
                }
            }
            // Return the potential character matches.
            return (potentialCharacters.sort());
        },
        resolveSequence: function() {
            // Check to see if the current sequence is valid.
            if (!this._patternMap.hasOwnProperty(this._sequence)) {
                // The sequence cannot be matched.
                throw (new Error("InvalidSequence"));
            }
            // Get the alpha-numeric mapping.
            var character = this._patternMap[this._sequence];
            // Reset the sequence.
            this._sequence = "";
            // Return the mapped character.
            return (character);
        },
    };
    
    return _export;

});