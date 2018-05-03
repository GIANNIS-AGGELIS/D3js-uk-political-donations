var padding = 2;





var svg = d3.select("#chart").append("svg")
.attr("id", "svg")
.attr("width", w)
.attr("height", h);

var nodeGroup = svg.append("g");







function start() {

	node = nodeGroup.selectAll("circle")
		.data(nodes)
	.enter().append("circle")
		.attr("class", function(d) { return "node " + d.party; })
		.attr("amount", function(d) { return d.value; })
		.attr("donor", function(d) { return d.donor; })
		.attr("entity", function(d) { return d.entity; })
		.attr("party", function(d) { return d.party; })
		// disabled because of slow Firefox SVG rendering
		// though I admit I'm asking a lot of the browser and cpu with the number of nodes
		//.style("opacity", 0.9)
		.attr("r", 0)
		.style("fill", function(d) { return fill(d.party); })
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
    .on("click", function(d) {window.open(Google_search+d.donor)
    });

		// Alternative title based 'tooltips'
		// node.append("title")
		//	.text(function(d) { return d.donor; });

		force.gravity(0)
			.friction(0.70)
			.charge(function(d) { return -Math.pow(d.radius, 2) / 3; })
			.on("tick", all)
			.start();

		node.transition()
			.duration(1000)// ball laod seed 
			.attr("r", function(d) { return d.radius; });
}





// Collision detection function by m bostock
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
      var r = d.radius + radius.domain()[1] + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2
            || x2 < nx1
            || y1 > ny2
            || y2 < ny1;
      });
    };
}
  





function display(data) {

	maxVal = d3.max(data, function(d) { return d.amount; });

	var radiusScale = d3.scale.sqrt()
		.domain([0, maxVal])
			.range([10, 20]);

	data.forEach(function(d, i) {
		var y = radiusScale(d.amount);
		var node = {
				radius: radiusScale(d.amount) / 5,
				value: d.amount,
				donor: d.donor,
				party: d.party,
				partyLabel: d.partyname,
				entity: d.entity,
				entityLabel: d.entityname,
				color: d.color,
				x: Math.random() * w,
				y: -y
      };

      nodes.push(node)
	});

	console.log(nodes);

	force = d3.layout.force()
		.nodes(nodes)
		.size([w, h]);

	return start();
}