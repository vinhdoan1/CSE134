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

function uploadLogo(imagefilenameid, teamlogoimgid) {
  var logoForm = document.getElementById(imagefilenameid);
  if (logoForm.files.length <= 0) {
    return;
  }
  image.readImageAndResize(logoForm.files[0], 300, function(result) {
    var playerImage = document.getElementById(teamlogoimgid);
    playerImage.style.visibility = "visible";
    playerImage.src = result;
    // imageSet = true;
  }, true);
}

function getTeamLogo(teamID){
  firestoreDB.getTeam(teamID).then(function(team){
    return team.data().logo;
  });
}

function getOpponentTeamLogo(teamID, opID){
  firestoreDB.getOpponent(teamID, opID).then(function(opponent){
    return opponent.data().logo;
  });
}
