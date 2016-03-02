window.core = {
    version: "1.0.0"
};

core.data = {
    datamunge: function (data) {
        var self=this;
        $.each(data, function (key, val) {
            self.datamunge_recursive(key, val, data, data,0);
        });
    },
    datamunge_recursive: function (key, val, data, to,depth) {
        var self = this;
        if(depth>5)
            return;
        if (val instanceof Object) {
            $.each(val, function (mkey, mval) {
                self.datamunge_recursive(mkey, mval, data, to[key],depth++)
            });
        } else {
            var matches;
            if (typeof val == "string" && (matches = val.match(/^!jquery:(.*?)$/))) {
                console.log(matches);
                to[key] = jQuery(matches[1]).val();
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

