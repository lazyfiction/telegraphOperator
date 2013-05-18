define(function() {
    
    var scoreopts = ['0','1','2','3','4','5','6','7','8','9','0','1','2','3','4','5','6','7','8','9'];
    var symbolopts = ['/','$','@','&','+','=','-','"','%','0','/','$','@','&','+','=','-','"','%','0'];

    function clearSlots(jqo){
        jqo.html("");
    }
    
    function addSlotsScore(jqo) {
        for (var i = 0; i < 10; i++) {
            //var ctr = Math.floor(Math.random() * scoreopts.length);
            var cnt = Math.floor(Math.random() * 3);
            jqo.append("<div class='slot"+cnt+"'>" + scoreopts[i] + "</div>");
        }
    }
    
    function addSlotsSym(jqo) {
        for (var i = 0; i < 10; i++) {
            var cnt = Math.floor(Math.random() * 3);
            jqo.append("<div class='slot"+cnt+"'>" + symbolopts[i] + "</div>");
        }
    }

    function moveSlots(jqo,val) {
        var time = 6500;
        time += Math.round(Math.random() * 1000);
        jqo.stop(true, true);
        //var marginTop = parseInt(jqo.css("margin-top"))
        var marginTop = -(val * 46)
        jqo.animate({
            "margin-top": marginTop + "px"
        }, {
            'duration': time,
            'easing': "easeOutElastic"
        });

    }
    
    var _export = {
        show: function(score) {
            clearSlots($("#sb0 .wrapper"));
            clearSlots($("#sb1 .wrapper"));
            clearSlots($("#sb2 .wrapper"));
            
            addSlotsScore($("#sb0 .wrapper"));
            addSlotsScore($("#sb1 .wrapper"));
            addSlotsSym($("#sb2 .wrapper"));
            
            if(score != 100)
            {
                moveSlots($("#sb0 .wrapper"),Math.floor(score /10));
                moveSlots($("#sb1 .wrapper"),(score % 10));      
                moveSlots($("#sb2 .wrapper"),8);
            }else{
                moveSlots($("#sb0 .wrapper"),1);
                moveSlots($("#sb1 .wrapper"),0);      
                moveSlots($("#sb2 .wrapper"),9);
            }
        },
    };
    return _export;
});