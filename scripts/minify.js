var compressor = require('node-minify');

var files=[
    "js/jsqueue.js",
    "js/jsqueue-animate.js",
    "js/jsqueue-calendar.js",
    "js/jsqueue-core.js",
    "js/jsqueue-debug.js",
    "js/jsqueue-modal.js",
    "js/jsqueue-time.js",
    "js/jsqueue-tools.js",
    "js/jsqueue-workflow.js",
    "js/libs/base64.js",
    "js/libs/Chart.min.js",
    "js/libs/fullcalendar.min.js",
    "js/libs/jquery.dataTables.min.js",
    "js/libs/jsrender.js",
    "js/libs/jsrender-helpers.js",
    "js/libs/moment.js",
    "js/libs/perfect-scrollbar.jquery.min.js",
    "js/libs/prettyprint.js"
];

new compressor.minify({
    type: 'gcc',
    fileIn: files,
    fileOut: 'jsqueue.min.js',
    buffer: 100000 * 1024,
    callback: function(err, min){
        if(err)
            console.log('ERROR:'+err);
        else
            console.log('Built');
    }
});

