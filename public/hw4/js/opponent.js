function goToAddOpponent(back){
  localStorage.setItem("back", back);
  window.location = 'addopponent.html';
}

function goBack(){
  window.location = localStorage.getItem("back");
}

function validateOppForm(){
  var incomplete = false;
  var opponent = {
    name: "",
    logo: ""
  }
  opponent.name = document.getElementById('opteaminput').value;
  incomplete = opponent.name == "";
  //logo check later? 

  var error_msg = document.getElementById('addop_error');
  if(incomplete){
    error_msg.style.display = 'block';
  }
  else{
    error_msg.style.display = 'none';
    addOpponent(opponent);
  }
}

function addOpponent(opponent){
  var state = mainState.getState();
  var teamID = state.teamID;
  var opponentList = api.getOpponents(teamID);
  var duplicate_msg = document.getElementById('addop_duplicate');
  
  var exists = opponentList.some(function(other){
    return other.name == opponent.name;
  });
  if(exists){
    duplicate_msg.style.display = 'block';
  }
  else{
    duplicate_msg.style.display = 'none';

    var logo = document.getElementById('oplogoimg');
    if(logo.src != ""){
      opponent.logo = logo.src;
    }

    opponentList.push(opponent);
    api.setOpponents(teamID, opponentList);
    window.location = localStorage.getItem("back");
  }
}

function uploadOpLogo() {
  var logoForm = document.getElementById('oplogoupload');
  if (logoForm.files.length <= 0) {
    return;
  }
  image.readImageAndResize(logoForm.files[0], 300, function(result) {
    var oplogo = document.getElementById('oplogoimg');
    oplogo.style.visibility = "visible";
    oplogo.src = result;
    imageSet = true;
  }, true);
}

function loadOpponentImage(selectid, logoid){
  // console.log('loadopponentimg');
  var op = document.getElementById(selectid);
  var opname = op.value;
  var imgsrc = getOpTeamLogo(opname)
  var logo = document.getElementById(logoid);
  logo.src = imgsrc;
  logo.style.height = "5 rem";
}