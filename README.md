jsqueue
=======

Javascript Event Queue

IMPORTANT: This is an alpha release, documentation and extra tools are on their way shortly.

features
========

1. Queues are non-blocking giving control back to the UI making your application much more responsive
2. Functions in the queue can be chained and pass data down the queue
3. Queues can await a components ready state to prevent dependency issues
4. Queues can request execution delays (same as timeout)

Details
=======

UI event queue chain developed by Nautoguide Ltd http://nautoguide.com to support our need for a responsive UI and complex event queues
which are dependant on events and things that may or may not have happened. I spent a lot of time coding the same thing over and over in ajax based
applications and always running into the dependency/timing issues.

The solution was to fit the code into small functions that all respond to a data packet of json that can be passed about in queues that manage themselves.

A direct example from our code is someone clicks a button to get a list of items or in this example when the page is loaded we need
to get that list and plot in on a map. We are presented with various problems.

1. We call out to get data about our reports from an ajax api, this might be instant or it may take a long time
2. We draw that list on a map that may or may not have been made yet

In a traditional non-queued application we have to execute all that code in serial. Load our map have that launch our ajax request and on the return callback draw it to the map

Using jsqueue these problems are solved. Components register themselves and make it known when they are ready for action. If they are not ready then the item is held until
the component is active at which point its forwarded the request. If the function gathers data it can be placed on the stack for other functions to receive as their input.

This way we just chuck everything that needs to happen in a queue and when it can happen it will.

```
// Make a REST API call and pass the data to a draw function

jsqueue.add(
            {
                'component': 'API',
                'command': 'ID_CALL_API',
                'data': {
                    "json": {

                            'api': 'reporting_api',
                            'action': 'list_reports',
                            'payload': { }

                    }
                },
                'chain': [
                    {
                        'component': 'MAP',
                        'command': 'ID_REPORTS_DRAW_LIST',
                        'datamode': 'stack'
                    }
                ]
            }
        );
```

Components can be in the form of a jquery plugin which accepts the events as a trigger or as a normal js object with functions.

See the examples dir for a full implementation of this API chain.

