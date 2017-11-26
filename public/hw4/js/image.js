var image = {};
image.readImageAndResize = readImageAndResize;

function readImageAndResize(imageFile, sideLength, callback) {
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
      var dataurl = canvas.toDataURL('image/jpeg', 1.0);
      return callback(dataurl);
    };
  };
  reader.readAsDataURL(imageFile);
}
