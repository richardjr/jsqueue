jsqueue
=======

Javascript Event Queue

IMPORTANT: This is an alpha release, documentation and extra tools are on their way shortly.

UI event queue chain developed by Nautoguide Ltd http:://nautoguide.com to support our need for a responsive UI and complex event queues
which are dependant on events and things that may or may not have happened. I spent a lot of time coding the same thing over and over and always
running into dependency issues.

The solution was to fit the code into small functions that all respond to a data packet of json that can be passed about in queues that manage themselves.

A direct example from our code is someone clicks a button to get a list of items or in this example when the page is loaded we need
to get that list and plot in on a map. We are presented with various problems.

1. We call out to get data about our reports from an ajax api, this might be instant or it may take a long time
2. We draw that list on a map that may or may not have been made yet

Using jsqueue these problems are solved. Components register themselves and make it known when they are ready for action. If they are not ready then the item is held until
the component is active at which point its forwarded the request. If the function gathers data it can be placed on the stack for other functions to receive as their input.

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

