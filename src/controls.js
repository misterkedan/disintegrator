import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { core } from './core';
import { render } from './render';
import { stage } from './stage';

const controls = { visibleUI: true };

controls.init = () => {
  const orbit = new OrbitControls(stage.camera, render.canvas);
  orbit.screenSpacePanning = false;
  orbit.minDistance = 4;
  orbit.maxDistance = 20;
  orbit.maxPolarAngle = Math.PI / 2;
  controls.orbit = orbit;

  document.getElementById('random').addEventListener('click', () => {
    core.random();
  });

  const toggle = () => {
    core.visibleUI = !core.visibleUI;
    const visibility = core.visibleUI ? 'visible' : 'hidden';

    document.getElementById('overlay').style.visibility = visibility;
    document.querySelector('.lil-gui').style.visibility = visibility;
  };

  window.addEventListener('keyup', (event) => {
    const callbacks = {
      ' ': () => core.random(),
      h: () => toggle(),
    };

    const callback = callbacks[event.key];
    if (callback) callback();
  });
};

export { controls };
