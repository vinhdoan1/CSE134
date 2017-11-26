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
    opponentList.push(opponent);
    api.setOpponents(teamID, opponentList);
    window.location = localStorage.getItem("back");
  }
}