var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data){
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.abbr);
    });

    // Step 2: Create scale functions
    // ==============================
    var xTimeScale = d3.scaleLinear()
      .domain([8,d3.max(healthData,(d)=>d.poverty)])
      .range([0,width]);
    var yLinearScale = d3.scaleLinear()
      .domain([4,d3.max(healthData,(d)=>d.healthcare)])
      .range([height,0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xTimeScale);
    var yAxis = d3.axisLeft(yLinearScale);
   
    
    // Step 4: Create Circles and Labels
    // ==============================
       

    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r","15")
      .attr("fill","#5BABEF")
      .attr("opacity",".8");
    
    var stateLabel = chartGroup.selectAll("text")
      .data(healthData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("dx", d => xTimeScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare))    
      .classed("circletext",true)
      .attr("fill","white")
      .attr("alignment-baseline","central")
      .attr("text-anchor","middle");
    
    
    // Step 5: Append Axes to the chart
    // ==============================
   
    chartGroup.append("g")
    .attr("transform", `translate (0,${height})`)
    .call(xAxis);
    chartGroup.append("g")
    .call(yAxis);  
    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
