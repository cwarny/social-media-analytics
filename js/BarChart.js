function BarChart() {

	var margin = {left: 40, top: 20, bottom: 30, right: 20},
		xScale = d3.scale.ordinal(),
		yScale = d3.scale.linear(),
		xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
		duration = 500;

	function chart(selection) {

		selection.each(function (data) {
			
			var w = width - margin.left - margin.right;
			var h = height - margin.top - margin.bottom;

			xScale.domain(data.map(function(d) { return d.datehour; }))
					.rangeRoundBands([0, w], .1);

			var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom");

			yScale.domain([0, d3.max(data, function(d) { return d.count; })])
					.range([h, 0]);

			// Select the svg element, if it exists
			var svg = selection.selectAll("svg")
						.data([data]);
						
			// Otherwise, create the skeletal chart.
			var gEnter = svg.enter()
							.append("svg")
							.append("g");

			gEnter.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + h + ")")
				.call(xAxis);

			svg.attr("width", w + margin.left + margin.right)
				.attr("height", h + margin.top + margin.bottom)
				
			var g = svg.select("g")				
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			g.select(".x.axis")
				.attr("transform", "translate(0, " + yScale(0) + ")") // transform to 0 baseline (in case of neg values)
				.transition()
				.duration(duration)
				.call(xAxis);

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
					"x": function(d) { return xScale(d.datehour); },
					"width": xScale.rangeBand(),
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