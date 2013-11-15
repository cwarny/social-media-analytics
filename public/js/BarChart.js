function BarChart() {

	var xScale = d3.time.scale(),
		yScale = d3.scale.linear(),
		duration = 500;

	function chart(selection) {

		selection.each(function (data) {

			// Transform date string into Date object
			if (typeof data[0].created_at !== "object") data.forEach(function (d) {d.created_at = new Date(d.created_at.slice(0,4) + "-" + d.created_at.slice(4,6) + "-" + d.created_at.slice(6,8) + " " + d.created_at.slice(8,10) + ":00")});

			var minDate = d3.min(data,function (d) { return d.created_at; });
			var maxDate = d3.max(data,function (d) { return d.created_at; });
			var timeSpan = (maxDate - minDate) / (1000 * 60 * 60);
			var margin = {left: timeSpan < 5 ? 135:50, top: 20, bottom: 30, right: timeSpan < 5 ? 135:50};
						
			var w = width - margin.left - margin.right;
			var h = height - margin.top - margin.bottom;

			var barWidth = w/timeSpan - 3;

			xScale.domain([minDate,maxDate])
				.range([0, w]);

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(d3.time.hour, timeSpan > 15 ? 3:1);

			yScale.domain([0, d3.max(data, function(d) { return d.count; })])
				.range([h, 0]);

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");

			// Select the svg element, if it exists
			var svg = selection.selectAll("svg")
				.data([data]);
												
			// Otherwise, create the skeletal chart.
			var gEnter = svg.enter()
				.append("svg")
				.append("g");

			gEnter.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(100," + h + ")")
				.call(xAxis);

			gEnter.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(-100,0)")
				.call(yAxis);

			svg.attr("width", w + margin.left + margin.right)
				.attr("height", h + margin.top + margin.bottom)
								
			var g = svg.select("g")                                
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			g.select(".x.axis")
				.attr("transform", "translate(0, " + yScale(0) + ")") // transform to 0 baseline (in case of neg values)
				.transition()
				.duration(duration)
				.call(xAxis);

			g.select(".y.axis")
				.attr("transform", "translate(" + (timeSpan < 5 ? -100:-30) + ",0)") // transform to 0 baseline (in case of neg values)
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
					"x": function(d) { return xScale(d.created_at) - barWidth/2; },
					"width": barWidth,
					"y": function(d) { return yScale(d3.max([0, d.count])); },
					"height": function(d) { return h - yScale(d.count); }
				});

			bars.exit()
				.transition()
				.duration(duration)
				.attr("y", h)
				.attr("height", 0)
				.remove();

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