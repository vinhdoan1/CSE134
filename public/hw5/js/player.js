var imageSet = false;
var deleteState = 0; // for delete player confirmation
var sortFunction;

function sortSelect() {
  var sortSelector = document.getElementById('playersortselect');
  switch(sortSelector.selectedIndex) {
    case 1: // goals
        sortFunction = function(player1, player2) {
          return player1.goals > player2.goals;
        }
        break;
    case 2: // name
        sortFunction = function(player1, player2) {
          return player1.name > player2.name;
        }
        break;
    default: // number
        sortFunction = function(player1, player2) {
          return player1.number > player2.number;
        }
}
  refreshPlayers(true);
}

function refreshPlayers(fromSort) {
  var playerButtons = document.getElementById('playerButtons');
  while (playerButtons.firstChild) {
    playerButtons.removeChild(playerButtons.firstChild);
  }
  loadPlayers(fromSort);
}

// load players and display to screen
function loadPlayers(fromSort) {
  var state = mainState.getState();
  if (fromSort) {
    loadPlayerPage(state.players);
    return;
  }
  firestoreDB.getTeamPlayers(state.teamID).then(function (playersData) {
    if (!playersData) {
      return;
    }

    var players = [];
    playersData.forEach(function(doc) {
      players.push({
        id: doc.id,
        ...doc.data(),
      })
    });

    mainState.setState('players', players);
    loadPlayerPage(players);
  })
}

function loadPlayerPage(players) {
  players = players.filter(function(player) {
    return !player.deleted;
  })
  if (sortFunction) {
    players = players.sort(sortFunction);
  }
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var playerTemplate = document.getElementById('playerButtonTemplate').cloneNode(true);
    var playerButton = playerTemplate.content;
    var playerDiv = playerButton.querySelector("div");
    playerDiv.onclick = createToPlayerFunction(player);
    var playerDiv = playerButton.querySelector("img");
    playerDiv.alt = player.name;
    if (player.image == "") {
      playerDiv.src = "images/anonymous.png"
    } else {
      playerDiv.src = player.image;
    }
    var playerDetails = playerButton.querySelectorAll("li");
    playerDetails[0].innerText = player.name + " #" + player.number;
    playerDetails[1].innerText = player.position;
    playerDetails[2].innerText = "Goals: " + player.goals;
    document.getElementById('playerButtons').appendChild(playerButton);
  }
}

function uploadImage() {
  var playerForm = document.getElementById('playerimagefield');
  if (playerForm.files.length <= 0) {
    return;
  }
  var uploaded = "";
  image.readImageAndResize(playerForm.files[0], 300, function(result) {
    var playerImage = document.getElementById('playerbuttonimg');
    playerImage.src = result;
    imageSet = true;
  });
}

// creates function to send to individual player page. This is here because closures
function createToPlayerFunction(player) {
  return function() {
    mainState.setState("playerID", player.id);
    window.location='playerdetails.html';
  }
}

function validatePlayerForm() {
  var player = {
    name: "",
    position: "",
    image: "",
    number: 0,
    goals: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    shotsOnGoal: 0,
    cornerKicks: 0,
    penalties: 0,
    throwIns: 0,
    gamesPlayed: 0,
  };
  var incomplete = false;
  var playerForm = document.getElementById('addplayerform');
  player.name = playerForm.elements['playername'].value;
  player.number = playerForm.elements['playernumber'].value;
  player.position = playerForm.elements['playerposition'].value;
  if (imageSet) {
    player.image = document.getElementById('playerbuttonimg').src;
  }
  incomplete = player.name == "" || player.number == "" ||  player.position == "";
  var addplayer_error = document.getElementById('addplayer_error');
  if(incomplete){
    addplayer_error.innerText = "Please fill out all fields."
  }
  else{
    addplayer_error.innerText = ""
    var state = mainState.getState();
    firestoreDB.addNewPlayer(state.teamID, player)
      .catch(function(e) {
        console.log(e);
      })
      .then(function() {
        window.location='players.html';
      });

  }
}

function populatePlayerDetails() {
  var state = mainState.getState();
  firestoreDB.getTeamPlayer(state.teamID, state.playerID).then(function (playerData) {
    var player = playerData.data();
    var playerName = document.getElementById('playerName');
    playerName.innerText = player.name + " #" + player.number;
    var playerPosition = document.getElementById('playerPosition');
    playerPosition.innerText = player.position;
    var playerGoals = document.getElementById('playerGoals');
    playerGoals.innerText = "Goals: " + player.goals;
    var playerFouls = document.getElementById('playerFouls');
    playerFouls.innerText = "Fouls: " + player.fouls;
    var playerYellowCards = document.getElementById('playerYellowCards');
    playerYellowCards.innerText = "Yellow Cards: " + player.yellowCards;
    var playerRedCards = document.getElementById('playerRedCards');
    playerRedCards.innerText = "Red Cards: " + player.redCards;
    var playerShotsOnGoal = document.getElementById('playerShotsOnGoal');
    playerShotsOnGoal.innerText = "Shots on Goal: " + player.shotsOnGoal;
    var playerCornerKicks = document.getElementById('playerCornerKicks');
    playerCornerKicks.innerText = "Corner Kicks: " + player.cornerKicks;
    var playerPenaltyKicks = document.getElementById('playerPenaltyKicks');
    playerPenaltyKicks.innerText = "Penalty Kicks: " + player.penalties;
    var playerThrowIns = document.getElementById('playerThrowIns');
    playerThrowIns.innerText = "Throw ins: " + player.throwIns;
    var playerGamesPlayed = document.getElementById('playerGamesPlayed');
    playerGamesPlayed.innerText = "Games Played: " + player.gamesPlayed;
    var playerImage = document.getElementById('playerImage');
    if (player.image == "") {
      playerImage.src = "images/anonymous.png"
    } else {
      playerImage.src = player.image;

    }
  });
}


function deletePlayer() {
  var deleteButton = document.getElementById('deletePlayer');
  if (deleteState == 0) {
    deleteButton.value = "Press again to confirm";
    deleteState = 1;
    setTimeout(function() {
      deleteState = 0;
      deleteButton.value = "Delete Player";
    }, 1000);
  } else {
    var state = mainState.getState();
    var player = state.player;
    player.deleted = true;
    firestoreDB.updatePlayer(state.teamID, state.playerID, player).then(function() {
      window.location='players.html';
    });
  }
}

function populateEditPlayer() {
  var state = mainState.getState();
  firestoreDB.getTeamPlayer(state.teamID, state.playerID).then(function (playerData) {
    var player = playerData.data();
    mainState.setState('player', player);
    var playerForm = document.getElementById('editplayerform');
    playerForm.elements['playername'].value = player.name;
    playerForm.elements['playernumber'].value = player.number;
    playerForm.elements['playerposition'].value = player.position;
    if (player.image != "") {
      document.getElementById('playerimg').src = player.image;
    }
  });
}

function validatePlayerEditForm() {
  var state = mainState.getState();
  var player = state.player;
  var incomplete = false;
  var playerForm = document.getElementById('editplayerform');
  player.name = playerForm.elements['playername'].value;
  player.number = playerForm.elements['playernumber'].value;
  player.position = playerForm.elements['playerposition'].value;
  if (imageSet) {
    player.image = document.getElementById('playerimg').src;
  }
  incomplete = player.name == "" || player.number == "" ||  player.position == "";
  var addplayer_error = document.getElementById('addplayer_error');
  if(incomplete){
    addplayer_error.innerText = "Please fill out all fields."
  }
  else{
    addplayer_error.innerText = "";
    firestoreDB.updatePlayer(state.teamID, state.playerID, player)
      .then(function() {
      window.location='players.html';
      })
      .catch(function(e) {
        console.log(e);
      });
  }
}

function uploadEditImage() {
  var playerForm = document.getElementById('playerimagefield');
  if (playerForm.files.length <= 0) {
    return;
  }
  image.readImageAndResize(playerForm.files[0], 300, function(result) {
    var playerImage = document.getElementById('playerimg');
    playerImage.src = result;
    imageSet = true;
  });
}
