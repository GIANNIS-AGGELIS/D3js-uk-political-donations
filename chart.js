// GLOBALS
var w = 1000,h = 900;
var padding = 2;
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;
var radius = d3.scale.sqrt().range([10, 20]);
var snd = new Audio("button-3.wav");//sound for buttons


var Google_search = "https://www.google.com/search?q=";

var partyCentres = {
    con: { x: w / 3, y: h / 3.3},
    lab: {x: w / 3, y: h / 2.3},
    lib: {x: w / 3	, y: h / 1.8}
  };

var entityCentres = {
    company: {x: w / 3.65, y: h / 2.3},
		union: {x: w / 3.65, y: h / 1.8},
		other: {x: w / 1.15, y: h / 1.9},
		society: {x: w / 1.12, y: h  / 3.2 },
		pub: {x: w / 1.8, y: h / 2.8},
		individual: {x: w / 3.65, y: h / 3.3},
	};

 var fill = d3.scale.ordinal().range(["#20133B", "#002e0c", "#1ec9bc"]);// Change colosr for balls

var svgCentre = {
    x: w / 3.6, y: h / 2
  };

var svg = d3.select("#chart").append("svg")
	.attr("id", "svg")
	.attr("width", w)
	.attr("height", h);

var nodeGroup = svg.append("g");

var tooltip = d3.select("#chart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip");

var comma = d3.format(",.0f");

function transition(name) {
    if (name === "all-donations")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeIn(250);
      	$("#value-scale").fadeIn(1000);
      	$("#view-donor-type").fadeOut(250);
      	$("#view-source-type").fadeOut(250);
      	$("#view-party-type").fadeOut(250);
      	$("#view-amount-type").fadeOut(250);
      	return total();
    	//location.reload();
    }
    if (name === "group-by-party")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeOut(250);
      	$("#value-scale").fadeOut(250);
      	$("#view-donor-type").fadeOut(250);
      	$("#view-source-type").fadeOut(250);
      	$("#view-party-type").fadeIn(1000);
      	$("#view-amount-type").fadeOut(250);
      	return partyGroup();
    }
    if (name === "group-by-donor-type")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeOut(250);
      	$("#value-scale").fadeOut(250);
      	$("#view-party-type").fadeOut(250);
      	$("#view-source-type").fadeOut(250);
      	$("#view-donor-type").fadeIn(1000);
      	$("#view-amount-type").fadeOut(250);
      	return donorType();
    }
    if (name === "group-by-money-source")
    {
        snd.currentTime = 0;
        snd.play();
      	$("#initial-content").fadeOut(250);
      	$("#value-scale").fadeOut(250);
      	$("#view-donor-type").fadeOut(250);
      	$("#view-party-type").fadeOut(250);
      	$("#view-source-type").fadeIn(1000);
      	$("#view-amount-type").fadeOut(250);
      	return fundsType();
    }
    if (name === "group-by-the-amount-of-donors")
    {
        snd.currentTime = 0;
        snd.play();
    		$("#initial-content").fadeOut(250);
    		$("#value-scale").fadeOut(250);
    		$("#view-donor-type").fadeOut(250);
    		$("#view-party-type").fadeOut(250);
    		$("#view-source-type").fadeOut(250);
    		$("#view-amount-type").fadeIn(250);
    		return amountType();
    }


	}


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
			.friction(0.75)
			.charge(function(d) { return -Math.pow(d.radius, 2) / 3; })
			.on("tick", all)
			.start();

		node.transition()
			.duration(1000)// ball laod seed 
			.attr("r", function(d) { return d.radius; });
}

function total() {

	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", all)
		.start();
}

function partyGroup() {
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", parties)
		.start();
		// .colourByParty();
}

function donorType() {
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", entities)
		.start();
}

function fundsType() {
	force.gravity(0)
		.friction(0.75)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", types)
		.start();
}

function amountType() {
	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", amount)
		.start();
}

function amount(e) {
	node.each(moveToAmount(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}


function moveToAmount(alpha) {
	return function(d) {
    var centreY = entityCentres[d.entity].y;
		var centreX = entityCentres[d.entity].x;

			centreX= svgCentre.x + 400;
			centreY= svgCentre.y;
      if (d.value > 0 && d.value <= 30000)
      {
        centreX = svgCentre.x + 400;
		centreY = svgCentre.y + 200;
      }
	  else if (d.value >= 30001 && d.value <= 150000 )
	  {
		  centreX = svgCentre.x + 400;
		  centreY = svgCentre.y - 150;
	  }
	  else if(d.value >= 150001 && d.value <= 500000)
	  {
		  centreX = svgCentre.x - 115;
		  centreY = svgCentre.y - 200;
	  }
	  else if(d.value >= 500001 && d.value <= 5000000)
	  {
		  centreX = svgCentre.x - 90;
		  centreY = svgCentre.y + 200;
	  }
	  else
	  {
		  centreX = svgCentre.x + 200;
		  centreY = svgCentre.y;
	  }

		d.x += (centreX - d.x) * (brake + 0.06) * alpha * 1.2;
		d.y += (centreY - 100 - d.y) * (brake + 0.06) * alpha * 1.2;
	};
}

function parties(e) {
	node.each(moveToParties(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function entities(e) {
	node.each(moveToEnts(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function types(e) {
	node.each(moveToFunds(e.alpha));


		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function all(e) {
	node.each(moveToCentre(e.alpha))
		.each(collide(0.001));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}


function moveToCentre(alpha) {
	return function(d) {
		var centreX = svgCentre.x + 75;
			if (d.value <= 25001) {
				centreY = svgCentre.y + 75;
			} else if (d.value <= 50001) {
				centreY = svgCentre.y + 55;
			} else if (d.value <= 100001) {
				centreY = svgCentre.y + 35;
			} else  if (d.value <= 500001) {
				centreY = svgCentre.y + 15;
			} else  if (d.value <= 1000001) {
				centreY = svgCentre.y - 5;
			} else  if (d.value <= maxVal) {
				centreY = svgCentre.y - 25;
			} else {
				centreY = svgCentre.y;
			}

		d.x += (centreX - d.x) * (brake + 0.06) * alpha * 1.2;
		d.y += (centreY - 100 - d.y) * (brake + 0.06) * alpha * 1.2;
	};
}

function moveToParties(alpha) {
	return function(d) {
		var centreX = partyCentres[d.party].x + 50;
		if (d.entity === 'pub') {
			centreX = 1200;
		} else {
			centreY = partyCentres[d.party].y;
		}

		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
}

function moveToEnts(alpha) {
	return function(d) {
		var centreY = entityCentres[d.entity].y;
		if (d.entity === 'pub') {
			centreX = 1200;
		} else {
			centreX = entityCentres[d.entity].x;
		}

		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
}

function moveToFunds(alpha) {
	return function(d) {
		var centreY = entityCentres[d.entity].y;
		var centreX = entityCentres[d.entity].x;
		if (d.entity !== 'pub') {
			centreY = 300;
			centreX = 350;
		} else {
			centreX = entityCentres[d.entity].x + 60;
			centreY = 380;
		}
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
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

function openInNewTab(Google_search,attribute_search) {
  Google_search = Google_search + attribute_search;
  var win = window.open(Google_search , '_blank');
  win.focus();
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
	var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + donor + ".ico";



	// *******************************************


  responsiveVoice.speak("The donor is " + donor +"and gave an amount "+ amount +"british pounds. On the " + party ,"UK English Male");//voise for cercles





	var infoBox = "<p> Source: <b>" + donor + "</b> " +  "<span><img src='" + imageFile + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>"

	 							+ "<p> Recipient: <b>" + party + "</b></p>"
								+ "<p> Type of donor: <b>" + entity + "</b></p>"
								+ "<p> Total value: <b>&#163;" + comma(amount) + "</b></p>";


	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("cy") - (d.radius+150)) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");


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
