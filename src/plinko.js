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

// UI controls
var resetButton
var dropButton
var columnsSlider;
var columnsVal;
var rowsSlider;
var rowsVal;
var puckCount;

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

  // Create the plinko board
  createBoard();

  // Create the puck bins
  createBins();

  // Create boundaries at the bottom, left, and right (x, y, w, h)
  var bottom = new Boundary(width / 2, height + 50, width, 100);
  var left   = new Boundary(-10, height / 2, 10, height);
  var right  = new Boundary(width + 10, height / 2, 10, height);
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
  for (var i = 0; i < 9; i++) 
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
  var x = 30;
  text("0", x, height - 10);
  text("1", x + 65, height - 10);
  text("2", x + 135, height - 10);
  text("3", x + 200, height - 10);
  text("4", x + 265, height - 10);
  text("5", x + 335, height - 10);
  text("6", x + 400, height - 10);
  text("7", x + 465, height - 10);
  text("8", x + 530, height - 10);

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