function BarChart (startDate, endDate, self) {

	var xScale = d3.time.scale(),
		yScale = d3.scale.linear(),
		duration = 500;

	function chart (selection) {

		selection.each(function (data) {

			data = data.filter(function (d) {
				return new Date(startDate) < new Date(d.created_at) && new Date(endDate) > new Date(d.created_at);
			});

			if (data.length === 0) {
				self.sendAction("transition");
			} else {
				var minDate = d3.min(data,function (d) { return d.created_at; });
				var maxDate = d3.max(data,function (d) { return d.created_at; });
				var timeSpan = (maxDate - minDate) / (1000 * 60 * 60) + 1;

				var margin = {left: 50, top: 20, bottom: 30, right: (50 + (timeSpan === 1 ? 0 : width/timeSpan))};
				
				var w = width - margin.left - margin.right;
				var h = height - margin.top - margin.bottom;

				var barWidth = w/timeSpan - 3;

				xScale.domain([minDate,maxDate])
					.range([0, w]);

				if (timeSpan === 1) {
					var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom")
						.ticks(d3.time.hour,1);
				} else {
					var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom")
						.ticks(d3.min([10, timeSpan]));
				}

				yScale.domain([0, d3.max(data, function (d) { return parseInt(d.count); })])
					.range([h, 0]);

				var yAxis = d3.svg.axis()
					.scale(yScale)
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
					.attr("transform", "translate(" + barWidth/2 + "," + yScale(0) + ")") // transform to 0 baseline (in case of neg values)
					.transition()
					.duration(duration)
					.call(xAxis);

				g.select(".y.axis")
					.attr("transform", "translate(-3,0)") // transform to 0 baseline (in case of neg values)
					.transition()
					.duration(duration)
					.call(yAxis);

				var bars = g.selectAll(".bar")
					.remove();

				var bars = g.selectAll(".bar")
					.data(function(d) {return d;});

				bars.enter()
					.append("rect")
					.attr("class","bar")
					.attr("height", 0)
					.attr("y", yScale(0))
					.transition()
					.duration(duration)
					.attr({
						"x": function(d) { return xScale(d.created_at); },
						"width": barWidth,
						"y": function(d) { return yScale(d3.max([0, d.count])); },
						"height": function(d) { return h - yScale(d.count); }
					});
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