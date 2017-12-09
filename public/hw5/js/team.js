function loadDashboard(){
  var state = mainState.getState();
  firestoreDB.getTeam(state.teamID).then(function (teamData){
    var team = teamData.data();
    //getUpcomingGame(); commented out for now
    document.getElementById("h1").innerHTML = team.name;
    document.getElementById("wins").innerHTML += "5";
    document.getElementById("loss").innerHTML += "0";
    document.getElementById("goalsfor").innerHTML += "14";
    document.getElementById("goalsagainst").innerHTML += "4";
    document.getElementById("teamimglogo").src = team.logo;
  });
}

function getUpcomingGame(){
  var state = mainState.getState();
  var gamesList = api.getTeamGames(state.teamID);
  var nextGame = gamesList.find(function(game){
    game.active == true;
  });
  if(nextGame){
    let btn = createGameButtonDetail(game);
    document.getElementById('upcominggamecontainer').appendChild(btn);
  }
}

function funToGameDetails(gameID){
  return function() {
    mainState.setState("gameID", gameID);
    window.location='gamedetails.html';
  }
}

function createGameButtonDetail(game){
  var date = parseDateAndTime(game.date, game.time);
  var hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
  var ampm = date.getHours() >= 12 ? "PM" : "AM";
  let btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("class", "gamebutton");
  // btn.setAttribute("onclick", "window.location='gamedetails.html';");
  btn.onclick = funToGameDetails(game.id);
  btn.innerHTML = "<p class='gamebuttondetail'>" +
  date.getMonth() < 11 ? schedule.months[date.getMonth()-1] : schedule.months[date.getMonth() + 11]
  + " " + date.getDate() + ", " + date.getFullYear() + " @ " +  hours + ":" + (date.getMinutes() <10 ?'0':'') + date.getMinutes() + ampm + " - Pigs vs. " + game.opponent + "</p>";
  return btn;
}

loadStats = () => {
  const state = mainState.getState()
  let teamID = state.teamID
  let gameID = state.gameID
  let divSection = document.getElementById("dynamicevents")
  let stats = firedatabase.getStats(teamID, gameID).then(function(stats){

    return stats.val()

  });

  let datalist = document.getElementById("playernames");
  firedatabase.getTeamPlayers(teamID).then(function(player){

    values = Object.values(player.val())
    for (var i = 0; i < values.length; i++){

      var option = document.createElement("option");
      option.value = values[i].name;
      datalist.appendChild(option)
    }
  });


  stats.then(function(stat){
    var keys = Object.keys(stat)
    var values = Object.values(stat)

    for (var i = 0; i < values.length; i++){

      let btn = document.createElement("button")
      btn.setAttribute("type", "button")
      btn.setAttribute("class", "eventfeedbutton")
      btn.innerHTML = "<span>" + values[i] + "</span>"
      divSection.appendChild(btn)
    }
  });
}

addStat = () => {

  let stat
  const state = mainState.getState()
  let teamID = state.teamID
  let gameID = state.gameID
  let type = document.getElementById("selectStat").value
  let player = document.getElementById("eventplayername").value


  if (player === "" || type === "Choose Event" || type === ""){

    return false
  }
  else if (type === 'cornerkick' || type === 'shotongoal'){

    stat = player + " took a " + type
  }
  else if (type === 'yellowcard' || type === 'redcard') {

    stat = player + " received a " + type
  }
  else if (type === 'goal'){

    stat = player + " scored a " + type
  }
  else {

    stat = player + " made a " + type
  }

  document.getElementById('addeventform').reset();

  firedatabase.setStat(teamID, gameID, stat);
  window.location = "addevent.html"

}

function getOpTeamLogo(teamname){
  var state = mainState.getState();
  var teamID = state.teamID;
  var opponents = api.getOpponents(teamID);
  var opponent = opponents.find(function(team){
    return teamname == team.name;
  });
  return opponent.logo;
}
