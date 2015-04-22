/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsModal(element, options) {
        var self = this;
        self.options = options;
        self.div = element;

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        self.MODAL_INIT();
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
            var self=this;
            $(self.div).html($(data.template).render(data));
            $(self.div).off('shown.bs.modal');
            $(self.div).on('shown.bs.modal', function (e) {
                $("#modal_text_helper").focus();
            })
            $(self.div).modal('show');
            jsqueue.finished(data.PID);
        },

        MODAL_CLOSE: function(data) {
            var self=this;
            $(self.div).modal('hide');
            jsqueue.finished(data.PID);
        },

        MODAL_TEXT_HELPER: function(data) {
            $(data.aclass).focus(function(){
                var form_ptr=this;
                jsqueue.add(
                    {
                        "component":"MODAL",
                        "command":"MODAL_DISPLAY",
                        "data": {
                            "template":data.template,
                            "form_value": $(form_ptr).val()
                        },
                        "chain":[
                            {
                                "component":"TOOLS",
                                "command":"TOOLS_ADD_EVENTS",
                                "data": {
                                    "triggers":[
                                        {
                                            "aclass": "#modal-save",
                                            "atrigger": "click",
                                            "afunction": function() {
                                                $(form_ptr).val($("#modal_text_helper").val());
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }

                );
            });
        },

        MODAL_INIT: function(data) {
            var self=this;
            $(self.div).addClass('modal fade')
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

