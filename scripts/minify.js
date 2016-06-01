var compressor = require('node-minify');
const exec = require('child_process').exec;

var desktopFiles = [
    "js/jsqueue.js",
    "js/jsqueue-animate.js",
    "js/jsqueue-calendar.js",
    "js/jsqueue-core.js",
    "js/jsqueue-modal.js",
    "js/jsqueue-time.js",
    "js/jsqueue-tools.js",
    "js/jsqueue-workflow.js"
];


/**
 *  Copy in the latest libs (update with npm install)
 */
exec('/bin/cp node_modules/jquery/dist/jquery.js js/libs/jquery', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/jquery/dist/jquery.min.js js/libs/jquery', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

new compressor.minify({
    type: 'gcc',
    fileIn: desktopFiles,
    fileOut: 'js/jsqueue.min.js',
    buffer: 100000 * 1024,
    options: ['--compilation_level=SIMPLE_OPTIMIZATIONS', '--warning_level=QUIET'],
    callback: function(err, min) {
        if (err) {
            console.log('ERROR: ' + err);
        }
        else {
            console.log('Built desktop files');
        }
    }
});

