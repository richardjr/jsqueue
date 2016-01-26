/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsWorkflow(element, options) {
        var self = this;
        self.options = options;
        self.div = element;
        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        jsqueue.activate('WORKFLOW');
        if(self.options.auto==true) {
            self.WORKFLOW_START({});
        }

    }


    jsWorkflow.prototype = {
        constructor: jsWorkflow,

        WORKFLOW_START: function(data) {
            var self=this;

            /**
             *  Display warning of duplicate ID's which cause common faults
             */
            $('[id]').each(function(){
                var ids = $('[id="'+this.id+'"]');
                if(ids.length>1 && ids[0]==this)
                    console.warn('Multiple IDs #'+this.id);
            });

            data.mobile=data.mobile||false;
            $('.js-workflow-onload,.js-workflow-onrun').each(function () {
                self.ng_workflow_build(this);
            });

            /**
             *  Kill any events to prevent the old double down
             */
            $('.js-workflow').unbind('touchend');
            $('.js-workflow').unbind('click');
            $('.js-workflow').unbind('run');


            $('.js-workflow').on( 'click touchend run', function (e) {
                e.stopPropagation();
                self.ng_workflow_build(this);
                if($(this).attr('data-return'))
                    return $(this).attr('data-return');
                return false;
            });

            $('.js-workflow[data-enter]').each(function () {
                var parent_object=this;
                var identifier= $(this).attr('data-enter');
                $(identifier).on('keypress', function (e) {
                    if (e && e.keyCode == 13) {
                        self.ng_workflow_build(parent_object);
                        return false;
                    }
                });
            });

            jsqueue.finished(data.PID);
        },

        ng_workflow_build: function (obj) {
            var self = this;
            var queue = [];
            var fail_queue = [];
            var main_action = $(obj).data();
            $(obj).removeClass("js-workflow-onload js-workflow");

            $('.js-workflow-action[data-parent=' + $(obj).attr('id') + '][data-order=pre]').each(function () {
                var sub_action = $(this).data();
                //$(this).removeClass('js-workflow-action');
                queue.push(self.ng_workflow_exec(sub_action));
            });
            queue.push(self.ng_workflow_exec(main_action));
            $('.js-workflow-action[data-parent=' + $(obj).attr('id') + '][data-order=post]').each(function () {
                var sub_action = $(this).data();
                //$(this).removeClass('js-workflow-action');
                if(sub_action.chain&&sub_action.chain=='fail')
                    fail_queue.push(self.ng_workflow_exec(sub_action));

                else
                    queue.push(self.ng_workflow_exec(sub_action));
            });

            /**
             *  Format the queue correctly
             */

            for (var i = 0; i < queue.length; i++) {
                if (queue[i] == null)
                    queue.splice(i, 1);
            }
            var run_queue = queue[0];
            queue.splice(0, 1);
            if (queue.length > 0)
                run_queue.chain = queue;
            if (fail_queue.length > 0)
                run_queue.fail_chain = fail_queue;
            jsqueue.add(run_queue);
        },


        ng_workflow_exec: function (action) {
            var self = this;
            switch (action.action) {
                case 'queue':
                    var data={};
                    if(action.form) {
                        core.forms.encode(action.form,data);
                    } else {
                        data=$.extend({},action.data,action.merge);
                    }
                    return {
                        'component': action.component,
                        'command': action.command,
                        'data':data,
                        'datamode': action.mode ? action.mode : false
                    }
                case 'post-form':
                    return {
                        'component': 'TOOLS',
                        'command': 'TOOLS_REST_API',
                        'data': {
                            'uri': self.options.uri,
                            'form': action.form,
                            'validatefunction': action.validatefunction,
                            'json': action.data
                        },
                        'datamode': action.mode ? action.mode : false
                    };
                default:
                    console.log('unknown action:' + action.action);
                    break;
            }
        }
    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsWorkflow = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsWorkflow', (data = new jsWorkflow(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsWorkflow.Constructor = jsWorkflow;


}(window.jQuery));

