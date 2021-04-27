console.log("app.js loaded");

// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

// Calculate chart width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

