require.config({
    baseUrl: 'js',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',

    }


});

require(['jquery', 'desk', 'morseGen/morseGen', ], function($, desk, morseGen) {
    $(function() {
        morseGen.makeMorseTable();
        desk.init('mainContent');

    });



});