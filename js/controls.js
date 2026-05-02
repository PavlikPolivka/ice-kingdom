const state = {
  left: false,
  right: false,
  jump: false,
  jumpJustPressed: false,
  _jumpHeldLastFrame: false,
};

const keys = new Set();
let touchInited = false;

function onKeyDown(e) {
  keys.add(e.code);
  updateFromKeys();
}

function onKeyUp(e) {
  keys.delete(e.code);
  updateFromKeys();
}

function updateFromKeys() {
  state.left = keys.has('ArrowLeft') || keys.has('KeyA');
  state.right = keys.has('ArrowRight') || keys.has('KeyD');
  state.jump = keys.has('Space') || keys.has('ArrowUp') || keys.has('KeyW');
}

function bindTouchButton(id, prop) {
  const el = document.getElementById(id);
  if (!el) return;
  const set = (v) => (e) => {
    e.preventDefault();
    state[prop] = v;
  };
  el.addEventListener('touchstart', set(true), { passive: false });
  el.addEventListener('touchend', set(false), { passive: false });
  el.addEventListener('touchcancel', set(false), { passive: false });
  el.addEventListener('mousedown', set(true));
  el.addEventListener('mouseup', set(false));
  el.addEventListener('mouseleave', set(false));
}

function initTouch() {
  if (touchInited) return;
  touchInited = true;
  bindTouchButton('btn-left', 'left');
  bindTouchButton('btn-right', 'right');
  bindTouchButton('btn-jump', 'jump');
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
initTouch();

export function tickControls() {
  state.jumpJustPressed = state.jump && !state._jumpHeldLastFrame;
  state._jumpHeldLastFrame = state.jump;
}

export const controls = state;
