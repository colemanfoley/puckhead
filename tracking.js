
var render = function(x, y) {
  $('.x').html('x is:' + x);
  $('.y').html('y is:' + y);
};

document.addEventListener('facetrackingEvent',
  function (event) {
    console.log(event)
      render(event.x, event.y);
  }
);
