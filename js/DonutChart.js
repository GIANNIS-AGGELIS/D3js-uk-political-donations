var width = 900, height = 600, radius = Math.min(width, height) / 2;
var arc, pie, svg, tots;
var div = d3.select("body").append("div").attr("class", "toolTip");
var percentageFormat = d3.format("%");
var color = d3.scale.ordinal().range(["#9c6f03", "#c9ff00", "#12e595", "#314d6d", "#5bc7a4 ", "#211f49", "#140a36"]);

function divByParty () {
  d3.csv("data/7500up.csv", function( data) {
  var data = d3.nest()
  .key(function(d) {
    return d.partyname;
  })
  .rollup(function(d) {
    return d3.sum(d, function(g) {
      return g.amount;
    });
  }).entries(data);

  tots = d3.sum(data, function(d) { 
      return d.values; 
      });

    data.forEach(function(d) {
          d.percentage = d.values  / tots;
      });

  return createPie(data);
  });
}

function splitByEntity() {
  d3.csv("data/7500up.csv", function( data) {  
  var data = d3.nest()
  .key(function(d) {
    return d.entityname;
  })
  .rollup(function(d) {
    return d3.sum(d, function(g) {
      return g.amount;
    });
  }).entries(data);
  return createPie(data);

  });
}

function splitByParty(){
  d3.csv("data/7500up.csv", function( data) {  
      var data = d3.nest()
      .key(function(d) {
        if (d.entity=='pub') {
        return 'Public Donations:';
        }
        else {
          return'Private Donations:';
        }
      
      })
      .rollup(function(d) {
        return d3.sum(d, function(g) {
          return g.amount;
        });
      }).entries(data);

      return createPie(data);

      });

}
       
function createPie(data) {
  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc")
    .attr("id", "mychart");
    

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d) {

      return color(d.data.key);
    })
  .on("mouseover", function(d) {

      div.style("left", d3.event.pageX+10+"px");
      div.style("top", d3.event.pageY-25+"px");
      div.style("display", "inline-block"); 
      
      svg.append("text")
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .style("font-size", 22)
        .style("font-weight", "bold")
        .attr("class","label")
        .style("fill", function(d,i){return "black";})
        .text( d.data.key +" - £" +d.data.values);

      d3.select(this)
      .attr("stroke", "white")
      .style("transform", "scale(1.05)");       
  })  
  .on("mouseout", function(d) {
    div.style("display", "none");
    svg.select(".label").remove();
    d3.select(this)
    .attr("stroke", "")
    .style("transform", "scale(1)");
  });

}

function splitByAmount(){

  d3.csv("data/7500up.csv", function( data) {  
    var data = d3.nest()
    .key(function(d) {
      if (d.amount <25000) {
        return "Donations up to 25k:";
      }  
      else if(d.amount<50000){
        return "Donations 25-50k:";
      }  
      else if(d.amount<100000){
        return "Donations 50k-100k:";
      }
      else if(d.amount<500000){
        return "Donations 100k-500k:";
      }
      else if(d.amount<1000000){
        return "Donations 500k-1M:";
      }
      else if(d.amount<2500000)
      {
        return "Donations 1M-2.5M:";
      }
      else{
        return "Donations over 2.5M";
      }  
    })
    .rollup(function(d) {
      return d3.sum(d, function(g) {
        return g.amount;
      });
    }).entries(data);  
    
    return createPie(data);

    });

}

function pieIn(){
  arc = d3.svg.arc()
    .outerRadius(radius - 30)
    .innerRadius(radius - 130);
  
  pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.values;
    });
  
  svg = d3.select("#pie").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width /1.55 + "," + height / 2 + ")");
} 
    
function transition (name) {
  d3.select("#pie").selectAll("*").remove();
  if (name === "group-by-money-source") {
    $("#initial-content").fadeIn(1000);
    $("#partypie").fadeOut(250);
    $("#donorpie").fadeOut(250);
    pieIn();
    return splitByEntity();
  }

  if (name ==="group-by-party") {
    $("#partypie").fadeIn(1000);
    $("#donorpie").fadeOut(250);
    pieIn();
    return divByParty();
  }
  if (name ==="group-by-donor-type") {
    $("#partypie").fadeOut(1000);
    $("#donorpie").fadeOut(250);
    pieIn();
    return splitByParty();
  }      
  if (name === "group-by-the-amount-of-donors") {
    $("#partypie").fadeOut(250);
    $("#donorpie").fadeIn(1000);
    pieIn();
    return splitByAmount();
  }
}
    

$(document).ready(function() {
  pieIn();
  splitByEntity();
  d3.selectAll(".switch").on("click", function(d) 
  {
    var id = d3.select(this).attr("id");
    return transition(id);
  });


});