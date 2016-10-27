/**
 *  jsqueue-templates.js (c) 2016 richard@nautoguide.com
 */
function jsqueue_logic() {

    this.construct = function () {
        var self = this;
        jsqueue.register('LOGIC', 'object');
        jsqueue.activate('LOGIC', self);
    };

    /**
     * Take a template and write it to a target
     *
     * Option self mode for direct call from code.
     *
     * @param data
     * @constructor
     */

    this.IF = function (data) {
        data.mode=data.mode||'string';
        var statement = core.data.process_statment(data.statement,data.mode);
        var evalResult=eval(statement);
        if (data.debug) {
            console.info(statement);
            console.log(evalResult);
        }
        if(!evalResult)
            jsqueue.logicfail(data.PID);
        jsqueue.finished(data.PID);
    };

    this.construct();

}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_logic');
