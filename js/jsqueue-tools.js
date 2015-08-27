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
                if(self[cmd])
                    self[cmd](data);
                else
                    console.log('Error no cmd:'+cmd);
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
         * Set hidden to a given class
         * @param data
         * @constructor
         */
        TOOLS_SET_HIDDEN: function (data) {
            $(data.element).addClass('hidden');
            jsqueue.finished(data.PID);
        },

        /**
         * Remove hidden from a given class
         * @param data
         * @constructor
         */
        TOOLS_REMOVE_HIDDEN: function (data) {
            $(data.element).removeClass('hidden');
            jsqueue.finished(data.PID);
        },

        /**
         * If help class is found, add it as a popover
         * @param data
         * @constructor
         */
        TOOLS_FIND_HELP: function (data) {
            $('.helper').each(function() {
                var $this = $(this);
                var element_data=$this.data();

                $this.popover({
                    trigger: 'click',
                    placement: 'right',
                    html: true,
                    title: element_data.title,
                    content: function() {
                        if (element_data.templateDisplay) {
                            return $(element_data.templateDisplay).html();
                        } else {
                            return element_data.helptext;
                        }
                    }
                }).click(function(e){
                    e.preventDefault();
                    jsqueue.add(
                        {
                            "component":"WORKFLOW",
                            "command":"WORKFLOW_START"
                        }
                    );
                });
            });

            jsqueue.finished(data.PID);
        },

        /**
         * Display a
         * @param data
         * @constructor
         */
        TOOLS_DISPLAY_TEMPLATE: function (data) {
            if(($(data.element).length) <= 0) {
                console.log("Element does not exist:"+data.element);
            }
            if(($(data.template).length) <= 0) {
                console.log("Template does not exist"+data.template);
            }
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
                            // Set the value
                            // If its an object the regex replace will break the object so we overwrite
                            // but there is no case where you would drop in an object mid replace
                            if(typeof obj[path[i]] == 'object')
                                to[key] = obj[path[i]];
                            else
                                to[key] =to[key].replace(/%.*?%/, obj[path[i]]);
                            break;
                        }
                    }
                } else if (typeof val == "string" && (matches = val.match(/^(#.*?)/))) {
                    if(val.match(/^(#.*?)\&array/)) {
                        var matches = val.match(/^(#.*?)\&array/);
                        to[key] = [jQuery(matches[1]).val()];
                    }
                    else
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

        TOOLS_REDIRECT: function(data) {
            var self=this;
            if (data) {
                $.each(data, function(key, val) {
                    self.helper_replace_value(key, val, data,data);
                });
            }
            console.log(data);
            window.location=data.location;
            jsqueue.finished(data.PID);
        },

        TOOLS_JS_SCROLL: function(data) {
            var self=this;
            $(data.element).each(function(){
                $(this).height($(window).height());
            });

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
            var ldata=$.extend(true,{},data);
            if (!ldata.uri)
                ldata.uri = self.options.uri;

            if (ldata.form) {
                if (ldata.validatefunction) {
                    if (!window[ldata['validatefunction']](ldata.form)) {
                        return;
                    }
                }
                core.forms.encode(ldata.form,senddata);
            }


            if (ldata.json) {
                $.each(data.json, function(key, val) {
                    self.helper_replace_value(key, val, ldata,ldata.json);
                });
            }


            senddata = $.extend({},ldata.json, senddata);

            senddata = JSON.stringify(senddata);

            /**
             *  IE8/9 CORS support is broken so we can't use it.
             */
            if (navigator.appVersion.indexOf("MSIE 9") != -1 || navigator.appVersion.indexOf("MSIE 8") != -1) {
                $.ajax({
                    type: 'POST',
                    url: ldata.uri,
                    data: senddata,
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    processData: false,
                    traditional: false,
                    success: function (rdata) {
                        if(ldata.json&&ldata.json.ignoredata) {
                            jsqueue.push(ldata.PID, rdata.data);
                        } else {
                            jsqueue.push(ldata.PID, rdata);
                        }
                        jsqueue.finished(ldata.PID);
                        jsqueue.add({
                            'component': 'DEBUG',
                            'command': 'DEBUG_MSG',
                            'data': {'caller': 'jsTools->call_api', 'msg': rdata, 'state': 'info'}
                        });
                        if(ldata.success)
                            ldata.success(rdata);

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
                    url: ldata.uri,
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
                        if(ldata.json&&ldata.json.ignoredata) {
                            jsqueue.push(ldata.PID, rdata.data);
                        } else {
                            jsqueue.push(ldata.PID, rdata);
                        }
                        jsqueue.finished(ldata.PID);
                        jsqueue.add({
                            'component': 'DEBUG',
                            'command': 'DEBUG_MSG',
                            'data': {'caller': 'jsTools->call_api', 'msg': rdata, 'state': 'info'}
                        });
                        if(ldata.success)
                            ldata.success(rdata);
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

