function Puck(x, y, r)
{
  this.hue = random(360);
  var options = {
    restitution: 0.5,
    friction: 0,
    density: 1,
  };
  x += random(-1, 1);
  this.body = Bodies.circle(x, y, r, options);
  this.body.label = "puck";
  this.r = r;
  World.add(world, this.body);
}

Puck.prototype.show = function ()
{
  fill(this.hue, 255, 255);
  noStroke();
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  ellipse(0, 0, this.r * 2);
  pop();
};
