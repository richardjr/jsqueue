/**
 *  jsqueue-charts.js (c) 2016 richard@nautoguide.com
 */

function jsqueue_charts() {

    this.construct = function () {
        var self = this;
        jsqueue.register('CHARTS', 'object');
        jsqueue.activate('CHARTS', self);
        console.log('I start')
    }
    this.CREATE_CHART = function (data) {
        var self = this;
        console.log('spoon')
        jsqueue.finished(data.PID);
    }

    this.construct();
}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_charts');