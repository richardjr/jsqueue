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

        /**
         * Update a form value
         * @param data
         * @constructor
         */
        TOOLS_UPDATE_VALUE: function (data) {
            $(data.element).val(data.value);
            jsqueue.finished(data.PID);
        },
        /**
         * Taking input data and put some into registers for later use maybe in another queue
         * @param data
         * @constructor
         */
        TOOLS_SET_REG: function (data) {
            jsqueue.set_reg(data.reg, data.value);
            jsqueue.finished(data.PID);
        },

        /**
         * Give a list of elements(toggle their hidden class)
         * @param data
         * @constructor
         */
        TOOLS_TOGGLE_HIDDEN: function (data) {
            for (var i = 0; i < data.elements.length; i++)
                $(data.elements[i]).toggleClass('hidden');
            jsqueue.finished(data.PID);
        },

        /**
         * Display a
         * @param data
         * @constructor
         */
        TOOLS_DISPLAY_TEMPLATE: function (data) {
            $(data.element).html($(data.template).render(data));
            jsqueue.finished(data.PID);
        },

        /**
         *  Takes a template and renders the data to data.body on the stack
         * @param data
         * @constructor
         */
        TOOLS_RENDER_TEMPLATE: function (data) {
            var rdata = {};
            rdata.body = $(data.template).render(data);
            jsqueue.push(data.PID, rdata);
            jsqueue.finished(data.PID);
        },

        /**
         * Runs a JavaScript function that's defined in data.afunction
         * @param data
         * @constructor
         */
        TOOLS_RUN_FUNCTION: function(data) {
            window[data.afunction]();
            jsqueue.finished(data.PID);
        },

        /**
         *  Bind events to triggers from a json structure
         * @param data
         * @constructor
         */
        TOOLS_ADD_EVENTS: function (data) {
            for (var i = 0; i < data.triggers.length; i++) {
                /**
                 *  Unbind the event first to prevent the old double click if
                 *  we happen to have to re-run
                 */
                $(data.triggers[i].aclass).unbind(data.triggers[i].atrigger);
                if(typeof data.triggers[i].afunction=="string")
                    $(data.triggers[i].aclass).on(data.triggers[i].atrigger,window[data.triggers[i].afunction]);
                else
                    $(data.triggers[i].aclass).on(data.triggers[i].atrigger,data.triggers[i].afunction);
            }
            if (data.global)
                data.global();
            jsqueue.finished(data.PID);
        },

        helper_replace_value: function (key, val, data, to) {
            var self = this;
            if (val instanceof Object) {
                $.each(val, function (mkey, mval) {
                    self.helper_replace_value(mkey, mval, data, to[key])
                });
            } else {
                var matches;
                if (typeof val == "string" && (matches = val.match(/%(.*?)%/))) {
                    var path = matches[1].split(".");
                    var obj = data;

                    for (var i = 0; i < path.length; i++) {
                        if (!obj[path[i]]) {
                            obj[path[i]] = {};
                        }
                        if (path.length != (i + 1))
                            obj = obj[path[i]];
                        else {
                            to[key] = obj[path[i]];
                            break;
                        }
                    }
                } else if (typeof val == "string" && (matches = val.match(/^#(.*?)/))) {
                    to[key]=jQuery(val).val();
                }
            }

        },

        /**
         * Disable a button by giving it the disabled attribute. Optionally change the text and class as well as displaying a loading animation.
         * @param data
         * @constructor
         */
        TOOLS_DISABLE_BUTTON: function (data) {
            var self = this;

            if (data.button) {
                if (data.text) {
                    $(data.button).attr('data-oldtext', $(data.button).text());
                    $(data.button).text(data.text);
                }

                if (data.aclass) {
                    $(data.button).attr('data-oldclass', $(data.button).attr('class'));
                    $(data.button).removeClass($(data.button).attr('class'));
                    $(data.button).addClass(data.aclass);
                }

                if (data.displayLoadAnimation == true) {
                    $(data.button).append("<span class='glyphicon glyphicon-refresh spinning'></span>");
                }

                $(data.button).prop('disabled', true);
            }

            if (data.buttons) {
                for (var i = 0; i < data.buttons.length; i++) {
                    $(data.buttons[i]).prop('disabled', true);
                }
            }

            jsqueue.finished(data.PID);
        },

        /**
         * Enable a button by removing the disabled attribute. Optionally change the text and class as well as reverting the text back to what it was before.
         * @param data
         * @constructor
         */
        TOOLS_ENABLE_BUTTON: function (data) {
            var self = this;

            if (data.button) {
                $(data.button).prop('disabled', false);

                if (data.text) {
                    $(data.button).text(data.text);
                }

                if (data.revert) {
                    if (data.revert == true) {
                        $(data.button).text($(data.button).attr('data-oldtext'));
                    }
                }

                if ($(data.button).attr('data-oldclass')) {
                    $(data.button).removeClass($(data.button).attr('class'));
                    $(data.button).addClass($(data.button).attr('data-oldclass'));
                }
            }

            if (data.buttons) {
                for (var i = 0; i < data.buttons.length; i++) {
                    $(data.buttons[i]).prop('disabled', false);
                }
            }

            jsqueue.finished(data.PID);
        },

        /**
         * Change the text of a button.
         * @param data
         * @constructor
         */
        TOOLS_CHANGE_BUTTON_TEXT: function (data) {
            var self = this;

            $(data.button).text(data.text);

            jsqueue.finished(data.PID);
        },

        /**
         * Change the class of a button to change the colour.
         * @param data
         * @constructor
         */
        TOOLS_CHANGE_BUTTON_COLOUR: function (data) {
            var self = this;

            if (data.button && data.toAdd && data.toRemove) {
                $(data.button).addClass(data.toAdd).removeClass(data.toRemove);
            }

            jsqueue.finished(data.PID);
        },

        /**
         * Display a loading animation to signify that a process is happening.
         * @param data
         * @constructor
         */
        TOOLS_DISPLAY_LOAD_ANIMATION: function (data) {
            if (data.element) {
                $(data.element).append("<span class='glyphicon glyphicon-refresh spinning'></span>");
            }

            jsqueue.finished(data.PID);
        },

        /**
         * Schedule a JSQueue action to happen after a delay in seconds.
         * @param data
         * @constructor
         */
        TOOLS_DELAY_ACTION: function (data) {
            if (data.component && data.command && data.data && data.delay) {
               window.setTimeout(
                   function() {
                       if (data.chain) {
                           jsqueue.add(
                               {
                                   'component': data.component,
                                   'command': data.command,
                                   'data': data.data,
                                   'chain': data.chain
                               }
                           );
                       }
                       else {
                           jsqueue.add(
                               {
                                   'component': data.component,
                                   'command': data.command,
                                   'data': data.data
                               }
                           );
                       }
                   }, data.delay);
            }

            jsqueue.finished(data.PID);
        },

        TOOLS_SCHEDULE_ACTION: function (data) {
            if (data.chain) {
                jsqueue.add(
                    {
                        'component': data.component,
                        'command': data.command,
                        'data': data.data,
                        'chain': data.chain
                    });
            }
            else {
                jsqueue.add(
                    {
                        'component': data.component,
                        'command': data.command,
                        'data': data.data
                    });
            }

            setInterval(
                function () {
                    if (data.chain) {
                        jsqueue.add(
                            {
                                'component': data.component,
                                'command': data.command,
                                'data': data.data,
                                'chain': data.chain
                            });
                    }
                    else {
                        jsqueue.add(
                            {
                                'component': data.component,
                                'command': data.command,
                                'data': data.data
                            });
                    }
                }
            , 10000);

            jsqueue.finished(data.PID);
        },

        /**
         * Display a progress bar in a given element.
         * @param data
         * @constructor
         */
        TOOLS_PROGRESS_DISPLAY: function (data) {
            if (data.element && data.name) {
                $(data.element).html('<div class="progress progress-striped active"><div class="progress-bar progress-bar-danger" id="' + data.name + '" style="width: 0%;"></div></div>');
            }

            jsqueue.finished(data.PID);
        },

        /**
         * Change the progress of a progress bar by changing it's percentage width.
         * @param data
         * @constructor
         */
        TOOLS_PROGRESS_UPDATE: function (data) {
            if (data.element && data.progress) {
                $(data.element).css("width", data.progress + "%");
            }

            jsqueue.finished(data.PID);
        },

        TOOLS_REST_API: function (data) {
            var self = this;
            var senddata = {};
            if (!data.uri)
                data.uri = self.options.uri;

            if (data.form) {
                if (data.validatefunction) {
                    if (!window[data['validatefunction']](data.form)) {
                        return;
                    }
                }
                core.forms.encode(data.form,senddata);
            }


            if (data.json) {
                data.json=$.extend({},data.json);
                $.each(data.json, function(key, val) {
                    self.helper_replace_value(key, val, data, data.json);
                });
            }


            senddata = $.extend(data.json, senddata);

            senddata = JSON.stringify(senddata);


            /*senddata = senddata.replace(/"\%(.*?)\%"/,
             function (match, contents) {
             if (data[contents])
             return JSON.stringify(data[contents]);
             return null;
             });*/
            /**
             *  IE8/9 CORS support is broken so we can't use it.
             */
            if (navigator.appVersion.indexOf("MSIE 9") != -1 || navigator.appVersion.indexOf("MSIE 8") != -1) {
                $.ajax({
                    type: 'POST',
                    url: data.uri,
                    data: senddata,
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    processData: false,
                    traditional: false,
                    success: function (rdata) {
                        jsqueue.push(data.PID, rdata);
                        jsqueue.finished(data.PID);
                        jsqueue.add({
                            'component': 'DEBUG',
                            'command': 'DEBUG_MSG',
                            'data': {'caller': 'jsTools->call_api', 'msg': rdata, 'state': 'info'}
                        });
                        if(data.success)
                            data.success(rdata);

                    },
                    error: function (rdata) {
                        jsqueue.add({
                            'component': 'DEBUG',
                            'command': 'DEBUG_MSG',
                            'data': {'caller': 'jsTools->call_api', 'msg': rdata, 'state': 'warn'}
                        });

                    }
                });
            } else {
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
                        if(data.success)
                            data.success(rdata);
                    },
                    error: function (rdata) {
                        jsqueue.add({
                            'component': 'DEBUG',
                            'command': 'DEBUG_MSG',
                            'data': {'caller': 'jsTools->call_api', 'msg': rdata, 'state': 'warn'}
                        });

                    }
                });
            }
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

