import { Vector3 } from 'three';
import { Easing } from './animation/easing/Easing';

const title = 'Disintegrator';
const defaultSeed = 'kedan';

const defaults = {
  debug: false,
  grid: true,
  autohash: false,

  maxEdgeLength: 0.05,
  maxIterations: 6,

  geometry: 'torus',
  density: 4,

  wind: new Vector3(0, 0, 0),
  spread: 2,
  turbulence: 12,
  stagger: 300,
  dynamics: 0.5,

  easing: new Easing(),
  easingFunction: 'circ',
  easingCategory: 'In',

  reversed: false,
  duration: 1000,
  loopDuration: 3000,
  delay: 850,
};

const ranges = {
  density: { min: 1, max: 10, step: 1 },

  spread: { min: 1, max: 10, step: 0.1 },
  turbulence: { min: 1, max: 20, step: 0.1 },
  stagger: { min: 0, max: 500, step: 5 },
  dynamics: { min: 0, max: 1, step: 0.01 },

  x: { min: -5, max: 5, step: 0.1 },
  y: { min: -5, max: 5, step: 0.1 },
  z: { min: -5, max: 5, step: 0.1 },

  delay: { min: 0, max: 1000, step: 50 },
  duration: { min: 500, max: 5000, step: 50 },
  loopDuration: { min: 1000, max: 7500, step: 50 },
};

const random = JSON.parse(JSON.stringify(ranges));
['x', 'y', 'z', 'loopDuration', 'defaultSeed'].forEach(
  (key) => delete random[key]
);
random.density.min = 2;
random.density.max = 6;
random.duration.min = 1000;

const settings = { title, defaultSeed, ranges, random };

settings.reset = () => {
  Object.entries(defaults).forEach(([key, value]) => {
    settings[key] = value;
  });

  const { easingFunction, easingCategory } = settings;
  settings.easing = new Easing(easingFunction, easingCategory);

  settings.wind.x = 0;
  settings.wind.y = 0;
  settings.wind.z = -4;
};

export { settings };
