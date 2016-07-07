/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsCKeditor(element, options) {
        var self = this;
        self.options = options;
        self.div = element;

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        jsqueue.activate('CKEDITOR');
    }


    jsCKeditor.prototype = {
        constructor: jsCKeditor,

        /**
         * Display the modal
         * @param data
         * @constructor
         */
        INIT_EDITOR: function(data) {
            var self=this;
            CKEDITOR.disableAutoInline = true;
            CKEDITOR.inline(data.target);
            jsqueue.finished(data.PID);
        },
        
        CLEANUP_EDITOR: function(data) {
            var self=this;
            for(name in CKEDITOR.instances)
            {
                CKEDITOR.instances[name].destroy(true);
            }
            jsqueue.finished(data.PID);

        }

    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsCKeditor = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsCKeditor', (data = new jsCKeditor(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsCKeditor.Constructor = jsCKeditor;


}(window.jQuery));

