var jsr_vars = {};
var jsr_ignore_attr = ['index','x','y','_pep','actions','history','feature_type_id','wkt_geometry_4326','geocoder','geocode_match','feature_geometry_type','feature_id','streetview_coords','file_id'];

jQuery.views.tags({
    setvar: function(key, value,value2) {
        value2=value2||'';
        jsr_vars[key] = value+value2;
    }
});

jQuery.views.helpers({
    daysold: function(fdate_str) {
        var c_date=new Date(client_config['date']);
        var f_dmy=fdate_str.split("/");
        f_dmy[2]=f_dmy[2].replace(/ .*/,'');
        var f_date=new Date(f_dmy[2],f_dmy[1]-1,f_dmy[0]);
        return Math.floor((c_date-f_date)/(1000*60*60*24));
    },
    getvar: function(key) {
        return jsr_vars[key];
    },
    getClientConfig: function(key) {
        return client_config[key];
    },
    appendvar: function(key,value) {
        jsr_vars[key]+=','+value;
    },

    toJSON: function(key) {
        return JSON.stringify(key).replace(/'/g);
    },
    toJSONF: function(key) {
        return JSON.stringify(key,null,4).replace(/'/g);
    },

    featureIgnore: function(key) {
        if(jsr_ignore_attr.indexOf(key)!=-1)
            return false;
        return true;
    },
    isObject: function(key) {
        if(typeof(key)==='object')
            return true;
        return false;
    },
    isArray: function(key) {
        if(key.constructor===Array)
            return true;
        return false;
    },
    isString: function(key) {
        if(typeof key==='string')
            return true;
        return false;
    },

    trimStr: function(key,len) {
        len=len||15;
        if(typeof key == 'string')
            return key.substring(0,len);
        return '';
    },

    getReq: function(key) {
        return Util.Req.getUrlVars()[key];
    },
    order: function(key,by) {
        key.sort(function (a, b) {
            var a_dist = a[by];
            var b_dist = b[by];
            return parseInt(a_dist) - parseInt(b_dist);
        });
        return key;
    }
});

function toggle_tabs() {
    jQuery(this).tab('show');
    return false;
}
