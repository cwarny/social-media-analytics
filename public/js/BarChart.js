function BarChart (startDate, endDate, self) {

	var duration = 500;

	function chart (selection) {

		selection.each(function (data) {
			data = data.filter(function (d) {
				return new Date(startDate) < d.created_at && new Date(endDate) > d.created_at;
			});

			if (data.length === 0) {
				self.sendAction("transition");
			} else {
				var minDate = d3.min(data,function (d) { return d.created_at; });
				var maxDate = d3.max(data,function (d) { return d.created_at; });
				var timeSpan = (maxDate - minDate) / (1000 * 60 * 60);
				if (timeSpan === 0) timeSpan = 1;

				var margin = {left: 50, top: 20, bottom: 30, right: (50 + (timeSpan === 1 ? 0 : width/timeSpan))};
				
				var w = width - margin.left - margin.right;
				var h = height - margin.top - margin.bottom;

				var barWidth = w/timeSpan - 3;

				var x0 = d3.time.scale().domain([minDate,maxDate]).range([0, w]);
				
				var x1 = d3.scale.ordinal().domain(["retweet","click"]).rangeRoundBands([0, w/timeSpan]);

				var y = d3.scale.linear()
					.domain([0, d3.max(data, function (d) { return d3.max(d.datum, function (d) { return parseInt(d.count) }); })])
					.range([h, 0]);

				var color = d3.scale.ordinal().domain(["retweet","click"]).range(["#DE2D26", "#3182BD"]);

				var xAxis = d3.svg.axis()
					.scale(x0)
					.orient("bottom")
					.ticks(d3.time.hour, timeSpan > 15 ? 3 : 1);

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left")
					.tickFormat(d3.format("d"));

				// Select the svg element, if it exists
				var svg = selection.selectAll("svg")
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.data([data]);
													
				// Otherwise, create the skeletal chart.
				var gEnter = svg.enter()
					.append("svg")
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				gEnter.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(" + barWidth/2 + "," + h + ")")
					.call(xAxis);		

				gEnter.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(-3,0)")
					.call(yAxis);

				svg.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
									
				var g = svg.select("g")                                
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				g.select(".x.axis")
					.attr("transform", "translate(" + barWidth/2 + "," + y(0) + ")") // transform to 0 baseline (in case of neg values)
					.transition()
					.duration(duration)
					.call(xAxis);

				g.select(".y.axis")
					.attr("transform", "translate(-3,0)") // transform to 0 baseline (in case of neg values)
					.transition()
					.duration(duration)
					.call(yAxis);

      			var datum = g.selectAll(".datum").remove();
      			var bars = d3.selectAll(".bar").remove();

				var datum = g.selectAll(".datum")
					.data(function (d) {return d;});

				datum.enter()
					.append("g")
					.attr("class","g")
					.attr("transform", function (d) { return "translate(" + x0(d.created_at) + ",0)"; });

				var bars = datum.selectAll(".bar")
					.data(function (d) {return d.datum;});
					
				bars.enter()
					.append("rect")
					.attr("class","bar")
					.attr("height", 0)
					.attr("y", y(0))
					.transition()
					.duration(duration)
					.attr("width", x1.rangeBand())
					.attr("x", function (d) { return x1(d.name); })
					.attr("y", function (d) { return y(d.count); })
					.attr("height", function (d) { return h - y(d.count); })
					.style("fill", function (d) { return color(d.name); });
			}
		});
	}

	chart.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	chart.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	return chart;
}