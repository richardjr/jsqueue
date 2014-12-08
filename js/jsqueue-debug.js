

(function ($) {

    "use strict";

    function jsQueueDebug(element, options) {
        var self = this;
        self.options = options;
        self.$element = $(element);
        self.window = window.open('', "debugwin", "width=1024,height=600,scrollbars=1,resizeable=1");
        $(self.window.document.body).html('Debugger Online<br/><br/>');
        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                if (cmd == "DEBUG_MSG")
                    self.msg(data);
            }
        });
        jsqueue.activate('DEBUG');

    }

    jsQueueDebug.prototype = {
        constructor: jsQueueDebug,
        msg: function (data) {
            var self = this;
            var color = 'green';
            if (data.hasOwnProperty('state')) {
                switch (data.state) {
                    case 'info':
                        color = 'green';
                        break;
                    case 'warn':
                        color = 'orange';
                        break;
                    case 'error':
                        color = 'red';
                        break;

                }
            }
            if(typeof data.msg=='object') {
                $(self.window.document.body).append('<span style="color: ' + color + '">' + data.caller + ':</span><br/>');
                $(self.window.document.body).append(prettyPrint(data.msg));
            }
            else
                $(self.window.document.body).append('<span style="color: ' + color + '">' + data.caller + '('+ $.now()+'):</span>' + data.msg + '<br/>');
                self.window.scrollTo(0,self.window.document.body.scrollHeight);
            jsqueue.finished(data.PID);
        }
    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsQueueDebug = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('jsQueueDebug')
                , options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsQueueDebug', (data = new jsQueueDebug(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsQueueDebug.Constructor = jsQueueDebug;


}(window.jQuery));

