var Box2D = require('./box2dnodeold.js');

// Define dimensions of objects.
var width  = 960;
var height = 480;
var sizeUnit = height / 100;
var puckRadius = 6 * sizeUnit;
var puckX = width / 2;
var puckY = height / 2;
var malletRadius = 10 * sizeUnit;
var gatesWidth = 5 * sizeUnit;
var gatesHeight = 33 * sizeUnit;
var worldCoeff = 0.01;  // Try scaling the world by this factor.
var score1 = 0;
var score2 = 0;

var createWorld = function(callback){

  // Box2D.
  b2World = Box2D.Dynamics.b2World,
  b2Vec2 = Box2D.Common.Math.b2Vec2,
  b2BodyDef = Box2D.Dynamics.b2BodyDef,
  b2Body = Box2D.Dynamics.b2Body,
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  world = new b2World(new b2Vec2(0, 0), true);

  fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.0;
  fixDef.restitution = 1.0;

  bodyDef = new b2BodyDef;

  // Create walls.
  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox( width * worldCoeff, 2 * worldCoeff );
  bodyDef.position.Set( 0, -2 * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( 0, height * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);

  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox( gatesWidth * worldCoeff, gatesHeight * worldCoeff );
  bodyDef.position.Set(0, 0);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( 0, height * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( width * worldCoeff, 0 );
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set( width * worldCoeff, height * worldCoeff );
  world.CreateBody(bodyDef).CreateFixture(fixDef);

  bodyDef.type = b2Body.b2_dynamicBody;
  fixDef.shape = new b2CircleShape;
  fixDef.shape.SetRadius( puckRadius * worldCoeff );
  bodyDef.position.Set( puckX * worldCoeff, puckY * worldCoeff );
  puckBody = world.CreateBody(bodyDef);
  puckBody.CreateFixture(fixDef);
  puckBody.SetLinearVelocity( new b2Vec2(4, 2) );  // Temp.

  malletFixDef = new b2FixtureDef;
  malletFixDef.density = 100.0;
  malletFixDef.friction = 0.0;
  malletFixDef.restitution = 0.0;

  bodyDef.type = b2Body.b2_dynamicBody;
  malletFixDef.shape = new b2CircleShape;
  malletFixDef.shape.SetRadius( malletRadius * worldCoeff );
  bodyDef.position.Set( height / 4 * worldCoeff, height / 2 * worldCoeff );
  mallet1Body = world.CreateBody(bodyDef);
  mallet1Body.CreateFixture(malletFixDef);
  bodyDef.position.Set( (width - height / 4) * worldCoeff, height / 2 * worldCoeff );
  mallet2Body = world.CreateBody(bodyDef);
  mallet2Body.CreateFixture(malletFixDef);

  callback();

};

//takes new x and y, moves the mallet toward that position at all times.
exports.updateMallet = function( malletData ) {
  if ( malletData.player === 1 ){
    var mallet1YDiff = (malletData.y * worldCoeff) - mallet1Body.GetPosition().y;
    var mallet1XDiff = (malletData.x * worldCoeff) - mallet1Body.GetPosition().x;
    mallet1Body.SetLinearVelocity(new b2Vec2((mallet1XDiff / 60) * 500, (mallet1YDiff / 60) * 500));
  } else {
    var mallet2XDiff = (malletData.x * worldCoeff) - mallet2Body.GetPosition().x;
    var mallet2YDiff = (malletData.y * worldCoeff) - mallet2Body.GetPosition().y;
    mallet2Body.SetLinearVelocity(new b2Vec2((mallet2XDiff / 60) * 500, (mallet2YDiff / 60) * 500));
  }
};

var updateScore = function(){
  var reload = false;
  if ( puckBody.GetPosition().x < gatesWidth * worldCoeff ){
    score2++;
    reload = true;
  }
  if ( puckBody.GetPosition().x > (width-gatesWidth) * worldCoeff ) {
    score1++;
    reload = true;
  }
  if ( score1 >= 5 || score2 >= 5 ){
    stop();
  } else if (reload){
    createWorld(function(){});
  }
};

var update = function() {
  updateScore();
  world.Step(1 / 60, 10, 10);
  world.ClearForces();
};

exports.watchWorldState = function(){
  var newWorldState = {};
  newWorldState.mallet1X = mallet1Body.GetPosition().x / worldCoeff;
  newWorldState.mallet1Y = mallet1Body.GetPosition().y / worldCoeff;
  newWorldState.mallet2X = mallet2Body.GetPosition().x / worldCoeff;
  newWorldState.mallet2Y = mallet2Body.GetPosition().y / worldCoeff;
  newWorldState.puckX = puckBody.GetPosition().x / worldCoeff;
  newWorldState.puckY = puckBody.GetPosition().y / worldCoeff;
  newWorldState.score1 = score1;
  newWorldState.score2 = score2;
  return newWorldState;
};

var interval;
exports.start = function(){
  if (interval) return;
  myTimer = setInterval(update, 1000 / 60);
};

var stop = function(){
  clearInterval(myTimer);
  interval = null;
};

exports.createWorld = createWorld;

