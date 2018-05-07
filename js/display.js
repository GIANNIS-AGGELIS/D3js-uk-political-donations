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

function mouseover(d, i) {
	// tooltip popup
	var mosie = d3.select(this);
	var amount = mosie.attr("amount");
	var donor = d.donor;
	var party = d.partyLabel;
	var entity = d.entityLabel;
	var offset = $("svg").offset();



	// image url that want to check
	var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + d.donor + ".ico";



	// *******************************************


	responsiveVoice.speak("The donor is " + donor +"and gave an amount "+ amount +"british pounds. On the " + party ,"UK English Male");//voise for cercles





	var infoBox = "<p> Source: <b>" + donor + "</b> " +  "<span><img src='" + imageFile + "' height='42' width='42'></span></p>"

	 							+ "<p> Recipient: <b>" + party + "</b></p>"
								+ "<p> Type of donor: <b>" + entity + "</b></p>"
								+ "<p> Total value: <b>&#163;" + comma(amount) + "</b></p>";


	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("cy") - (d.radius+150)) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");

	updateHistoryBar(d,imageFile);
	}

function mouseout() {
	// no more tooltips
		var mosie = d3.select(this);
    	responsiveVoice.cancel();//cancel voise out of cercle
		mosie.classed("active", false);

		d3.select(".tooltip")
			.style("display", "none");
		}

$(document).ready(function() {
		d3.selectAll(".switch").on("click", function(d) {
      var id = d3.select(this).attr("id");
      return transition(id);
    });
    return d3.csv("data/7500up.csv", display);

});
