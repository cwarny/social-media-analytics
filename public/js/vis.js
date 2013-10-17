function Cascade () {

	var margin = {top: 20, right: 10, bottom: 20, left: 10};
	var dateformat = d3.time.format("%Y%m%d%H")

	function chart (parent) {

		parent.each(function (data) {

			var w = width - margin.left - margin.right,
				h = height - margin.top - margin.bottom;

			var xScale = d3.scale.linear()
				.domain(
					[
						d3.min(data.nodes, function (d) {
							if (d.hasOwnProperty("count")) {
								return dateformat.parse(d.created_at);
							} else {
								return new Date(d.created_at);
							}
						}),
						d3.max(data.nodes, function (d) {
							if (d.hasOwnProperty("count")) {
								return dateformat.parse(d.created_at);
							} else {
								return new Date(d.created_at);
							}
						})
					]
				)
				.range([0,w]);

			var yScale = d3.scale.linear()
				.domain(
					[
						d3.min(data.nodes, function (d) {
							return d.depth;
						}),
						d3.max(data.nodes, function (d) {
							return d.depth;
						})
					]
				)
				.range([h,0]);

			var colorScale = d3.scale.ordinal().domain(["circle", "triangle-up","square","cross"]).range(["blue","green","red","yellow"]);
							
			data.nodes.forEach(function (d) {
				d.y = yScale(d.depth);
				if (d.hasOwnProperty("in_reply_to_status_id") && d.in_reply_to_status_id !== null) {
					d.symbol = "triangle-up";
					d.x = xScale(new Date(d.created_at));
				} else if (d.hasOwnProperty("retweeted_status")) {
					d.symbol = "square";
					d.x = xScale(new Date(d.created_at));
				} else if (d.hasOwnProperty("count")) {
					d.symbol = "cross";
					d.x = xScale(dateformat.parse(d.created_at));
				} else {
					d.symbol = "circle";
					d.x = xScale(new Date(d.created_at));
				}
			});

			var svg = parent.append("svg")
				.attr("width", w + margin.left + margin.right)
				.attr("height", h + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");				

			svg.selectAll("line")
				.data(data.links)
				.enter()
				.append("line")
				.attr("x1", function (d) {
					return data.nodes[d.source].x;
				})
				.attr("y1", function (d) {
					return data.nodes[d.source].y;
				})
				.attr("x2", function (d) {
					return data.nodes[d.target].x;
				})
				.attr("y2", function (d) {
					return data.nodes[d.target].y;
			});

			svg.on("click", function (selected) {
				vis.transition().duration(1000)
					.attr("fill", function (d) {
						if (selected) {
							return "black";
						}
					})
			});

			var vis = svg.selectAll("path")
				.data(data.nodes)
				.enter()
				.append("path")
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				})
				.attr("d", function (d) {
					if (d.id !== 0) return d3.svg.symbol().type(d.symbol)();
				})
				.attr("fill", function (d) {
					return colorScale(d.symbol);
			})

			vis.on("mouseover", function (d) {
				var gx = w - 400,
					gy = 50;

				var g = svg.append("g")
					.attr({
						"id": "tweetbox",
						"stroke": "black",
						"fill":"white",
						"transform": "translate(" + gx + "," + gy + ")"
					});

				g.append("image")
					.attr({
						"xlink:href": d.user.profile_image_url,
						"height": 50,
						"width": 50
					});

				var text = g.append("text")
					.attr({
						"y": 15,
						"fill": "black" 
					});

				text.append("tspan")
					.attr("x",60)
					.text(d.text);
					
				text.append("tspan")
					.attr("x",60)
					.attr("dy",15)
					.text("- " + d.user.name + " (@" + d.user.screen_name + ")");	
				})
				.on("mouseout", function (d) {
					d3.select("#tweetbox").remove();
			});

			svg.on("click", function (selected) {
				vis.transition().duration(1000)
					.attr("fill", function (d) {
						if (selected) {
							var a = selected.id == d.id ? 255 : 0;
							if (d.symbol == "circle") {
								return "rgba(0,0,255," + a + ")";
							} else if (d.symbol == "square") {
								return "rgba(255,0,0," + a + ")";
							} else if (d.symbol == "triangle-up") {
								return "rgba(0,255,0," + a + ")";
							} else {
								return "rgba(255,255,0," + a + ")";
							}
						} else {
							console.log("hello");
							return colorScale(d.symbol);
						}
				})
			})
		})
	};

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
