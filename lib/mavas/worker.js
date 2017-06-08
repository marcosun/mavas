const drawCanvas = function() {
  onmessage = function(e) {
    console.log('Message received from main script');
    var workerResult = 'Result: ' + (JSON.stringify(e.data));
    console.log('Posting message back to main script');
    console.log(e.data.canvas);
    postMessage(workerResult);
  }
};

export default drawCanvas;