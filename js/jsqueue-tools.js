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
                self[cmd](data);
            }
        });
        jsqueue.activate('TOOLS');

    }

    jsTools.prototype = {
        constructor: jsTools,
        TOOLS_UPDATE_VALUE: function(data) {
            $(data.element).val(JSON.stringify(data));
            jsqueue.finished(data.PID);
        },

        TOOLS_DISPLAY_TEMPLATE: function(data) {
            $(data.element).html($(data.template).render(data));
            jsqueue.finished(data.PID);
        },

        TOOLS_ADD_EVENTS: function(data) {
            for(var i=0;i<data.triggers.length;i++) {
                $(data.triggers[i].aclass)[data.triggers[i].atrigger](data.triggers[i].afunction);
            }
            data.global();
            jsqueue.finished(data.PID);
        },

       // TOOLS_RELOAD_PAGE:

        TOOLS_REST_API: function (data) {
            var self=this;
            var senddata={};

            if(data.form) {
                $(data.form+' .rest-field').each(function(i,ptr){
                    var path=$(this).attr('data-send').split('.');
                    var obj=senddata;
                    for(var i=0;i<path.length;i++) {
                        if(!obj[path[i]]) {
                            obj[path[i]] = {};
                        }
                        if(path.length!=(i+1))
                            obj = obj[path[i]];
                        else {
                            obj[path[i]]=$(this).val();
                            break;
                        }
                    }
                });
                console.log(senddata);
                senddata= JSON.stringify(senddata);

            } else {
                senddata = JSON.stringify(data.json);
            }
            $.ajax({
                type: 'POST',
                url: data.uri,
                data: senddata,
                async: true,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                processData: false,
                contentType: "application/x-www-form-urlencoded",
                traditional: false,
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

