if (typeof(define) === 'undefined') var define = function(name, fn) {
    this[name] = fn()
};

define('morseListener', function() {



    var _export = {
        options: {
            pulseTime: 0.25,
        },
        keydown: function(value) {
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
    };
    
    return _export;

});