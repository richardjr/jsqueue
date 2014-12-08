function jsqueue() {

    this.construct = function () {
        var self = this;
        self.pid = 1;
        /**
         * List of components, this is used to set their state as well
         */
        self.components = {};

        /**
         *  Empty Queue
         * @type {Array}
         */

        self.queue = [];
        self.maxlife = 50000;

    };

    /**
     * Register new component
     * @param name
     * @param mode
     * @param aclass
     * @param afunction
     */
    this.register = function(name,mode,aclass,afunction) {
        var self=this;
        self.components[name]={'mode':mode||'plugin','aclass':aclass||'','afunction':afunction||'','state':'inactive'};
    }


    /**
     *  Cleans any old items in the queue. These will be chained events that have not recieved a response after being
     *  triggered
     */
    this.clean_queue = function () {
        var self = this;
        var cleaned = 0;
        var iswork = true;
        while (iswork) {
            iswork=false;
            for (var i = 0; i < self.queue.length; i++) {
                if (self.queue[i].state == 'finished') {
                    self.queue.splice(i, 1);
                    iswork=true;
                    break;
                }
                if ($.now() > (self.queue[i].time + self.maxlife)) {
                    self.queue.splice(i, 1);
                    cleaned++;
                    iswork=true;
                    break;
                }

            }
        }
        if (cleaned > 0)
            self.add({'component': 'DEBUG', 'command': 'DEBUG_MSG', 'data': {'caller': 'jsqueue', 'msg': 'Cleaned (' + cleaned + ') expired items from queue', 'state': 'warn'}});


    }

    /**
     *  Start up the components
     */
    this.start_components = function () {
        var self = this;
        for (var i in self.components) {
            if(self.components[i].mode!='object')
                $(self.components[i].aclass)[self.components[i].afunction]($(self.components[i].aclass).data());
        }
    }

    /**
     * Add an item to the queue
     * @param data
     */
    this.add = function (data) {
        var self = this;
        data.state = 'queued';
        data.time = $.now();
        if(!data.stack)
            data.stack =[];
        if(!data.data)
            data.data={};
        self.queue.push(data);

        self.process();
        self.clean_queue();

    }
    /**
     *  Run the current queue
     */
    this.process = function () {
        var self = this;

        for (var i = 0; i < self.queue.length; i++) {
            if (self.queue[i].component == 'BROADCAST') {
                self.queue[i].state = 'running';
                /**
                 *  In broadcast mode we send the trigger to any active component that will listen
                 *  BROADCAST items can't have chained events so they will just be dumped
                 */
                for (var c = 0; c < self.components.length; c++) {
                    $(self.components[c].aclass).trigger('command', [self.queue[i].command, self.queue[i].data]);
                }
                self.queue[i].state = 'finished';

            } else {
                /**
                 *  Check if the queued item has a matching component that is active and also that the item
                 *  is queued as oposed to running in which case we need to jump over it.
                 */
                if (self.components[self.queue[i].component].state == 'active' && self.queue[i].state == 'queued') {
                    /**
                     * Set our state to running and inject a process ID into the data, this is used for chain enabled triggers
                     * to report back they have finished
                     *
                     */
                    self.queue[i].state = 'running';
                    self.queue[i].data.PID = self.pid;
                    var myqueue=self.queue[i];
                    self.pid++;
                    var timeout=myqueue.data.timer||10;
                    if(myqueue.datamode=='stack') {
                        myqueue.data = $.extend({},myqueue.data,myqueue.stack.pop());
                    }
                    if(myqueue.datamode=='allstack') {
                            myqueue.data.stack=myqueue.stack;
                    }
                    if(self.components[myqueue.component].mode!='object')
                        setTimeout(function() {$(self.components[myqueue.component].aclass).trigger('command', [myqueue.command, myqueue.data])}, timeout);
                    else {
                        var ptrobj=self.components[myqueue.component].object;
                        setTimeout(function() {ptrobj[myqueue.command](myqueue.data)}, timeout);
                    }
                    if (myqueue.hasOwnProperty('chain')) {
                        myqueue.state = 'triggered';
                        if (myqueue.component != 'DEBUG')
                            self.add({'component': 'DEBUG', 'command': 'DEBUG_MSG', 'data': {'caller': 'jsqueue>process', 'msg': 'PID(' + myqueue.data.PID + ') Ran chain ' + myqueue.command+':'+timeout, 'state': 'info'}});

                    } else {
                        myqueue.state = 'finished';
                        if (myqueue.component != 'DEBUG')
                            self.add({'component': 'DEBUG', 'command': 'DEBUG_MSG', 'data': {'caller': 'jsqueue>process', 'msg': 'PID(' + myqueue.data.PID + ') Ran command ' + myqueue.command+':'+timeout, 'state': 'info'}});
                    }
                }
            }
        }
    }
    this.set_by_pid = function(pid,qdata) {
        for (var i = 0; i < self.queue.length; i++) {
            if (self.queue[i].data.PID == pid) {
                self.queue[i]=qdata;
            }
        }
    }

    /**
     *  Add some data to the stack for use by any future functions in the chain
     * @param pid
     */
    this.push = function(pid,data) {
        var self = this;
        for (var i = 0; i < self.queue.length; i++) {
            if (self.queue[i].data.PID == pid && self.queue[i].state == 'triggered') {
                self.queue[i].stack.push(data);
                self.add({'component': 'DEBUG', 'command': 'DEBUG_MSG', 'data': {'caller': 'jsqueue', 'msg': 'PID(' + pid + ') updated the stack', 'state': 'info'}});
            }
        }
    }

    this.finished = function (pid) {
        var self = this;

        for (var i = 0; i < self.queue.length; i++) {
            if (self.queue[i].data.PID == pid && self.queue[i].state == 'triggered') {
                /**
                 *  The only reason we would find the PID in the queue is that it has a chain left so we requeue the next item
                 *  in the chain
                 * @type {*}
                 */
                //console.log(self.queue[i]);

                var newqueue = self.queue[i].chain[0];
                newqueue.stack=self.queue[i].stack;
                self.queue[i].chain.splice(0, 1);
                if (self.queue[i].chain.length > 0) {
                    newqueue.chain = self.queue[i].chain;
                }
                self.queue[i].state = 'finished';
                self.add(newqueue);
                return;
            }
        }
    }

    /**
     * componets call this function to declair they are active and ready to recieve commands
     *
     *
     * @param component
     */
    this.activate = function (component,object) {
        var self = this;
        self.components[component].state = 'active';
        if(object)
            self.components[component].object=object;
        /**
         *  Force a queue proccess to send out any commands that are waiting by adding a debug into the queue
         */
        self.process();
        self.add({'component': 'DEBUG', 'command': 'DEBUG_MSG', 'data': {'caller': 'jsqueue>activate', 'msg': 'Component ' + component + ' Reports Active', 'state': 'info'}});
    }

    this.construct();
}


