import { Ticker } from './animation/Ticker';

import { stage } from './stage';
import { render } from './render';
import { core } from './core';
import { gui } from './gui';
import { controls } from './controls';

init();

function init() {
  render.init();
  core.init();
  gui.init();
  controls.init();

  window.addEventListener('resize', resize);
  resize();

  const ticker = new Ticker(tick, 60);
  core.ticker = ticker;
  ticker.start();
}

function resize() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  const width = innerWidth;
  const height = innerHeight;

  const toResize = [stage, render];
  toResize.forEach((item) =>
    item.resize(width, height, Math.min(devicePixelRatio, 2))
  );
}

function tick(delta, time) {
  const toUpdate = [render, core];
  toUpdate.forEach((item) => item.update(time));
}
