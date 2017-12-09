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
}

function loadOpponents(){
  var teamID = mainState.getState().teamID;
  db.collection("teams").doc(teamID).collection("opponents").get().then(function(snapshot) {
    var numOps = 0;
    snapshot.forEach(function(opponent) {
        // console.log(opponent.id, " => ", opponent.data().name);
        var opListElement = createOpponentElement(opponent.id, opponent.data().name, opponent.data().logo);
        document.getElementById('opponentscontainer').appendChild(opListElement);
        numOps++;
    });
    if(numOps == 0){
      document.getElementById('emptyopponents').style.fontSize = "1rem";
    }
  });
}

function createOpponentElement(opID, opName, opLogo){
  var div = document.createElement("div");
  div.setAttribute("class", "opListElement");
  div.onclick= funToEditOpponent(opID);

  var logo = document.createElement('img');
  logo.setAttribute("src", opLogo);
  logo.setAttribute("class", "opListImg");
  var name = document.createElement('div');
  name.setAttribute("class", "opListName")
  name.innerHTML = opName;
  // div.onclick = toEditOpponent(opID);

  div.appendChild(logo);
  div.appendChild(name);
  return div;
}

function funToEditOpponent(opID){
  return function() {
    mainState.setState("opID", opID);
    window.location = 'editopponent.html';
  }
}

function populateOpponentData(){
  var opID = mainState.getState().opID;
  var teamID = mainState.getState().teamID;
  firestoreDB.getOpponent(teamID, opID).then(function(opponent){
    var opData = opponent.data();
    document.getElementById('newopname').value = opData.name;
    document.getElementById('editop_teamimg').src = opData.logo;
  });
}

function updateOpponent(){
  var opID = mainState.getState().opID;
  var teamID = mainState.getState().teamID;
  firestoreDB.getOpponent(teamID, opID).then(function(opponent){
    var opData = opponent.data();
    var newOpName = document.getElementById('newopname').value;
    newOpName = newOpName.replace(/\s+/g, '');
    
    var changesMade = false;
    if(newOpName != opData.name && newOpName != ""){
      opData.name = newOpName;
      changesMade = true;
    }
    var newOpLogo = document.getElementById('editop_teamimg').src;
    if(newOpLogo != opData.logo){
      opData.logo = newOpLogo;
      changesMade = true;
    }
    if(newOpName == ""){
      displayMessage("editopmsg", "error", "Opponent team name cannot be empty");
    }
    else{
      hideMessage('editopmsg');
      if(changesMade){
        firestoreDB.setOpponent(teamID, opID, opData);
        displayMessage("editopmsg", "confirm", "Opponent information updated");
      }
    }  
  });
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