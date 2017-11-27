function populateGameDetails(){
  loadGameDetails();
  loadGameStats();
}

function loadGameDetails(){
  var gameID = mainState.getState().gameID;
  var teamID = mainState.getState().teamID;
  var game = getTeamGame(teamID, gameID);
  var myTeamName = getTeamName(teamID);
  var date = schedule.parseDateAndTime(game.date, game.time);
  var hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12; 
  var ampm = date.getHours() >= 12 ? "PM" : "AM";

  var gamedetails_date = document.getElementById('gamedetails_date');
  gamedetails_date.innerHTML = schedule.months_long[date.getMonth()-1] + " " + date.getDate() + ", " + date.getFullYear();
  var gamedetails_time = document.getElementById('gamedetails_time');
  gamedetails_time.innerHTML = hours + ":" + (date.getMinutes() <10 ?'0':'') + date.getMinutes() + ampm;
  var gamedetails_location = document.getElementById('gamedetails_location');
  gamedetails_location.innerHTML = game.location;
  var myTeam = document.getElementById('firstteam');
  myTeam.innerHTML = myTeamName;
  var otherTeam = document.getElementById('secondteam');
  otherTeam.innerHTML = game.opponent;

  var myTeamLogo = document.getElementById('teamimgdetailfirst');
  var otherTeamLogo = document.getElementById('teamimgdetailsecond');
  var myTeamLogoImg = api.getTeam(teamID).logo;
  var otherTeamLogoImg = getOpTeamLogo(game.opponent);
  myTeamName.src = myTeamLogoImg;
  otherTeamLogo.src = otherTeamLogoImg;
}

function loadOpponentImage(selectid, logoid){
  var op = document.getElementById(selectid);
  var opname = op.value;
  var state = mainState.getState();
  var teamID = state.teamID;
  var opponents = api.getOpponents(teamID);
  var opponent = opponents.find(function(opteam){
    return opname == opteam.name;
  });

  var logo = document.getElementById(logoid);
  logo.src = opponent.logo;
  logo.style.height = "5 rem";
}

function loadGameStats(){
  //get game stats when thats done 
}

var deleteState = 0; // for delete game confirmation
function deleteGame(){
  var deleteButton = document.getElementById('gamedetails_delete');
  if (deleteState == 0) {
    deleteButton.value = "Press again to confirm";
    deleteState = 1;
    setTimeout(function() {
      deleteState = 0;
      deleteButton.value = "Delete Game";
    }, 1000);
  } 
  else {
    var state = mainState.getState();
    var teamID = state.teamID;
    var gameID = state.gameID;
    var currGame = getTeamGame(teamID, gameID);
    var games = api.getTeamGames(teamID);
    currGame.active = false;
    api.setTeamGame(teamID, gameID, currGame);
    window.location = 'schedule.html';
    console.log("DELETED")
  }

}