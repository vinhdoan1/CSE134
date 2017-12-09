function loadEditOpponentPage(){
  checkLoggedIn(); 
  populateOpponentData();
}

function validateAddOpponentForm(){
  var incomplete = false;
  var opponent = {
    name: "",
    logo: ""
  }
  opponent.name = document.getElementById('opteaminput').value;
  incomplete = opponent.name == "";

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
    addOpponent(opponent).then(function(){
      window.location='manageopponents.html';
    });

  }
}

function addOpponent(opponent){
  var teamID = mainState.getState().teamID;
  return firestoreDB.addOpponent(teamID, opponent.name, opponent.logo);
}

function loadOpponents(){
  var teamID = mainState.getState().teamID;
  firestoreDB.getAllOpponents(teamID).then(function(snapshot) {
    var numOps = 0;
    snapshot.forEach(function(opponent) {
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

function deleteOpponent(){
  var opID = mainState.getState().opID;
  console.log(opID);
  firestoreDB.deleteOpponent(opID).then(function(){
    // window.location='manageopponents.html';
  }).catch(function(error){
    displayMessage("editopmsg", "error", "There was a problem trying to delete opponent");
  });
}

//Loads opponent image for game details
function loadOpponentImage(selectid, logoid){
  var op = document.getElementById(selectid);
  var teamID = mainState.getState().teamID;
  var opID = op.value;
  firestoreDB.getOpponent(teamID, opID).then(function(opponent){
    var imgsrc = opponent.data().logo;
    var logo = document.getElementById(logoid);
    logo.src = imgsrc;
    logo.style.height = "5 rem";
  });
}