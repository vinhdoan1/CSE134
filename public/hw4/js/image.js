var image = {};
image.readImageAndResize = readImageAndResize;

function readImageAndResize(imageFile, sideLength, callback, png) {
  let reader = new FileReader();
  reader.onloadend = () => {
    var image = document.createElement("img");
    image.src = reader.result;
    image.onload = function(){
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      canvas.width = sideLength;
      canvas.height = sideLength;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, sideLength, sideLength);
      var type = 'jpeg';
      if (png) {
        type = 'png';
      }
      var dataurl = canvas.toDataURL('image/' + type, 1.0);
      return callback(dataurl);
    };
  };
  reader.readAsDataURL(imageFile);
}
