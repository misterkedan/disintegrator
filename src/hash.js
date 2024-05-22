function load() {
  function removeHash(string) {
    return string.replace('#', '');
  }

  return removeHash(window.location.hash);
}

function save(string) {
  window.location.hash = string;
}

const hash = { load, save };

export { hash };
