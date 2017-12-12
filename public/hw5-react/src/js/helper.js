var helper={};

helper.displayMessage = function displayMessage(elementid, type, message){
  var msg = document.getElementById(elementid);
  msg.style.color = (type === "error") ? "#900000" : "#68b7f5";
  msg.innerHTML = message;
  document.getElementById(elementid).style.opacity="1";
  if(type === "confirm"){
    setTimeout(function(){
      document.getElementById(elementid).style.opacity="0";
    }, 4000);
  }
}

helper.readImageAndResize = function readImageAndResize(imageFile, sideLength, callback, png) {
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

//imageFileName : the filename value from the file upload
//teamLogoContainer : the img element that contains the logo
helper.uploadLogo = function uploadLogo(imageFileName, teamLogoContainer) {
  var logoForm = document.getElementById(imageFileName);
  if (logoForm.files.length <= 0) {
    return;
  }
  helper.readImageAndResize(logoForm.files[0], 300, function(result) {
    var playerImage = document.getElementById(teamLogoContainer);
    playerImage.style.visibility = "visible";
    playerImage.src = result;
  }, true);
}

helper.hideMessage = function hideMessage(elementid){
  document.getElementById(elementid).innerHTML = "";
  document.getElementById(elementid).style.opacity = "0";
}

export default helper;
