define(function() {
    
    var scoreopts = ['0','1','2','3','4','5','6','7','8','9','0','1','2','3','4','5','6','7','8','9','0','1','2','3','4','5','6','7','8','9'];
    var symbolopts = ['/','$','@','&','+','=','-','"','%','0','/','$','@','&','+','=','-','"','%','0'];

    var clearSlots = function(jqo){
        jqo.html("");
        jqo.css("margin-top",0);
    }
    
    var resetSlots = function(jqo){
        jqo.css("margin-top",0);
    }
    
    var addSlotsScore = function(jqo) {
        for (var i = 0; i < scoreopts.length; i++) {
            var cnt = Math.floor(Math.random() * 3);
            jqo.append("<div class='slot"+cnt+"'>" + scoreopts[i] + "</div>");
        }
    }
    
    var addSlotsSym = function(jqo) {
        for (var i = 0; i < scoreopts.length; i++) {
            var cnt = Math.floor(Math.random() * 3);
            jqo.append("<div class='slot"+cnt+"'>" + symbolopts[i] + "</div>");
        }
    }

    var moveSlots = function(jqo,val) {
        var time = 6500;
        time += Math.round(Math.random() * 1000);
        jqo.stop(true, true);
        var marginTop = -(val * 46)
        jqo.animate({
            "margin-top": marginTop + "px"
        }, {
            'duration': time,
            'easing': "easeOutElastic"
        });

    }
    
    var _export = {
        init: function(){
            clearSlots($("#sb0 .wrapper"));
            clearSlots($("#sb1 .wrapper"));
            clearSlots($("#sb2 .wrapper"));
            
            addSlotsScore($("#sb0 .wrapper"));
            addSlotsScore($("#sb1 .wrapper"));
            addSlotsSym($("#sb2 .wrapper"));
        },
        show: function(score) {
           
            $('#scorebox').show();
            if(score != 100)
            {
                moveSlots($("#sb0 .wrapper"),Math.floor(score /10)+10);
                moveSlots($("#sb1 .wrapper"),(score % 10)+10);      
                moveSlots($("#sb2 .wrapper"),8);
            }else{
                moveSlots($("#sb0 .wrapper"),11);
                moveSlots($("#sb1 .wrapper"),10);      
                moveSlots($("#sb2 .wrapper"),9);
            }
        },
        hide: function(){
            $('#scorebox').hide();
            resetSlots($("#sb0 .wrapper"));
            resetSlots($("#sb1 .wrapper"));
            resetSlots($("#sb2 .wrapper"));
        }
    };
    return _export;
});