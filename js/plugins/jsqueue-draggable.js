/**
 *  jsqueue-draggable.js (c) 2016 richard@nautoguide.com
 */

function jsqueue_draggable() {

    this.construct = function () {
        var self = this;
        jsqueue.register('DRAGGABLE', 'object');
        jsqueue.activate('DRAGGABLE', self);
    };

    /**
     * Make something draggable
     *
     * @param data
     * @constructor
     */

    this.MAKE_DRAGGABLE = function (data) {
        var self = this;
        $(data.target).draggable(data.options||{});
        jsqueue.finished(data.PID);
    };

    this.MAKE_SORTABLE = function (data) {
        var self = this;

        if (data['receive_event']) {
            data.options['receive'] = function(event, ui) {
                var item_id = ui['item'].attr('id');

                if (data['receive_event'] && data['receive_event']['exclude'] && !contains(event['target']['id'], data['receive_event']['exclude'])) {
                    var type = item_id.substring(0, item_id.indexOf('-'));

                    if (!contains(event['target']['id'], type)) {
                        $('#' + ui['sender'].attr('id')).append($('#' + item_id));
                    }
                }
            }
        }

        $(data.target).sortable(data.options||{});

        jsqueue.finished(data.PID);
    };

    this.MAKE_DROPPABLE = function (data) {
        var self = this;
        $(data.target).droppable({
            drop: function( event, ui ) {
                self.drop_append( this,ui.draggable );
            }
        });
        jsqueue.finished(data.PID);
    };

    this.drop_append = function(target,$item) {
        $item.draggable("destroy");

        $(target).append($item);
    };

    this.construct();
}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_draggable');

function contains(haystack, needle) {
    return !!(~haystack.indexOf(needle));
}
