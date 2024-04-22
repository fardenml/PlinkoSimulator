// Aliases for Matter.js
var Engine = Matter.Engine,
    World  = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies;

// Globals
var engine;
var world;
var pucks = [];
var pegs = [];
var bounds = [];
var cols;
var rows;
var binCounts;
var pegSize = 14.3;
var puckSize = 9.2;

// UI controls
var resetButton;
var startButton;
var colsVal;
var aspectRatio;
var puckCount;
var resultsButton;
var dropPucks;
var testSetButton;

// Test Results variables
let testResults = '';
let resultsString = '';
let endLine = '\n';
let tab = '   ';
let doubleTab = '      ';

// Test Set variables
let runningTestSet = false;
let testWidth;
let testRatio;
let testDrops;
let testWidths;
let testRatios;
let widthIndex = 0;
let ratioIndex = 0;

// Main setup function
function setup() 
{
  createCanvas(600, 1050);
  colorMode(HSB);

  // Create buttons and inputs
  resetButton = createButton("Reset");
  resetButton.position(132, 15);
  resetButton.mousePressed(createSketch);

  startButton = createButton("Start");
  startButton.position(280, 15);
  startButton.mousePressed(dropThePucks);

  stopButton = createButton("Stop");
  stopButton.position(335, 15);
  stopButton.mousePressed(stopAll);

  colsVal = createInput(7, 'number');
  colsVal.position(10, 15);
  colsVal.size(30);

  aspectRatio = createInput(2.5, 'number');
  aspectRatio.position(55, 15);
  aspectRatio.size(60);

  puckCount = createInput(1, 'number');
  puckCount.position(193, 15);
  puckCount.size(70);

  resultsButton = createButton("Export Results");
  resultsButton.position(388, 15);
  resultsButton.mousePressed(exportResults);

  testSetButton = createButton("Run Test Set");
  testSetButton.position(500, 15);
  testSetButton.mousePressed(importTestSet);

  // Create the sketch
  createSketch();
}

// Handle creating the sketch
function createSketch()
{
  // Initialize the physics engine
  engine = Engine.create();
  world = engine.world;
  
  // Initialize global values
  pucks = [];
  pegs = [];
  bounds = [];
  binCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  cols = round(colsVal.value());
  rows = round(colsVal.value() * aspectRatio.value());
  puckCount.value(1);
  dropPucks = false;

  if(runningTestSet == false)
  {
    testResults = '';
    resultsString = '';
  }

  // Create the plinko board
  createBoard();

  // Create the puck bins
  createBins();

  // Create boundaries at the bottom, left, and right (x, y, w, h)
  var bottom = new Boundary(width / 2, height + 49, width + 10, 100);
  var left   = new Boundary(-51, height / 2, 100, height + 10);
  var right  = new Boundary(width + 51, height / 2, 100, height + 10);
  bounds.push(bottom);
  bounds.push(left);
  bounds.push(right);
}

// Create the plinko board
function createBoard()
{
  var spacing = width / cols;

  // Create rows
  for (var j = 0; j < rows; j++)
  {
    // Create columns
    for (var i = 0; i <= cols; i++)
    {
      var x = i * spacing;
      if (j % 2 == 0)
      {
        x += spacing / 2;
      }
      var y = 60 + j * 50;
      var p = new Board(x, y, pegSize);
      pegs.push(p);
    }
  }
}

// Create the puck bins
function createBins()
{
  for (var i = 0; i < 10; i++) 
  {
    var x = i * width / 9;
    var h = 110;
    var w = 10;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    bounds.push(b);
  }
}

// Create a new puck
function newPuck()
{
  var p = new Puck(width / 2, 0, puckSize);
  pucks.push(p);
}

// Drop the pucks
function dropThePucks()
{
  dropPucks = true;
}

// Store the test results
function storeTestResults()
{
  // Gather all the puck counts
  for (var i = 0; i < pucks.length; i++)
  {
    binVals(pucks[i].body.position.x, pucks[i].body.position.y);
  }

  // Build the results string
  resultsString += tab + '<TestRunResults description=\"' + cols + ' x ' + rows + '\" drops=\"' + pucks.length + '\">' + endLine;
  resultsString += doubleTab + '<BoardGeometry>' + cols + ',' + rows + '</BoardGeometry>' + endLine;
  resultsString += doubleTab + '<ResultBins>';

  // Write all the puck counts
  for (let i = 0; i < 9; i++)
  {
    resultsString += binCounts[i];
    if(i != 8)
    {
      resultsString += ',';
    }
  }

  resultsString += '</ResultBins>' + endLine;
  resultsString += doubleTab + '<ResultsImage>ResultsImage.png</ResultsImage>' + endLine;
  resultsString += tab + '</TestRunResult>' + endLine;
}

// Export the results
function exportResults()
{
  // Store the results from the current manual run
  if(runningTestSet == false)
  {
    storeTestResults();
  }

  // Build the results string
  testResults = '<?xml version="1.0" encoding="utf-8" ?>' + endLine;
  testResults += '<PlinkoTestResults>' + endLine;
  testResults += '<PlinkoTestRuns>' + endLine;
  testResults += resultsString;
  testResults += '</PlinkoTestRuns>' + endLine;
  testResults += '</PlinkoTestResults>';

  // .split() outputs an Array
  let stringOut = split(testResults, endLine);

  // Save the results string to an xml file
  saveStrings(stringOut, 'TestResults', 'xml');

  if(runningTestSet == false)
  {
    // Save the current canvas as a png for the report
    saveCanvas('ResultsImage', 'png');
  }
}

function importTestSet()
{
  testSet = loadXML('src/TestSets/PlinkoTestSet.xml', runTestSet);
}

function runTestSet()
{
  runningTestSet = true;

  testResults = '';
  resultsString = '';

  let set = testSet.getChildren(); 
  
  testWidth = set[0].getContent();
  testRatio = set[1].getContent();
  testDrops = set[2].getContent();

  testWidths = split(testWidth, ',');
  testRatios = split(testRatio, ',');

  widthIndex = 0;
  ratioIndex = 0;
}

function setWidth(col)
{
  print('Setting width...')
  colsVal.value(col);
  print(colsVal.value());
}

function setAspectRatio(row)
{
  print('Setting aspect ratio...');
  aspectRatio.value(row);
  print(aspectRatio.value());
}

function stopAll()
{
  dropPucks = false;
  runningTestSet = false;
}

// Determine the number of pucks in each bin
function binVals(x, y)
{
  if( y > (height - 110) )
  {
    if( x > 0 && x < 66 )
    {
      binCounts[0]++;
    }
    else if( x > 67 && x < 133 )
    {
      binCounts[1]++;
    }
    else if( x > 134 && x < 200 )
    {
      binCounts[2]++;
    }
    else if( x > 201 && x < 266 )
    {
      binCounts[3]++;
    }
    else if( x > 267 && x < 333 )
    {
      binCounts[4]++;
    }
    else if( x > 334 && x < 400 )
    {
      binCounts[5]++;
    }
    else if( x > 401 && x < 466 )
    {
      binCounts[6]++;
    }
    else if( x > 467 && x < 533 )
    {
      binCounts[7]++;
    }
    else if( x > 534 && x < 600 )
    {
      binCounts[8]++;
    }
  }
};

// Main draw function
function draw()
{
  background(0, 0, 0);
  Engine.update(engine, 1000 / 30);

  if(dropPucks && pucks.length < puckCount.value())
  {
    if (frameCount % 30 == 0) 
    {
      newPuck();
    }
  }

  if(runningTestSet)
  {
    if(pucks.length == puckCount.value())
    {
      if(pucks[pucks.length - 1].body.position.y > height - 100)
      {
        dropPucks = false;

        storeTestResults();

        if(ratioIndex < testRatios.length)
        {
          ratioIndex++;
        }
      }
    }

    if(ratioIndex == testRatios.length)
    {
      ratioIndex = 0;
      widthIndex++;
    }

    if(widthIndex == testWidths.length)
    {
      exportResults();
      runningTestSet = false;
    }

    if(dropPucks == false && runningTestSet)
    {
      // Set the width
      setWidth(testWidths[widthIndex]);

      // Set the aspect ratio
      setAspectRatio(testRatios[ratioIndex]);

      // Update the sketch
      createSketch();
  
      // Set the number of drops
      puckCount.value(testDrops);
  
      // Start!
      dropThePucks();
    }
  }

  // Limit the number of rows, cols, and pucks
  if(aspectRatio.value() > 2.5)
  {
    aspectRatio.value(2.5);
  }
  else if(aspectRatio.value() < 1)
  {
    aspectRatio.value(1);
  }
  else if(colsVal.value() > 7)
  {
    colsVal.value(7);
  }
  else if(colsVal.value() < 5)
  {
    colsVal.value(5);
  }
  else if(puckCount.value() > 100)
  {
    puckCount.value(100);
  }
  else
  {
    // do nothing
  }

  // Control labels
  fill(0, 0, 100);
  text("Width", 12, 10);
  text("Aspect Ratio", 55, 10);
  text("Pucks to Drop", 195, 10);

  // Bin labels
  var y = height - 100;
  text("0", 30, y);
  text("1", 95, y);
  text("2", 165, y);
  text("3", 230, y);
  text("4", 295, y);
  text("5", 365, y);
  text("6", 430, y);
  text("7", 495, y);
  text("8", 560, y);

  for (var i = 0; i < pucks.length; i++)
  {
    pucks[i].show();
    if (pucks[i].body.position.y > 650)
    {
      pucks[i].setPhysics(); 
    }

    if (pucks[i].isOffScreen())
    {
      World.remove(world, pucks[i].body);
      pucks.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < pegs.length; i++)
  {
    pegs[i].show();
  }
  for (var i = 0; i < bounds.length; i++)
  {
    bounds[i].show();
  }
}