// GLOBALS
var w = 1000,h = 900;
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



var tooltip = d3.select("#chart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip");

var comma = d3.format(",.0f");




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




function openInNewTab(Google_search,attribute_search) {
  Google_search = Google_search + attribute_search;
  var win = window.open(Google_search , '_blank');
  win.focus();
}

///////////////////////////////
var sizeOfHistoryBar = 8;
var historyBarItemsCounter = 0;
var historyBarElement = document.getElementById("history");
var newImgElement = document.createElement("IMG");
var Tooltip = d3.select("body").append("div").attr("id", "Tooltip");

function updateHistoryBar(d, imagePath) {
    var imgNode = new Image(50, 50);
    imgNode.src = imagePath;
    imgNode.style.margin = "3px";
    imgNode.style.border = "2px solid black";
    imgNode.style.borderRadius = "4px";
    imgNode.onclick = function () {
        googleSearch(d.donor);
    };
    imgNode.onmouseover = function (event) {
        var pageX = event.clientX;
        var pageY = event.clientY;
        imgNode.style.boxShadow = "0 0 2px 1px rgba(50, 140, 186, 0.7)";
       Tooltip
            .style("opacity", 0.9)
            .html(d.donor)
            .style("left", pageX-170 +"px")
            .style("top", pageY +"px");
       
    };
    imgNode.onmouseout = function () {
        imgNode.style.boxShadow = "";
       Tooltip.style("opacity", 0);
        
    };
    newImgElement.appendChild(imgNode);

    if (historyBarItemsCounter >= sizeOfHistoryBar) {
        historyBarElement.removeChild(historyBarElement.childNodes[sizeOfHistoryBar - 1]); //remove last image
    } else {
        historyBarItemsCounter = historyBarItemsCounter + 1;
    }
    historyBarElement.insertBefore(imgNode, historyBarElement.childNodes[0]); //append new image
}


///////////////////////////
function format_description(d, imagePath) {
    var infoBox = "<img src='" + imagePath + "' ' height='42' width='42' '> </br>"
        + "<p> Source: <b>" + d.donor + "</b> </p>"
        + "<p> Recipient: <b>" + d.partyname + "</b> </p>"
        + "<p> Type of donor: <b>" + d.entityname + "</b> </p>"
        + "<p> Total value: <b>&#163;" + format_number(d.amount) + "</b> </p>";
    return infoBox;
}

console.log('edo');

function mouseOverArc(d) {
    d3.select(this).attr("stroke", "black").style("transform", "scale(1.05)");
    if (d.parent.donor != "root") {
		var imagePath = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + d.donor + ".ico";
		console.log('error');
        updateHistoryBar(d, imagePath);
        // responsiveVoice.speak(":" +d.donor +": with total value :" +d.amount +" pounds");
        chart2Tooltip.html(format_description(d, imagePath));
        return chart2Tooltip.style("display", "block").style("border", "2px solid" + oldToNewColors_dct[d.color]);
    }
    else {
        return null;
    }
}

function mouseOutArc(d) {
    d3.select(this).attr("stroke", "").style("transform", "scale(1)");
    // responsiveVoice.cancel();
    return chart2Tooltip.style("display", "none");
}

function mouseMoveArc(d) {
    if (d.parent.donor != "root") {
        return chart2Tooltip
            .style("top", (d3.event.pageY - 90) + "px")
            .style("left", (d3.event.pageX + 40) + "px");
    }
    else {
        return null;
    }
}