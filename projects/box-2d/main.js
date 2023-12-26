import "./style.css";

import { b2World, b2Vec2, b2BodyDef, b2BodyType, b2PolygonShape, b2FixtureDef } from "@box2d/core";

const gravity = new b2Vec2(0, 10); // Gravity vector, 10 m/s^2 downward
const world = new b2World(gravity);

const groundBody = world.CreateBody({
  position: new b2Vec2(0, -10),
  type: b2BodyType.b2_staticBody,
});

const groundBox = new b2PolygonShape().SetAsBox(50, 10);
groundBody.CreateFixture({
  shape: groundBox,
  density: 0, // Static bodies don't need density
});

const dynamicBody = world.CreateBody({
  position: new b2Vec2(0, 4),
  type: b2BodyType.b2_dynamicBody,
});

const dynamicBox = new b2PolygonShape().SetAsBox(1, 1);
dynamicBody.CreateFixture({
  shape: dynamicBox,
  density: 1,
  friction: 0.3,
});

const timeStep = 1.0 / 60.0;
const velocityIterations = 6;
const positionIterations = 2;

function gameLoop() {
  world.Step(timeStep, velocityIterations, positionIterations);
  // ... rendering and game logic ...
  requestAnimationFrame(gameLoop);
}

gameLoop();
