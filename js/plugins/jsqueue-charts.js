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
                default:
                    console.info('There is no chartType:'+data.chart.chartType);
            }
        } else {
            console.error('jsqueue charts cant find the chart structure');
        }
        jsqueue.finished(data.PID);
    }
    /**
     * Make a D3 bar chart
     * @param chart
     */
    this.render_bar = function(data) {
        console.log(data.chart);

        var dataset=[];
        for(var i=0;i<data.chart.legend.length;i++) {
            dataset.push({"col":data.chart.legend[i].col,"label":data.chart.legend[i].title});
        }
        dataset.forEach(function (d) {


            d.col = +d.col;
        });
        var w = data.width||$(data.target).width();
        var h = data.height||$(data.target).height();
        var margin=40;

        var colw=((w-(dataset.length*5))/dataset.length);

        /**
         *  Setup the yscale
         */
        var y = d3.scaleLinear()
            .range([h, 0]);

        var yAxis = d3.axisLeft(y);

        /**
         * Xscale
         *
         */

        var x = d3.scaleOrdinal()
            .range([0, w], .1);

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
            .text("Frequency");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Town");

        var bars = svg.selectAll("rect")
            .data(dataset)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + i * colw + ",0)"; });

        var animbar=bars.append("rect")
            .attr("fill", "teal")
            .attr("x", function(d,i) {return (5*i)+5;})
            .attr("y", h - 1)
            .attr("width", colw)
            .attr("height", 1);

        bars.append("text")
            .attr("x", function(d,i) {return (5*i)+10;})
            .attr("y", h + 10)
            .attr("dy", ".75em")
            .text(function(d) { return d.label.substring(0, 10); });




        animbar.transition()
            .duration(1000)
            .delay(100)
            .attr("y", function(d) {
                return h - (d.col * 4);  //Height minus data value
            })
            .attr("height", function(d) {
                return d.col * 4;
            })
    }

    this.construct();
}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_charts');