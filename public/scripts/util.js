/**
 * waits for existence of fdc3 global
 * @param {*} callback
 */
function fdc3Init(callback) {
  let fdc3Tries = 10; //lets not check forever...
  const onFDC3Ready = () => {
    if (window.fdc3) {
      callback.call(this);
    }
    else {
      if (fdc3Tries > 0) {
        fdc3Tries--;
        window.setTimeout(onFDC3Ready, 100);
      }
    }
  };
  onFDC3Ready();
}
