/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsModal(element, options) {
        var self = this;
        self.options = options;
        self.$element = $(element);

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        jsqueue.activate('MODAL');

    }


    jsModal.prototype = {
        constructor: jsModal,



        /**
         * Display the modal
         * @param data
         * @constructor
         */
        MODAL_DISPLAY: function(data) {
            $(data.element).html($(data.template).render(data));
            jsqueue.finished(data.PID);
        }

    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsModal = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsModal', (data = new jsModal(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsModal.Constructor = jsModal;


}(window.jQuery));

