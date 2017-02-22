/**
 *  jsqueue-templates.js (c) 2016 richard@nautoguide.com
 */
function jsqueue_toastr() {
    this.construct = function () {
        var self = this;
        jsqueue.register('TOASTR', 'object');
        jsqueue.activate('TOASTR', self);
    };

    this.SHOW_TOAST = function (data) {
        toastr['options'] = $.extend({
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-center",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "150",
            "hideDuration": "500",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }, data['options']);

        toastr[data['type']](data['body'], data['title']);

        jsqueue.finished(data['PID']);
    };

    this.construct();
}

if (typeof window.jsqueue_plugins==="undefined") {
    window.jsqueue_plugins = [];
}

window.jsqueue_plugins.push('jsqueue_toastr');
