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
                case 'groupBar':
                    this.render_groupbar(data);
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
            "margin":{"top":100,"bottom":100,"left":80,"right":40},
            "rgb1":"90,167,216",
            "rgb2":"82,181,140",
            "rgbaHover":"204,204,204,0.1"
        });
        var dataset=[];
        var max=0;
        for(var i=0;i<data.chart.data.length;i++) {
            dataset.push({"col":data.chart.data[i].rows,"label":data.chart.data[i].title});
            if(data.chart.data[i].rows>max)
                max=data.chart.data[i].rows;
        }
        var w = (data.width||$(data.target).width())-(data.chart.options.margin.right+data.chart.options.margin.left);
        var h = (data.height||$(data.target).height())-(data.chart.options.margin.bottom+data.chart.options.margin.top);

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

        x.domain(dataset.map(function(d,i) { return i+" "+ d.label.substring(0, 10); }));
        var xAxis = d3.axisBottom(x);



        var svg = d3.select(data.target)
            .append("svg")
            .attr("width", w+(data.chart.options.margin.right+data.chart.options.margin.left))
            .attr("height", h+(data.chart.options.margin.bottom+data.chart.options.margin.top))
            .append("g")
            .attr("transform", "translate(" + data.chart.options.margin.left + "," + data.chart.options.margin.top + ")");



        var side=svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .attr("transform", "translate(-5)");;


        side.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(data.chart.options.yTitle)
            .attr("transform", "rotate(0) translate(0,-40)");

        var bottom=svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h+10) + ")")
            .call(xAxis)

        bottom.append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(data.chart.options.xTitle);

        var bars = svg.selectAll(".g")
            .data(dataset)
            .enter()
            .append("g")
            .attr("class","bars");



        bars.append("rect")
            .attr("class","vbar vbar1")
            .attr("fill", function(d,i) {return "rgb("+data.chart.options.rgb2+")"; })
            .attr("x", function(d,i) {return (colw*i)+5;})
            .attr("width", colw-5)
            .attr("y", function(d) { return 0; })
            .attr("height", function(d) { return h; });

        bars.append("rect")
            .attr("class","vbar vbar2")
            .attr("fill", function(d,i) { return "rgba("+data.chart.options.rgb1+","+(i%dataset.length)/dataset.length+")"; })
            .attr("x", function(d,i) {return (colw*i)+5;})
            .attr("width", colw-5)
            .attr("y", function(d) { return 0; })
            .attr("height", function(d) { return h; })

        bars.append("rect")
            .attr("class","vbarHov")
            .attr("fill", function(d,i) { return "rgba(0,0,0,0)"; })
            .attr("x", function(d,i) {return (colw*i)+5;})
            .attr("width", colw-5)
            .attr("y", function(d) { return 0; })
            .attr("height", function(d) { return h; })
            .on("mouseover", function(d,i) {
                d3.select(this).attr("fill", "rgba("+data.chart.options.rgbaHover+")");
            })
            .on("mouseout", function(d,i) {
                d3.select(this).attr("fill", "rgba(0,0,0,0)");
            });

        bars.on("mouseover", function(d,i) {


            d3.select(this).append("text")
                .attr("class","tt ttt2")

                .text( d.col+"/"+max)
                .style("text-anchor", "end")
                .attr("y", 50-(data.chart.options.margin.top))
                .attr("x", w);

            d3.select(this).append("text")
                .attr("class","tt ttt1")
                .text( i+" "+d.label)
                .style("text-anchor", "end")
                .attr("y", 77-(data.chart.options.margin.top))
                .attr("x", w);

        });

        bars.on("mouseout", function(d,i) {
            d3.select(this).selectAll(".tt")
                .remove();
        });

        side.selectAll("line")
            .attr("class","yline");

        side.selectAll("path")
            .attr("transform","translate(5,0)");

        side.selectAll("text")
            .attr("class","ytext");



        bottom.selectAll("line")
            .attr("class","xline");

        bottom.selectAll("path")
            .attr("transform","translate(0,-5)");

      bottom.selectAll("text")
            .attr("class","xtext")
            .transition()
            .duration(1000)
            .delay(100)
            .attr("transform","translate(-30,40) rotate(-65)");

        bars.selectAll(".vbar")
            .transition()
            .duration(1000)
            .delay(100)
            .attr("y", function(d) {
                return y(d.col);  //Height minus data value
            })
            .attr("height", function(d) {
                return h - y(d.col);
            })
    }

    /**
     * Make a D3 groupbar chart
     * @param chart
     */
    this.render_groupbar = function(data) {
        console.log(data.chart);

        // Merge in defaults

        data.chart.options=$.extend(data.chart.options||{},{
            "xTitle":"X Scale",
            "yTitle":"Y Scale",
            "margin":{"top":80,"bottom":80,"left":40,"right":40},
            "rgb1":"90,167,216",
            "rgb2":"82,181,140",
            "rgbaHover":"204,204,204,0.1"
        });
        var dataset=[];
        var max=0;
        for(var i=0;i<data.chart.data.length;i++) {
            dataset.push({"col":data.chart.data[i].rows,"label":data.chart.data[i].title});
            if(data.chart.data[i].rows>max)
                max=data.chart.data[i].rows;
        }
        var w = (data.width||$(data.target).width())-(data.chart.options.margin.right+data.chart.options.margin.left);
        var h = (data.height||$(data.target).height())-(data.chart.options.margin.bottom+data.chart.options.margin.top);

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

/*
        var x = d3.scaleBand()
            .range([0, w])
            .padding(0.1);
*/

        var x0 = d3.scale.scaleBand([0, width], .1);
        var x1 = d3.scale.ordinal();

        x1.domain(dataset.map(function(d) { return i+" "+ d.label.substring(0, 10); }));
        x0.domain(data.chart.yLegend).rangeRoundBands([0, x0.rangeBand()]);
        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");


/*
        x.domain(dataset.map(function(d,i) { return i+" "+ d.label.substring(0, 10); }));
        var xAxis = d3.axisBottom(x);
*/



        var svg = d3.select(data.target)
            .append("svg")
            .attr("width", w+(data.chart.options.margin.right+data.chart.options.margin.left))
            .attr("height", h+(data.chart.options.margin.bottom+data.chart.options.margin.top))
            .append("g")
            .attr("transform", "translate(" + data.chart.options.margin.left + "," + data.chart.options.margin.top + ")");



        var side=svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        side.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(data.chart.options.yTitle)
            .attr("transform", "rotate(0) translate(0,-40)");

        var bottom=svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h) + ")")
            .call(xAxis)

        bottom.append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(data.chart.options.xTitle);

        var bars = svg.selectAll(".g")
            .data(dataset)
            .enter()
            .append("g")
            .attr("class","bars");



        bars.append("rect")
            .attr("class","vbar vbar1")
            .attr("fill", function(d,i) {return "rgb("+data.chart.options.rgb2+")"; })
            .attr("x", function(d,i) {return (colw*i)+5;})
            .attr("width", x1.rangeBand())
            .attr("y", function(d) { return 0; })
            .attr("height", function(d) { return h; });

        bars.append("rect")
            .attr("class","vbar vbar2")
            .attr("fill", function(d,i) { return "rgba("+data.chart.options.rgb1+","+(i%dataset.length)/dataset.length+")"; })
            .attr("x", function(d,i) {return (colw*i)+5;})
            .attr("width", colw-5)
            .attr("y", function(d) { return 0; })
            .attr("height", function(d) { return h; })

        bars.append("rect")
            .attr("class","vbarHov")
            .attr("fill", function(d,i) { return "rgba(0,0,0,0)"; })
            .attr("x", function(d,i) {return (colw*i)+5;})
            .attr("width", colw-5)
            .attr("y", function(d) { return 0; })
            .attr("height", function(d) { return h; })
            .on("mouseover", function(d,i) {
                d3.select(this).attr("fill", "rgba("+data.chart.options.rgbaHover+")");
            })
            .on("mouseout", function(d,i) {
                d3.select(this).attr("fill", "rgba(0,0,0,0)");
            });

        bars.on("mouseover", function(d,i) {
            d3.select(this).append("rect")
                .attr("class","tt ttbox")
                .attr("fill", function(d,i) { return "rgb(255,255,255)"; })
                .attr("stroke", function(d,i) { return "rgb(0,0,00)"; })
                .attr("x", w-350)
                .attr("width", 340)
                .attr("y", (-data.chart.options.margin.top)+5)
                .attr("height", 50);

            d3.select(this).append("text")
                .attr("class","tt ttt1")
                .text( i+" "+d.label)
                .attr("y", (-data.chart.options.margin.top)+20)
                .attr("x", w-340);

            d3.select(this).append("text")
                .attr("class","tt ttt2")

                .text( d.col)
                .attr("y", (-data.chart.options.margin.top)+40)
                .attr("x", w-340);

        });

        bars.on("mouseout", function(d,i) {
            d3.select(this).selectAll(".tt")
                .remove();
        });

        side.selectAll("line")
            .attr("class","yline");
        side.selectAll("text")
            .attr("class","ytext");


        bottom.selectAll("line")
            .attr("class","xline");

        bottom.selectAll("text")
            .attr("class","xtext")
            .transition()
            .duration(1000)
            .delay(100)
            .attr("transform","rotate(-65) translate(-30,0)");

        bars.selectAll(".vbar")
            .transition()
            .duration(1000)
            .delay(100)
            .attr("y", function(d) {
                return y(d.col);  //Height minus data value
            })
            .attr("height", function(d) {
                return h - y(d.col);
            })
    }

    this.construct();
}

if(typeof window.jsqueue_plugins==="undefined")
    window.jsqueue_plugins=[];

window.jsqueue_plugins.push('jsqueue_charts');