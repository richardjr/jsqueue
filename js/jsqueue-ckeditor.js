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
            CKEDITOR.disableAutoInline = true;

            if (data.replace) {
                CKEDITOR.replace(data.target, data.config || {});
            }
            else {
                CKEDITOR.inline(data.target, data.config || {});
            }

            jsqueue.finished(data.PID);
        },

        CLEANUP_EDITOR: function(data) {
            for (name in CKEDITOR.instances) {
                if (CKEDITOR.instances.hasOwnProperty(name)) {
                    CKEDITOR.instances[name].destroy(true);
                }
            }

            jsqueue.finished(data.PID);
        }
    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsCKeditor = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('jsQueueDebug'),
                options = typeof option == 'object' && option;

            if (!data) {
                $this.data('jsCKeditor', (data = new jsCKeditor(this, options)));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        })
    };

    $.fn.jsCKeditor.Constructor = jsCKeditor;
}(window.jQuery));

