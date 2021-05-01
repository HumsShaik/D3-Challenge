 console.log("app.js loaded");

// =====================
//   Set up our chart
// =====================

const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Calculate chart width and height

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;


// ====================================================
//   Create an SVG wrapper,
//   append an SVG group that will hold our chart,
//   and shift the latter by left and top margins.
// ====================================================

const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight );

// append an SVG group that will hold our chart

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

   // Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// ====================================================================
//  function for updating x-scale and y-scale upon click on axis label
// ====================================================================

// function used for updating x-scale var upon click on axis label

function xScale(data, chosenXAxis) {
  // create scales
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis])-2,d3.max(data, d => d[chosenYAxis])+2])
    .range([height, 0]);

  return yLinearScale;

}

// ====================================================================
//  function for updating xAxis and yAxis upon click on axis label
// ====================================================================

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// ====================================================================
//   function for updating circles group to new circles x and y
// ====================================================================


// functions used for updating circles group with a transition to new circles for x
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// functions used for updating circles group with a transition to new circles for y
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis])+5)

  return circlesGroup;
}

// ===========================
//   Updating text location
// ===========================

function renderXText(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis])+5)

  return circlesGroup;
}

// ============================================================
//  function used for updating circles group with new tooltip
// ============================================================

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    xlabel = "Age:";
  }
  else if (chosenXAxis === "income"){
      xlabel = "Household income:"
  }

  if (chosenYAxis === 'healthcare'){
      ylabel = "Health:"
  }
  else if (chosenYAxis === 'obesity'){
      ylabel = "Obesity:"
  }
  else if (chosenYAxis === 'smokes'){
      ylabel = "Smokes:"
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .style("color", "black")
    .style("background", 'white')
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // on mouseout event
  .on("mouseout", function(data, index) {
  toolTip.hide(data);
  });

  return circlesGroup;
}

// ===============================================================
//  Retrieve data from the CSV file and execute everything below
// ===============================================================

d3.csv("assets/data/data.csv").then(function(data, err) {
  // console.log(data)
  if (err) throw err;

  // parse data
  data.forEach(d => {
    d.poverty = +d.poverty;
    d.povertyMoe = +d.povertyMoe;
    d.age = +d.age;
    d.ageMoe = +d.ageMoe;
    d.income = +d.income;
    d.incomeMoe = +d.incomeMoe;
    d.healthcare = +d.healthcare;
    d.healthcareLow = +d.healthcareLow;
    d.healthcareHigh = +d.healthcareHigh;
    d.obesity = +d.obesity;
    d.obesityLow = +d.obesityLow;
    d.obesityHigh = +d.obesityHigh;
    d.smokes = +d.smokes;
    d.smokesLow = +d.smokesLow;
    d.smokesHigh = +d.smokesHigh;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("g");

  var circles = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed('stateCircle', true);

  // append text inside circles
  var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    //to center the text in the circles
    .attr("dy", d => yLinearScale(d[chosenYAxis])+5) 
    .classed('stateText', true);

  // =======================================
  // Create group for three x-axis labels
  // =======================================

  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var PovertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    // value to grab for event listener
    .attr("value", "poverty") 
    .classed("active", true)
    .text("In Poverty (%)");

  var AgeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    // value to grab for event listener
    .attr("value", "age") 
    .classed("inactive", true)
    .text("Age (Median)");

  var IncomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    // value to grab for event listener
    .attr("value", "income") 
    .classed("inactive", true)
    .text("Household Income (Median)");
  
 