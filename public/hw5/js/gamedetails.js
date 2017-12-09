function populateGameDetails(){
  loadGameDetails();
}

function loadGameDetails(){
  var gameID = mainState.getState().gameID;
  var teamID = mainState.getState().teamID;
  firestoreDB.getTeamGame(teamID, gameID).then(function(gameData) {
    var game = gameData.data();
    var date = schedule.parseDateAndTime(game.date, game.time);
    var hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
    var ampm = date.getHours() >= 12 ? "PM" : "AM";

    var gamedetails_date = document.getElementById('gamedetails_date');
    gamedetails_date.innerHTML = schedule.months_long[date.getMonth()-1] + " " + date.getDate() + ", " + date.getFullYear();
    var gamedetails_time = document.getElementById('gamedetails_time');
    gamedetails_time.innerHTML = hours + ":" + (date.getMinutes() <10 ?'0':'') + date.getMinutes() + ampm;
    var gamedetails_location = document.getElementById('gamedetails_location');
    gamedetails_location.innerHTML = game.location;
    firestoreDB.getOpponent(teamID, game.opponent).then(function(opponentData) {
      var opponent = opponentData.data();
      var otherTeam = document.getElementById('secondteam');
      otherTeam.innerHTML = opponent.name;
      var otherTeamLogo = document.getElementById('teamimgdetailsecond');
      otherTeamLogo.src = opponent.logo;
    });
  });
  firestoreDB.getTeam(teamID).then(function(teamData) {
    var team = teamData.data();
    var myTeam = document.getElementById('firstteam');
    myTeam.innerText = team.name;
    var myTeamLogo = document.getElementById('teamimgdetailfirst');
    myTeamLogo.src = team.logo;
  });
  firestoreDB.getStats(teamID, gameID).then(function(statsData) {
    var goals = 0;
    var shotsOnGoal = 0;
    var cornerKicks = 0;
    var penalties = 0;
    statsData.forEach(function(doc) {
      var stat = doc.data()['stat'];
      if (stat.includes("goal"))
        goals++;
      else if (stat.includes("shotongoal"))
        shotsOnGoal++;
      else if (stat.includes("cornerkick"))
        cornerKicks++;
      else if (stat.includes("penalties"))
        penalties++;
    });
    var gamesdetails_goals = document.getElementById('gamesdetails_goals');
    gamesdetails_goals.innerHTML = goals;
    var gamesdetails_shotsongoals = document.getElementById('gamesdetails_shotsongoals');
    gamesdetails_shotsongoals.innerHTML = shotsOnGoal;
    var gamesdetails_cornerkicks = document.getElementById('gamesdetails_cornerkicks');
    gamesdetails_cornerkicks.innerHTML = cornerKicks;
    var gamesdetails_penalties = document.getElementById('gamesdetails_penalties');
    gamesdetails_penalties.innerHTML = penalties;
  });
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
