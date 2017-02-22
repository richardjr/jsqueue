/**
 *  jsqueue-templates.js (c) 2016 richard@nautoguide.com
 */
function jsqueue_templates() {

    this.construct = function () {
        var self = this;
        jsqueue.register('TEMPLATES', 'object');
        jsqueue.activate('TEMPLATES', self);
    };

    /**
     * Take a template and write it to a target
     *
     * Option self mode for direct call from code.
     *
     * @param data
     * @constructor
     */

    this.WF_TEMPLATE = function (data) {
        jsqueue.push_name('TEMPLATE',data);
        if ($(data.template).length > 0) {
            if(data.target==='self')
                return core.data.htmlinject($(data.template).html());
            if(data.mode=='append')
                $(data.target).append(core.data.htmlinject($(data.template).html()));
            else
                $(data.target).html(core.data.htmlinject($(data.template).html()));
            if(data['class']) {
                $(data.target).addClass(data['class'])
            }
        } else {
            console.info('Warning template [' + data.template + '] not found');
        }
        jsqueue.finished(data.PID);
    };

    this.construct();

}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_templates');
