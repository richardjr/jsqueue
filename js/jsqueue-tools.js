/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsTools(element, options) {
        var self = this;
        self.options = options;
        self.$element = $(element);

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                if (cmd == "TOOLS_REST_API")
                    self.call_api(data);
                if (cmd == "TOOLS_UPDATE_VALUE")
                    self.update_value(data);
            }
        });
        jsqueue.activate('TOOLS');

    }

    jsTools.prototype = {
        constructor: jsTools,
        update_value: function(data) {
            $(data.element).val(JSON.stringify(data));
            jsqueue.finished(data.PID);
        },

        call_api: function (data) {
            var senddata = JSON.stringify(data.json);
            $.ajax({
                type: 'GET',
                url: data.uri,
                dataType: 'JSON',
                data: senddata,
                async: true,
                success: function (rdata) {
                    jsqueue.push(data.PID, rdata);
                    jsqueue.finished(data.PID);
                    jsqueue.add({
                        'component': 'DEBUG',
                        'command': 'DEBUG_MSG',
                        'data': {'caller': 'jsTools->call_api', 'msg': rdata, 'state': 'info'}
                    });

                },
                error: function (rdata) {
                    jsqueue.add({
                        'component': 'DEBUG',
                        'command': 'DEBUG_MSG',
                        'data': {'caller': 'jsTools->call_api', 'msg': 'API Fail', 'state': 'info'}
                    });

                }
            });
        }
    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsTools = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsTools', (data = new jsTools(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsTools.Constructor = jsTools;


}(window.jQuery));

