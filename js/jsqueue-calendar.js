/**
 *  jsqueue-tools.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsCalendar(element, options) {
        var self = this;
        self.options = options;
        self.div = element;
        self.cal=null;

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        jsqueue.activate('CALENDAR');
    }


    jsCalendar.prototype = {
        constructor: jsCalendar,

        /**
         * Display the modal
         * @param data
         * @constructor
         */
        INIT_CALENDAR: function(data) {
            var self=this;
            self.cal=data.element;
            if(data.basic) {
                $(data.element).fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month'
                    }
                });
                if(data.show_date)
                    $(data.element).fullCalendar('gotoDate',data.show_date);
            } else {
                $(data.element).fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    dragRevertDuration: 0,
                    editable: true,
                    droppable: true,
                    'eventDragStop': function (event, jsEvent) {
                        window[data['delete']](event, jsEvent);
                    },
                    'eventResize': function (event) {
                        window[data.update](event);
                    },
                    'eventDrop': function (event) {
                        window[data.update](event);
                    },
                    drop: function (date, jsEvent, ui) {
                        window[data.drop](date, jsEvent, ui, this);
                    }
                });
            }
            jsqueue.finished(data.PID);
        },

        CALENDAR_ADD_EVENTS: function(data) {
            var self=this;
            $(self.cal).fullCalendar( 'removeEvents');
            $(self.cal).fullCalendar( 'addEventSource', data.data );
            $(self.cal).fullCalendar( 'render' );
            jsqueue.finished(data.PID);
        }

    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsCalendar = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsCalendar', (data = new jsCalendar(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsCalendar.Constructor = jsCalendar;


}(window.jQuery));

