/**
 *  jsqueue-animate.js (c) 2014 richard@nautoguide.com
 */

(function ($) {

    "use strict";

    function jsAnimate(element, options) {
        var self = this;
        self.options = options;
        self.div = element;
        self.anims={};

        // Commands
        $(element).on({
            "command": function (event, cmd, data) {
                self[cmd](data);
            }
        });
        self.INIT_ANIMS();
        jsqueue.activate('ANIMATE');
    }


    jsAnimate.prototype = {
        constructor: jsAnimate,



        /**
         * Display the modal
         * @param data
         * @constructor
         */
        PLAY_ANIMATION: function(data) {
            var self=this;
            $(data.anim+' .slide').removeClass('transition');
            $(data.anim+' .slide').css('opacity','0');
            $(data.anim+' .slide').addClass('transition');

            self.anims[data.anim]={"position":0};
            self.PLAY_FRAME({'anim':data.anim,'frame':$(data.anim+' .slide[data-slide='+self.anims[data.anim].position+']').attr('data-frame')});
            jsqueue.finished(data.PID);
        },

        PLAY_FRAME: function(data) {
            var self=this;
            $(data.anim+' .slide').removeClass('active');

            if(data.frame) {
                data.frame=JSON.parse(data.frame);
                for(var i=0;i<data.frame.length;i++) {
                    for (var property in data.frame[i]) {
                        console.log(data.frame[i][property]);

                        $(data.anim + ' .slide[data-slide=' + property + ']').css(data.frame[i][property]);
                    }
                }
            }
            $(data.anim+' .slide[data-slide='+self.anims[data.anim].position+']').addClass('active');
            $(data.anim+' .slide[data-slide='+self.anims[data.anim].position+']').css('opacity','1');
            self.anims[data.anim].position++;
        },

        INIT_ANIMS: function(data) {
            var self=this;
            $('.animation').each(function() {
                var $that=$(this);
                $that.children('.slide').each(function () {
                    $(this).css('opacity', '0');
                    $(this).attr('data-parent','#'+$that.attr('id'))
                    $(this).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        if($(this).hasClass('active'))
                            self.PLAY_FRAME({'anim':$(this).attr('data-parent'),'frame':$(this).attr('data-frame')});
                    })
                });
            });
        }


    };


    /* PLUGIN DEFINITION
     * =========================== */
    $.fn.jsAnimate = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('jsQueueDebug'), options = typeof option == 'object' && option;

            if (!data)
                $this.data('jsAnimate', (data = new jsAnimate(this, options)));

            if (typeof option == 'string')
                data[option]();
        })
    }

    $.fn.jsAnimate.Constructor = jsAnimate;


}(window.jQuery));

