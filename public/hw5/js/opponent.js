function validateAddOpponentForm(){
  var incomplete = false;
  var opponent = {
    name: "",
    logo: ""
  }
  opponent.name = document.getElementById('opteaminput').value;
  incomplete = opponent.name == "";

  //logo check later?
  var opLogo = document.getElementById('opponent_teamimg').src;
  if(opLogo != ""){
    opponent.logo = opLogo;
  }

  var error_msg = document.getElementById('addop_error');
  if(incomplete){
    displayMessage("addopmsg", "error", "Please fill out a team name");
  }
  else{
    hideMessage("addopmsg");
    addOpponent(opponent);
  }
}

function addOpponent(opponent){
  var teamID = mainState.getState().teamID;
  firestoreDB.addOpponent(teamID, opponent.name, opponent.logo);
  // var state = mainState.getState();
  // var teamID = state.teamID;
  // var opponentList = api.getOpponents(teamID);
  // var duplicate_msg = document.getElementById('addop_duplicate');
  
  // var exists = opponentList.some(function(other){
  //   return other.name == opponent.name;
  // });
  // if(exists){
  //   duplicate_msg.style.display = 'block';
  // }
  // else{
  //   duplicate_msg.style.display = 'none';

  //   var logo = document.getElementById('oplogoimg');
  //   if(logo.src != ""){
  //     opponent.logo = logo.src;
  //   }
  //   opponentList.push(opponent);
  //   api.setOpponents(teamID, opponentList);
  //   window.location = localStorage.getItem("back");
  // }
}

function loadOpponents(){
  var teamID = mainState.getState().teamID;
  db.collection("teams").doc(teamID).collection("opponents").get().then(function(snapshot) {
    var numOps = 0;
    snapshot.forEach(function(opponent) {
        console.log(opponent.id, " => ", opponent.data().name);
        var opListElement = createOpponentElement(opponent.data().name, opponent.data().logo);
        document.getElementById('opponentscontainer').appendChild(opListElement);
        numOps++;
    });
    if(numOps == 0){
      document.getElementById('emptyopponents').style.fontSize = "1rem";
    }
  });
}

function createOpponentElement(opName, opLogo){
  var div = document.createElement("div");
  div.setAttribute("class", "opListElement");
  var logo = document.createElement('img');
  logo.setAttribute("src", opLogo);
  logo.setAttribute("class", "opListImg");
  var name = document.createElement('div');
  name.setAttribute("class", "opListName")
  name.innerHTML = opName;
  // btn.onclick =;
  div.appendChild(logo);
  div.appendChild(name);
  return div;
}

function deleteOpponent(opponent){}

//Loads opponent image for game details
function loadOpponentImage(selectid, logoid){
  // console.log('loadopponentimg');
  var op = document.getElementById(selectid);
  var opname = op.value;
  var imgsrc = getOpTeamLogo(opname)
  var logo = document.getElementById(logoid);
  logo.src = imgsrc;
  logo.style.height = "5 rem";
}