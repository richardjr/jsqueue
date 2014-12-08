jsqueue
=======

Javascript Event Queue

UI event queue chain developed by richard@nautoguide.com to support our need for response UI and complex event queues.

Example:

// Make a REST API call and pass the data to a draw function

jsqueue.add(
            {
                'component': 'MAP',
                'command': 'ID_MAPAPI_CALL_API',
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