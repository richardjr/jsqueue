var compressor = require('node-minify');

var desktopFiles = [
    "js/jsqueue.js",
    "js/jsqueue-animate.js",
    "js/jsqueue-calendar.js",
    "js/jsqueue-core.js",
    "js/jsqueue-debug.js",
    "js/jsqueue-modal.js",
    "js/jsqueue-time.js",
    "js/jsqueue-tools.js",
    "js/jsqueue-workflow.js"
];

var mobileFiles = [
    "js/jsqueue.js",
    "js/jsqueue-core.js",
    "js/jsqueue-tools.js",
    "js/jsqueue-workflow.js"
];

new compressor.minify({
    type: 'gcc',
    fileIn: desktopFiles,
    fileOut: 'jsqueue-desktop.min.js',
    buffer: 100000 * 1024,
    options: ['--compilation_level=SIMPLE_OPTIMIZATIONS', '--warning_level=QUIET'],
    callback: function(err, min) {
        if (err) {
            console.log('ERROR: ' + err);
        }
        else {
            console.log('Built desktop files');
        }

        new compressor.minify({
            type: 'gcc',
            fileIn: mobileFiles,
            fileOut: 'jsqueue-mobile.min.js',
            buffer: 100000 * 1024,
            options: ['--compilation_level=SIMPLE_OPTIMIZATIONS', '--warning_level=QUIET'],
            callback: function(err, min) {
                if (err) {
                    console.log('ERROR: ' + err);
                }
                else {
                    console.log("Built mobile files");
                }
            }
        })
    }
});

