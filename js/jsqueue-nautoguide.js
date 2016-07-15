/**
 *  jsqueue-nautoguide.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsNautoguide(element, options) {
        var self = this;
        self.options = options;
        self.div = element;

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });

        jsqueue.activate('NAUTOGUIDE');

        jsqueue.add({
            'component': 'TOOLS',
            'command': 'TOOLS_REST_API',
            'stackname': 'TOKEN_DETAIL',
            'data': {
                'json': {
                    'api': 'configuration_api',
                    'action': 'token_check'
                }
            },
            'chain': [
                {
                    'component': 'TOOLS',
                    'command': 'TOOLS_RUN_FUNCTION',
                    'data': {
                        'afunction': 'populateSystemVariables'
                    }
                }
            ]
        });
    }

    jsNautoguide.prototype = {
        constructor: jsNautoguide
    };

    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsNautoguide = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data) {
                $this.data('jsNautoguide', (data = new jsNautoguide(this, options)));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

    $.fn.jsNautoguide.Constructor = jsNautoguide;
}(window.jQuery));

function populateSystemVariables() {
    var stack = jsqueue.get_stack_name("TOKEN_DETAIL");

    window.nautosdk = {"app": {"schema": stack['_schema']}, "acl": stack['data']};

    jsqueue.set_reg("NAUTOGUIDE_LOADED", true);
}
