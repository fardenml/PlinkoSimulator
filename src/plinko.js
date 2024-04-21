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
var pegSize = 14.1;
var puckSize = 9.1;

// UI controls
var resetButton
var dropButton
var colsVal;
var aspectRatio;
var puckCount;
var resultsButton;
var dropPucks;
var testSetButton;

// Test Set variables
let testSet;
let testDrops;
let testWidth;
let testWidths = [];
let testRatio;
let testRatios = [];

// Main setup function
function setup() 
{
  createCanvas(600, 1050);
  colorMode(HSB);

  // Create buttons and inputs
  resetButton = createButton("Reset");
  resetButton.position(134, 15);
  resetButton.mousePressed(createSketch);

  dropButton = createButton("Start");
  dropButton.position(283, 15);
  dropButton.mousePressed(dropThePucks);

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
  resultsButton.position(340, 15);
  resultsButton.mousePressed(exportResults);

  testSetButton = createButton("Run Test Set");
  testSetButton.position(455, 15);
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
  cols = colsVal.value();
  rows = (colsVal.value() * aspectRatio.value());
  puckCount.value(1);
  dropPucks = false;

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

// Export the results
function exportResults()
{
  if( pucks.length == puckCount.value() )
  {
    for (var i = 0; i < pucks.length; i++)
    {
      binVals(pucks[i].body.position.x, pucks[i].body.position.y);
    }

    /* Expected Format:
    <?xml version="1.0" encoding="utf-8" ?>
    <PlinkoTestResults>
    <PlinkoTestRuns>
      <TestRunResult description="7 x 17" drops="100">
        <BoardGeometry>7,17</BoardGeometry>
        <ResultBins>20,89,267,402,289,92,27</ResultBins>
        <ResultsImage>ResultsImage.png</ResultsImage>
      </TestRunResult>
    </PlinkoTestRuns>
    </PlinkoTestResults>
    */

    let endLine = '\n';
    let tab = '\t';
    let doubleTab = '\t\t';

    let testResults = '<?xml version="1.0" encoding="utf-8" ?>' + endLine;
    testResults += '<PlinkoTestResults>' + endLine;
    testResults += '<PlinkoTestRuns>' + endLine;
    testResults += tab + '<TestRunResults description=\"' + cols + ' x ' + rows + '\" drops=\"' + pucks.length + '\">' + endLine;
    testResults += doubleTab + '<BoardGeometry>' + cols + ',' + rows + '</BoardGeometry>' + endLine;
    testResults += doubleTab + '<ResultBins>';

    // Loop over all the bins and write the puck count
    for (let i = 0; i < 9; i++)
    {
      testResults += binCounts[i];
      if( i != 8)
      {
        testResults += ',';
      }
    }

    testResults += '</ResultBins>' + endLine;
    testResults += doubleTab + '<ResultsImage>ResultsImage.png</ResultsImage>' + endLine;
    testResults += tab + '</TestRunResult>' + endLine;
    testResults += '</PlinkoTestRuns>' + endLine;
    testResults += '</PlinkoTestResults>';

    // .split() outputs an Array
    let stringOut = split(testResults, endLine);

    // Save the results string to an xml file
    saveStrings(stringOut, 'TestResults', 'xml');

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
  let test = testSet.getChildren(); 
  
  testWidth = test[0].getContent();
  testRatio = test[1].getContent();
  testDrops = test[2].getContent();

  testWidths = split(testWidth, ',');
  testRatios = split(testRatio, ',');

  colsVal.value(testWidths[0]);
  aspectRatio.value(testRatios[0]);
  puckCount.value(testDrops);
}

// Determine the number of pucks in each bin
function binVals(x, y)
{
  if( y > 940 )
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

  if (dropPucks && pucks.length < puckCount.value())
  {
    if (frameCount % 30 == 0) 
    {
      newPuck();
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