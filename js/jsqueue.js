/**
 *  jsqueue.js (c) 2014 richard@nautoguide.com
 */

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
        self.registers = {};
        self.maxlife = 50000;

    };

    /**
     * Register new component
     * @param name
     * @param mode
     * @param aclass
     * @param afunction
     */
    this.register = function (name, mode, aclass, afunction) {
        var self = this;
        self.components[name] = {
            'mode': mode || 'plugin',
            'aclass': aclass || '',
            'afunction': afunction || '',
            'state': 'inactive'
        };
    }

    /**
     *  Set a global register
     * @param name
     * @param data
     */
    this.set_reg = function (name, data) {
        var self = this;
        self.registers[name] = data;
        self.add(
            {
                'component': 'DEBUG',
                'command': 'DEBUG_MSG',
                'data': {
                    'caller': 'jsqueue>set_reg',
                    'msg': 'REG set: '+name,
                    'state': 'info'
                }
            });
    }

    /**
     *  Clear a global register
     * @param name
     */
    this.clear_reg = function (name) {
        var self = this;
        delete self.registers[name];
        self.add(
            {
                'component': 'DEBUG',
                'command': 'DEBUG_MSG',
                'data': {
                    'caller': 'jsqueue>set_reg',
                    'msg': 'REG cleared: '+name,
                    'state': 'info'
                }
            });

    }


    /**
     *  Cleans any old items in the queue. These will be chained events that have not received a response after being
     *  triggered
     */
    this.clean_queue = function () {
        var self = this;
        var cleaned = 0;
        var cleaned_list = [];
        var iswork = true;
        while (iswork) {
            iswork = false;
            for (var i = 0; i < self.queue.length; i++) {
                if (self.queue[i].state == 'finished') {
                    self.queue.splice(i, 1);
                    iswork = true;
                    break;
                }
                if ($.now() > (self.queue[i].time + self.maxlife)) {
                    cleaned_list.push(self.queue[i]);
                    self.queue.splice(i, 1);
                    cleaned++;
                    iswork = true;
                    break;
                }

            }
        }
        if (cleaned > 0) {
            self.add({
                'component': 'DEBUG',
                'command': 'DEBUG_MSG',
                'data': {
                    'caller': 'jsqueue',
                    'msg': 'Cleaned (' + cleaned + ') expired items from queue',
                    'state': 'warn'
                },
                "chain": [
                    {
                        'component': 'DEBUG',
                        'command': 'DEBUG_MSG',
                        'data': {
                            'caller': 'jsqueue',
                            'msg': cleaned_list,
                            'state': 'warn'
                        }
                    }
                ]
            });
        }


    }

    /**
     *  Start up the components
     */
    this.start_components = function () {
        var self = this;

        /**
         *  Find any with the jsqueue class to add
         */

        $('.jsqueue').each(function (i, ptr) {
            var data = $(this).data();
            self.components[data['jsq_name']] = {
                'mode': 'plugin',
                'aclass': '.' + data['jsq_name'],
                'afunction': data['jsq_plugin'],
                'state': 'inactive'
            };
        });

        /**
         *  Now start them all up
         */
        for (var i in self.components) {
            if (self.components[i].mode == 'plugin')
                $(self.components[i].aclass)[self.components[i].afunction]($(self.components[i].aclass).data());
        }
    }

    /**
     * Add an item to the queue
     * @param data
     */
    this.add = function (data) {
        var self = this;
        var ddata= $.extend({},data);
        ddata.state = 'queued';
        ddata.time = $.now();
        if (!ddata.stack)
            ddata.stack = [];
        if (!ddata.data)
            ddata.data = {};
        self.queue.push(ddata);
        self.process();


    }
    /**
     *  Run the current queue
     */
    this.process = function (self) {
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
                if (
                    self.components[self.queue[i].component].state == 'active' &&
                    self.queue[i].state == 'queued' &&
                    ( !self.queue[i].reg || self.registers[self.queue[i].reg])
                ) {
                    /**
                     * Set our state to running and inject a process ID into the data, this is used for chain enabled triggers
                     * to report back they have finished
                     *
                     */
                    self.queue[i].state = 'running';
                    self.queue[i].data.PID = self.pid;

                    var myqueue = self.queue[i];
                    self.pid++;
                    var timeout = myqueue.data.timer || 10;
                    if (myqueue.datamode == 'stack') {
                        myqueue.data = $.extend({}, myqueue.data, myqueue.stack.pop());
                    }
                    if (myqueue.datamode == 'allstack') {
                        myqueue.data.stack = myqueue.stack;
                    }
                    self.launch_queue_item(myqueue.component,myqueue.command,myqueue.data,timeout);
                    if (myqueue.hasOwnProperty('chain')) {
                        myqueue.state = 'triggered';
                        if (myqueue.component != 'DEBUG')
                            self.add({
                                'component': 'DEBUG',
                                'command': 'DEBUG_MSG',
                                'data': {
                                    'caller': 'jsqueue>process',
                                    'msg': 'PID(' + myqueue.data.PID + ') Ran chain ' + myqueue.command + ':' + timeout,
                                    'state': 'info'
                                }
                            });

                    } else {
                        myqueue.state = 'finished';
                        if (myqueue.component != 'DEBUG')
                            self.add({
                                'component': 'DEBUG',
                                'command': 'DEBUG_MSG',
                                'data': {
                                    'caller': 'jsqueue>process',
                                    'msg': 'PID(' + myqueue.data.PID + ') Ran command ' + myqueue.command + ':' + timeout,
                                    'state': 'info'
                                }
                            });
                    }
                }
            }
        }
        self.clean_queue();
    }
    /**
     *  We use an intermedia function to launch as timeout will use the variable state in a loop
     */
    this.launch_queue_item =function (component,command,data,timeout) {
        var self=this;
        if (self.components[component].mode != 'object') {
            setTimeout(function () {
                $(self.components[component].aclass).trigger('command', [command, data])
            }, timeout);
        } else {
            var ptrobj = self.components[component].object;
            setTimeout(function () {
                ptrobj[command](data)
            }, timeout);
        }
    }

    this.set_by_pid = function (pid, qdata) {
        for (var i = 0; i < self.queue.length; i++) {
            if (self.queue[i].data.PID == pid) {
                self.queue[i] = qdata;
            }
        }
    }

    /**
     *  Add some data to the stack for use by any future functions in the chain
     * @param pid
     */
    this.push = function (pid, data) {
        var self = this;
        for (var i = 0; i < self.queue.length; i++) {
            if (self.queue[i].data.PID == pid && self.queue[i].state == 'triggered') {
                self.queue[i].stack.push(data);
                self.add({
                    'component': 'DEBUG',
                    'command': 'DEBUG_MSG',
                    'data': {'caller': 'jsqueue', 'msg': 'PID(' + pid + ') updated the stack', 'state': 'info'}
                });
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
                newqueue.stack = self.queue[i].stack;
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
    this.activate = function (component, object) {
        var self = this;
        self.components[component].state = 'active';
        if (object)
            self.components[component].object = object;
        /**
         *  Force a queue proccess to send out any commands that are waiting by adding a debug into the queue
         */
        self.add({
            'component': 'DEBUG',
            'command': 'DEBUG_MSG',
            'data': {'caller': 'jsqueue>activate', 'msg': 'Component ' + component + ' Reports Active', 'state': 'info'}
        });

    }

    this.construct();
}


