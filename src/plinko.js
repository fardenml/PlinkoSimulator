var Engine = Matter.Engine,
    World  = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies;

var engine;
var world;
var pucks = [];
var pegs = [];
var bounds = [];
var cols = 11;
var rows = 10;

function setup() 
{
  createCanvas(600, 800);
  colorMode(HSB);
  engine = Engine.create();
  world = engine.world;

  var spacing = width / cols;
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

  var b = new Boundary(width / 2, height + 50, width, 100);
  bounds.push(b);

  for (var i = 0; i < cols + 2; i++) 
  {
    var x = i * spacing;
    var h = 200;
    var w = 10;
    var y = height - h / 2;
    var b = new Boundary(x, y, w, h);
    bounds.push(b);
  }
}

function newPuck()
{
  var p = new Puck(300, 0, 10);
  pucks.push(p);
}

function draw()
{
  background(0, 0, 0);
  //if (frameCount % 20 == 0) 
  //{
  //  newPuck();
  //}
  Engine.update(engine, 1000 / 30);
  for (var i = 0; i < pucks.length; i++)
  {
    pucks[i].show();
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

function onButtonClick()
{
  newPuck();
}

const button = document.querySelector('button');
button.addEventListener('click', onButtonClick);
