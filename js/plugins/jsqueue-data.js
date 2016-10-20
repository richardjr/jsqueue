/**
 *  jsqueue-templates.js (c) 2016 richard@nautoguide.com
 */
function jsqueue_data() {

    this.construct = function () {
        var self = this;
        jsqueue.register('DATA', 'object');
        jsqueue.activate('DATA', self);
    };

    /**
     * Take a template and write it to a target
     *
     * Option self mode for direct call from code.
     *
     * @param data
     * @constructor
     */

    this.SPRINTF = function (data) {
        var ret_str='';
        console.log(data);
        ret_str=data.string.replace(/{(\d+)}/g, function(match, number) {
            return data.args[number];
        });
        console.log(ret_str)
        jsqueue.push_name(data.stackname,ret_str);
        jsqueue.finished(data.PID);
    };

    this.construct();

}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_data');
