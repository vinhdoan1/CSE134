var mockPlayers = [
  {
    name: "Jeff Evans",
    position: "Forward",
    number: 10,
    goals: 10,
    yelllowCards: 0,
    redCards: 0,
    shotsOnGoal: 0,
    cornerKicks: 0,
    penalties: 0,
    throwIns: 0,
    gamesPlayed: 0,
  },
  {
    name: "John Doe",
    position: "Goalie",
    number: 2,
    goals: 0,
    yelllowCards: 0,
    redCards: 0,
    shotsOnGoal: 0,
    cornerKicks: 0,
    penalties: 0,
    throwIns: 0,
    gamesPlayed: 0,
  },
  {
    name: "Joe Shmoe",
    position: "Defender",
    number: 24,
    goals: 3,
    yelllowCards: 0,
    redCards: 0,
    shotsOnGoal: 0,
    cornerKicks: 0,
    penalties: 0,
    throwIns: 0,
    gamesPlayed: 0,
  }
]

var deleteState = 0; // for delete player confirmation

// load players and display to screen
function loadPlayers() {
  var state = mainState.getState();
  var players = api.getTeamPlayers(state.teamID);
  players = players.filter(function(player) {
    return !player.deleted;
  })
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var playerTemplate = document.getElementById('playerButtonTemplate').cloneNode(true);
    var playerButton = playerTemplate.content;
    var playerDiv = playerButton.querySelector("div");
    playerDiv.onclick = createToPlayerFunction(player);
    var playerDiv = playerButton.querySelector("img");
    playerDiv.alt = player.name;
    //playerDiv.src = player.image;
    var playerDetails = playerButton.querySelectorAll("li");
    playerDetails[0].innerText = player.name + " #" + player.number;
    playerDetails[1].innerText = player.position;
    playerDetails[2].innerText = "Goals: " + player.goals;
    document.getElementById('playerButtons').appendChild(playerButton);
  }
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
    id: api.generateID(),
    name: "",
    position: "",
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
  incomplete = player.name == "" || player.number == "" ||  player.position == "";
  var addplayer_error = document.getElementById('addplayer_error');
  if(incomplete){
    addplayer_error.style.display = 'block';
  }
  else{
    addplayer_error.style.display = 'none';
    addPlayer(player);
  }
}

function addPlayer(player) {
  var state = mainState.getState();
  var players = api.getTeamPlayers(state.teamID);
  players.push(player);
  api.setTeamPlayers(state.teamID, players);
  window.location='players.html';
}

function populatePlayerDetails() {
  var state = mainState.getState();
  var player = api.getTeamPlayer(state.teamID, state.playerID);
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
    var player = api.getTeamPlayer(state.teamID, state.playerID);
    player.deleted = true;
    api.setTeamPlayer(state.teamID, state.playerID, player);
    window.location='players.html';
  }
}

function populateEditPlayer() {
  var state = mainState.getState();
  var player = api.getTeamPlayer(state.teamID, state.playerID);
  var playerForm = document.getElementById('editplayerform');
  playerForm.elements['playername'].value = player.name;
  playerForm.elements['playernumber'].value = player.number;
  playerForm.elements['playerposition'].value = player.position;
}

function validatePlayerEditForm() {
  var state = mainState.getState();
  var player = api.getTeamPlayer(state.teamID, state.playerID);
  var incomplete = false;
  var playerForm = document.getElementById('editplayerform');
  player.name = playerForm.elements['playername'].value;
  player.number = playerForm.elements['playernumber'].value;
  player.position = playerForm.elements['playerposition'].value;
  incomplete = player.name == "" || player.number == "" ||  player.position == "";
  var addplayer_error = document.getElementById('addplayer_error');
  if(incomplete){
    addplayer_error.style.display = 'block';
  }
  else{
    addplayer_error.style.display = 'none';
    api.setTeamPlayer(state.teamID, state.playerID, player);
    window.location='players.html';
  }
}
