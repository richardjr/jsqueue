/**
 *  jsqueue-charts.js (c) 2016 richard@nautoguide.com
 */

function jsqueue_charts() {

    this.construct = function () {
        var self = this;
        jsqueue.register('CHARTS', 'object');
        jsqueue.activate('CHARTS', self);
    };

    /**
     * Entry point for all charts. Checks for data structure and loads relevant renderer
     *
     * @param data
     * @constructor
     */

    this.CREATE_CHART = function (data) {
        var self = this;
        /**
         *  Check the structure basics
         */
        if(data.chart!==undefined) {
            switch(data.chart.chartType) {
                case 'bar':
                    this.render_bar(data);
                    break;
                case 'table':
                    this.render_table(data);
                    break;
                default:
                    console.info('There is no chartType:'+data.chart.chartType);
            }
        } else {
            console.error('jsqueue charts cant find the chart structure');
        }
        jsqueue.finished(data.PID);
    }

    /**
     *  Make a table using a template
     */

    this.render_table = function(data) {
        $(data.target).html(core.data.htmlinject($(data.template).html()));
    }

    /**
     * Make a D3 bar chart
     * @param chart
     */
    this.render_bar = function(data) {
        console.log(data.chart);

        // Merge in defaults

        data.chart.options=$.extend(data.chart.options||{},{
           "xTitle":"X Scale",
            "yTitle":"Y Scale",
            "margin":40
        });
        var dataset=[];
        var max=0;
        for(var i=0;i<data.chart.data.length;i++) {
            dataset.push({"col":data.chart.data[i].rows,"label":data.chart.data[i].title});
            if(data.chart.data[i].rows>max)
                max=data.chart.data[i].rows;
        }
        var margin=data.chart.options.margin;
        var w = (data.width||$(data.target).width())-margin*2;
        var h = (data.height||$(data.target).height())-margin*2;

        var colw=w/dataset.length;

        /**
         *  Setup the yscale
         */
        var y = d3.scaleLinear()
            .domain([0, max])
            .range([h, 0])
            .nice();

        var yAxis = d3.axisLeft(y);

        /**
         * Xscale
         *
         */

        var x = d3.scaleBand()
            .range([0, w])
            .padding(0.1);

        x.domain(dataset.map(function(d) { return d.label.substring(0, 10); }));

        var xAxis = d3.axisBottom(x);

        //y.domain([0, d3.max(data, function(d) { return d.col; })]);
        //x.domain(dataset.map(function(d) { return d.label; }));

        var svg = d3.select(data.target)
            .append("svg")
            .attr("width", w+(margin*2))
            .attr("height", h+(margin*2))
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(data.chart.options.yTitle);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(data.chart.options.xTitle);

        var bars = svg.selectAll(".bar")
            .data(dataset)
            .enter().append("rect")
            .attr("fill", "teal")
            .attr("x", function(d,i) {return (colw*i)+5;})
            .attr("width", colw-5)
            .attr("y", function(d) { return y(d.col); })
            .attr("height", function(d) { return h - y(d.col); });

     /*   var animbar=bars.append("rect")
            .attr("fill", "teal")
            .attr("x", function(d,i) {return (5*i)+5;})
            .attr("y", y(h+(margin*2)))
            .attr("width", colw)
            .attr("height", 1);*/


        svg.append("g")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);


        /*animbar.transition()
            .duration(1000)
            .delay(100)
            .attr("y", function(d) {
                return h - (d.col * 4);  //Height minus data value
            })
            .attr("height", function(d) {
                return d.col * 4;
            })*/
    }

    this.construct();
}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_charts');