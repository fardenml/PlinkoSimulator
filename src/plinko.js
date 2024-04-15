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

  puckCount = createInput('');
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

  // Create the puck catchers
  createCatchers();

  // Create boundaries at the bottom, left, and right (x, y, w, h)
  var bottom = new Boundary(width / 2, height + 50, width, 100);
  var left   = new Boundary(0, height / 2, 10, height);
  var right  = new Boundary(width , height / 2, 10, height);
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

// Create the puck catchers
function createCatchers()
{
  for (var i = 0; i < 12; i++) 
  {
    var x = i * width / 10;
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
  var p = new Puck(300, 0, 10);
  pucks.push(p);
  puckCount.value(pucks.length);
}

// Main draw function
function draw()
{
  background(0, 0, 0);
  Engine.update(engine, 1000 / 30);

  //if (frameCount % 20 == 0) 
  //{
  //  newPuck();
  //}

  // Control labels
  fill(0, 0, 100);
  text("Columns", 10, 10);
  text("Rows", 76, 10);
  text("Pucks", 262, 10);

  for (var i = 0; i < pucks.length; i++)
  {
    pucks[i].show();
    //if (pucks[i].isOffScreen())
    //{
    //  World.remove(world, pucks[i].body);
    //  pucks.splice(i, 1);
    //  i--;
    //}
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