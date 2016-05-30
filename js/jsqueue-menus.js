/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsMenus(element, options) {
        var self = this;
        self.options = options;
        self.div = element;

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        jsqueue.activate('MENUS');
    }


    jsMenus.prototype = {
        constructor: jsMenus,

        MENUS_DROPDOWNS: function(data) {
            $(".ddz-option").click(function() {
                $(".ddz-option").siblings("ul").removeClass('show-ddz-below');
                if($(this).hasClass('active')) {
                    $(".ddz-option").removeClass('active');
                } else {
                    $(this).siblings("ul").addClass('show-ddz-below');
                    $(".ddz-option").removeClass('active');
                    $(this).addClass('active');

                }
            });
            $(".ddz-option-sub").click(function() {
                $(".ddz-option-sub").siblings("ul").removeClass('show-ddz-below');
                $(this).siblings("ul").addClass('show-ddz-below');
            });
            jsqueue.finished(data.PID);

        }
    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsMenus = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsMenus', (data = new jsMenus(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsMenus.Constructor = jsMenus;


}(window.jQuery));

