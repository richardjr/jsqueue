/**
 *  jsqueue-menus.js (c) 2016 richard@nautoguide.com
 */

function jsqueue_menus() {

    this.construct = function () {
        var self = this;
        jsqueue.register('MENUS', 'object');
        jsqueue.activate('MENUS', self);
    };

    this.MENUS_DROPDOWNS = function(data) {
        $(".ddz-option").click(function() {
            $(".ddz-option").siblings("ul").removeClass('show-ddz-below');

            if ($(this).hasClass('active')) {
                $(".ddz-option").removeClass('active');
            }
            else {
                $(this).siblings("ul").addClass('show-ddz-below');
                $(".ddz-option").removeClass('active');
                $(this).addClass('active');
            }
        });

        $(".ddz-option-sub").click(function() {
            $(".ddz-option-sub").siblings("ul").removeClass('show-ddz-below');
            $(this).siblings("ul").addClass('show-ddz-below');
        });

        jsqueue.finished(data.PID);
    };

    this.construct();
}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_menus');

function contains(haystack, needle) {
    return !!(~haystack.indexOf(needle));
}
