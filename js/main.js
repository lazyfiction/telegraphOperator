require.config({
    baseUrl: 'js',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        //jqeasing: '//gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js',
    }
});

require(['jquery', 'desk', 'morseGen/morseGen', ], function($, desk, morseGen) {
    $(function() {
        desk.init('mainContent');
    });
});