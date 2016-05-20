window.core = {
    version: "1.0.0"
};

core.data = {
    serializer: function (key,value) {
        if(typeof value === 'object')
            return 'Object';
        return value;

    },
    datamunge: function (data) {
        var self = this;
        $.each(data, function (key, val) {
            self.datamunge_recursive(key, val, data, data, 0);
        });
    },
    datamunge_recursive: function (key, val, data, to, depth) {
        var self = this;
        if (depth > 10)
            return;
        if (val instanceof Object) {
            $.each(val, function (mkey, mval) {
                self.datamunge_recursive(mkey, mval, data, to[key], depth++)
            });
        } else {
            var matches;
            if (typeof val == "string" && (matches = val.match(/\!jquery:(.*)[:]{0,1}/))) {
                var clean_match = matches[1].replace(/:.*/, '');
                if (jQuery(clean_match).is('input:not(:checkbox),textarea')) {
                    to[key] = val.replace(/\!jquery:.*[:]{0,1}/, jQuery(clean_match).val());
                } else if (jQuery(clean_match).is(':checkbox')) {
                    if (jQuery(clean_match).is(':checked')) {
                        to[key] = val.replace(/\!jquery:.*[:]{0,1}/, jQuery(clean_match).val());
                    } else {
                        to[key] = '';
                    }
                } else {
                    to[key] = val.replace(/\!jquery:.*[:]{0,1}/, jQuery(clean_match).text());
                }
            }
            if (typeof val == "string" && (matches = val.match(/\!data:(.*)[:]{0,1}/))) {
                var clean_match = matches[1].replace(/:.*/, '');

                function index(obj, i) {
                    return obj[i];
                }

                var value = clean_match.split('.').reduce(index, data);
                if (val.match(/^\!data:(.*)[:]{0,1}$/))
                    to[key] = value;
                else
                    to[key] = val.replace(/\!data:.*[:]{0,1}/, value);

                // to[key] =value;
            }
            if (typeof val == "string" && (matches = val.match(/\!stack:\/\/(.*)[:]{0,1}/))) {
                var clean_match = matches[1].replace(/:.*/, '');
                matches = clean_match.split('/');
                clean_match = matches[1];
                data = jsqueue.stack[matches[0]];
                function index(obj, i) {
                    return obj[i];
                }

                var value = clean_match.split('.').reduce(index, data);
                to[key] = val.replace(/\!stack:\/\/.*[:]{0,1}/, value);

            }

        }
    }
};

core.forms = {

    encode: function (form, data) {
        $(form + ' .rest-field').each(function (i, ptr) {
            var path = $(this).attr('data-send').split('.');
            var obj = data;
            for (var i = 0; i < path.length; i++) {
                if (!obj[path[i]]) {
                    obj[path[i]] = {};
                }
                if (path.length != (i + 1))
                    obj = obj[path[i]];
                else {
                    if ($(this).is(':checkbox')) {
                        if ($(this).is(':checked')) {
                            if ($(this).attr('data-mode') == 'csv') {
                                if (typeof obj[path[i]] == "object")
                                    obj[path[i]] = '';
                                var sep = '';
                                if (obj[path[i]]) {
                                    sep = ',';
                                }
                                obj[path[i]] += sep + $(this).val();
                            } else {
                                obj[path[i]] = $(this).val();
                            }
                        } else {
                            if ($(this).attr('data-off'))
                                obj[path[i]] = $(this).attr('data-off');
                        }
                    } else {
                        if ($(this).attr('data-encode') == 'json')
                            obj[path[i]] = JSON.parse($(this).val());
                        else {
                            if ($(this).attr('data-ptr'))
                                obj[path[i]] = $($(this).attr('data-ptr')).val();
                            else
                                obj[path[i]] = $(this).val();
                        }
                    }
                    break;
                }
            }
        });

    }

};

