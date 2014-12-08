(function ($) {

    "use strict";

    function jsTools(element, options) {
        var self = this;
        self.options = options;
        self.$element = $(element);

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                if (cmd == "TOOL_REST_API")
                    self.(data);
            }
        });
        jsqueue.activate('TOOLS');

    }

    jsTools.prototype = {
        constructor: jsTools,
        call_api: function (data) {
            var self = this;
            var senddata = JSON.stringify(data.json);
            $.ajax({
                type: 'POST',
                url: data.uri,
                dataType: 'JSON',
                data: senddata,
                traditional: false,
                async: true,
                processData: false,
                contentType: false,
                success: function (data) {
                    jsqueue.push(data.PID, rdata);
                    jsqueue.finished(data.PID);
                    jsqueue.add({
                        'component': 'DEBUG',
                        'command': 'DEBUG_MSG',
                        'data': {'caller': 'jsTools->call_api', 'msg': 'API Success', 'state': 'info'}
                    });

                },
                error: function (data) {
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

