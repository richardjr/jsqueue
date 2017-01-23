const exec = require('child_process').exec;

/**
 *  Copy in the latest libs (update with npm install)
 */
exec('/bin/cp node_modules/jquery/dist/jquery.js js/libs/jquery', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/jquery/dist/jquery.min.js js/libs/jquery', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/jquery-ui-dist/{jquery-ui.js, jquery-ui.css} js/libs/jquery-ui/', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/document-register-element/build/document-register-element.js js/libs/register-element', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/document-register-element/build/document-register-element.max.js js/libs/register-element', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/dom4/build/dom4.js js/libs/dom4', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/dom4/build/dom4.max.js js/libs/dom4', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/particles.js/particles.js js/libs/particles', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/bowser/bowser.js js/libs/bowser', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/bowser/bowser.min.js js/libs/bowser', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/three/build/three.js js/libs/three', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/three/build/three.min.js js/libs/three', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});
exec('/bin/cp node_modules/three/examples/js/controls/TrackballControls.js js/libs/three/plugins', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/openlayers/dist/ol.js js/libs/openlayers', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/openlayers/dist/ol-debug.js js/libs/openlayers', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp -r node_modules/ckeditor/* js/libs/ckeditor', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/bootstrap/dist/js/bootstrap* js/libs/bootstrap', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/d3/build/d3.js js/libs/d3', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/d3/build/d3.min.js js/libs/d3', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/d3-axis/build/d3-axis.js js/libs/d3', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/d3-axis/build/d3-axis.min.js js/libs/d3', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/toastr/build/{toastr.min.js,toastr.min.css} js/libs/toastr', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/lodash/lodash.min.js js/libs/lodash', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/cesium/Source/Cesium.js js/libs/cesium', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});

exec('/bin/cp node_modules/xbbcode-parser/{xbbcode.js,xbbcode.css} js/libs/xbbcode-parser', function(error, stdout, stderr) {
    if(error) {
        console.error(error);
    }
});