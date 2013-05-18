define(function() {
    
    var scoreopts = ['0','1','2','3','4','5','6','7','8','9'];
    var symbolopts = ['%','$','@','&','+','=','-','"','_','/'];

    
    
    function addSlotsScore(jqo) {
        for (var i = 0; i < 10; i++) {
            //var ctr = Math.floor(Math.random() * scoreopts.length);
            var cnt = Math.floor(Math.random() * 3);
            jqo.append("<div class='slot"+cnt+"'>" + scoreopts[i] + "</div>");
        }
    }
    
    function addSlotsSym(jqo) {
        for (var i = 0; i < 10; i++) {
            var ctr = Math.floor(Math.random() * symbolopts.length);
            var cnt = Math.floor(Math.random() * 3);
            jqo.append("<div class='slot"+cnt+"'>" + symbolopts[ctr] + "</div>");
        }
    }

    function moveSlots(jqo) {
        var time = 6500;
        time += Math.round(Math.random() * 1000);
        jqo.stop(true, true);
        var marginTop = parseInt(jqo.css("margin-top"), 10)
        marginTop -= (7 * 100)
        jqo.animate({
            "margin-top": marginTop + "px"
        }, {
            'duration': time,
            'easing': "easeOutElastic"
        });

    }
    
    var _export = {
        show: function(score) {
            addSlotsScore($("#sb0 .wrapper"));
            moveSlots($("#sb0 .wrapper"));
            addSlotsScore($("#sb1 .wrapper"));
            moveSlots($("#sb2 .wrapper"));
            addSlotsSym($("#sb2 .wrapper"));
            moveSlots($("#sb2 .wrapper"));
        },
    };
    return _export;
});