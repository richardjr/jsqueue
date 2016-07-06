var compressor = require('node-minify');
const exec = require('child_process').exec;

var desktopFiles = [
    "js/jsqueue.js",
    "js/jsqueue-animate.js",
    "js/jsqueue-calendar.js",
    "js/jsqueue-core.js",
    "js/jsqueue-modal.js",
    "js/jsqueue-menus.js",
    "js/jsqueue-time.js",
    "js/jsqueue-tools.js",
    "js/jsqueue-ckeditor.js",
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

exec('/bin/cp node_modules/document-register-element/build/document-register-element.js js/libs/register-element', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/document-register-element/build/document-register-element.max.js js/libs/register-element', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/dom4/build/dom4.js js/libs/dom4', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/dom4/build/dom4.max.js js/libs/dom4', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/particles.js/particles.js js/libs/particles', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/bowser/bowser.js js/libs/bowser', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/bowser/bowser.min.js js/libs/bowser', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/three/build/three.js js/libs/three', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/three/build/three.min.js js/libs/three', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/three/examples/js/controls/TrackballControls.js js/libs/three/plugins', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/openlayers/dist/ol.js js/libs/openlayers', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/openlayers/dist/ol-debug.js js/libs/openlayers', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp -r node_modules/ckeditor/* js/libs/ckeditor', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/bootstrap/dist/js/bootstrap* js/libs/bootstrap', function(error, stdout, stderr) {
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

