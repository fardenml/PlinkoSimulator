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
var spacing;
var binCount_0;
var binCount_1;
var binCount_2;
var binCount_3;
var binCount_4;
var binCount_5;
var binCount_6;
var binCount_7;
var binCount_8;

// UI controls
var resetButton
var dropButton
var columnsSlider;
var columnsVal;
var rowsSlider;
var rowsVal;
var puckCount;
var resultsButton;

// Main setup function
function setup() 
{
  createCanvas(600, 800);
  colorMode(HSB);

  // Create buttons and inputs
  resetButton = createButton("Reset");
  resetButton.position(130, 15);
  resetButton.mousePressed(createSketch);

  dropButton = createButton("Drop");
  dropButton.position(195, 15);
  dropButton.mousePressed(newPuck);

  colsVal = createInput(10, 'number');
  colsVal.position(10, 15);
  colsVal.size(40);

  rowsVal = createInput(10, 'number');
  rowsVal.position(70, 15);
  rowsVal.size(40);

  puckCount = createInput(0, 'number');
  puckCount.position(255, 15);
  puckCount.size(40);

  resultsButton = createButton("Export Results");
  resultsButton.position(320, 15);
  resultsButton.mousePressed(exportResults);

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
  cols = colsVal.value();
  rows = rowsVal.value();
  puckCount.value(pucks.length);
  spacing = width / cols;
  binCount_0 = 0;
  binCount_1 = 0;
  binCount_2 = 0;
  binCount_3 = 0;
  binCount_4 = 0;
  binCount_5 = 0;
  binCount_6 = 0;
  binCount_7 = 0;
  binCount_8 = 0;

  // Create the plinko board
  createBoard();

  // Create the puck bins
  createBins();

  // Create boundaries at the bottom, left, and right (x, y, w, h)
  var bottom = new Boundary(width / 2, height + 50, width, 100);
  var left   = new Boundary(-9, height / 2, 10, height + 10);
  var right  = new Boundary(width + 9, height / 2, 10, height + 10);
  bounds.push(bottom);
  bounds.push(left);
  bounds.push(right);
}

// Create the plinko board
function createBoard()
{
  for (var j = 0; j < rows; j++)
  {
    for (var i = 0; i < cols + 1; i++)
    {
      var x = i * spacing;
      if (j % 2 == 0)
      {
        x += spacing / 2;
      }
      var y = spacing + j * spacing;
      var p = new Board(x, y, 14);
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
    var h = 150;
    var w = 10;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    bounds.push(b);
  }
}

// Create a new puck
function newPuck()
{
  var p = new Puck(width / 2, 0, 10);
  pucks.push(p);
  puckCount.value(pucks.length);
}

function exportResults()
{
  if( pucks.length > 0 )
  {
    for (var i = 0; i < pucks.length; i++)
    {
      pucks[i].show();
  
      binVals(pucks[i].body.position.x, pucks[i].body.position.y);
    }

    let myTable = new p5.Table();

    for (let i = 0; i < 9; i++)
    {
      myTable.addColumn("Bin " + i);
    }

    myTable.addRow();

    myTable.set(0,0,binCount_0);
    myTable.set(0,1,binCount_1);
    myTable.set(0,2,binCount_2);
    myTable.set(0,3,binCount_3);
    myTable.set(0,4,binCount_4);
    myTable.set(0,5,binCount_5);
    myTable.set(0,6,binCount_6);
    myTable.set(0,7,binCount_7);
    myTable.set(0,8,binCount_8);

    save(myTable, 'Plinko-Simulator-Results.csv');
  }
}

function binVals(x, y)
{
  if( y > 725 )
  {
    if( x > 0 && x < 66 )
    {
      binCount_0++;
    }
    else if( x > 67 && x < 133 )
    {
      binCount_1++;
    }
    else if( x > 134 && x < 200 )
    {
      binCount_2++;
    }
    else if( x > 201 && x < 266 )
    {
      binCount_3++;
    }
    else if( x > 267 && x < 333 )
    {
      binCount_4++;
    }
    else if( x > 334 && x < 400 )
    {
      binCount_5++;
    }
    else if( x > 401 && x < 466 )
    {
      binCount_6++;
    }
    else if( x > 467 && x < 533 )
    {
      binCount_7++;
    }
    else if( x > 534 && x < 600 )
    {
      binCount_8++;
    }
  }
};

// Main draw function
function draw()
{
  background(0, 0, 0);
  Engine.update(engine, 1000 / 30);

  // Control labels
  fill(0, 0, 100);
  text("Columns", 10, 10);
  text("Rows", 76, 10);
  text("Pucks", 262, 10);

  // Bin labels
  var y = height - 140;
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