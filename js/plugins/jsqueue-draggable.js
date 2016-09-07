/**
 *  jsqueue-draggable.js (c) 2016 richard@nautoguide.com
 */

function jsqueue_draggable() {

    this.construct = function () {
        var self = this;
        jsqueue.register('DRAGGABLE', 'object');
        jsqueue.activate('DRAGGABLE', self);
    };

    /**
     * Make something draggable
     *
     * @param data
     * @constructor
     */

    this.MAKE_DRAGGABLE = function (data) {
        var self = this;
        console.log('making drag:'+data.target);
        $(data.target).draggable();
        jsqueue.finished(data.PID);
    }

    this.construct();
}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_draggable');