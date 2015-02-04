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
    }


    jsWorkflow.prototype = {
        constructor: jsWorkflow,

        WORKFLOW_START: function(data) {
            var self=this;
            data.mobile=data.mobile||false;
            $('.js-workflow-onload').each(function () {
                self.ng_workflow_build(this);
            });

            /**
             *  Kill any events to prevent the old double down
             */
            $('.js-workflow').unbind(data.mobile ? 'touchend' : 'click');

            $('.js-workflow').on(data.mobile ? 'touchend' : 'click', function (e) {
                e.stopPropagation();
                self.ng_workflow_build(this);
                return false;
            });
            jsqueue.finished(data.PID);
        },

        ng_workflow_build: function (obj) {
            var self = this;
            var queue = [];
            var main_action = $(obj).data();
            $(obj).removeClass("js-workflow-onload js-workflow");

            $('.js-workflow-action[data-parent=' + $(obj).attr('id') + '][data-order=pre]').each(function () {
                var sub_action = $(this).data();
                $(this).removeClass('js-workflow-action');
                queue.push(self.ng_workflow_exec(sub_action));
            });
            queue.push(self.ng_workflow_exec(main_action));
            $('.js-workflow-action[data-parent=' + $(obj).attr('id') + '][data-order=post]').each(function () {
                var sub_action = $(this).data();
                $(this).removeClass('js-workflow-action');
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
            jsqueue.add(run_queue);
        },


        ng_workflow_exec: function (action) {
            var self = this;
            switch (action.action) {
                case 'queue':
                    return {
                        'component': action.component,
                        'command': action.command,
                        'data': $.extend({},action.data,action.merge),
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
                        }
                    };
                    return null;
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

