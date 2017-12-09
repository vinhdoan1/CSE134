
//loads the homePage with some data
function loadDashboard(){
  var state = mainState.getState();

  //get the team to diplay on the dashboard from db
  firestoreDB.getTeam(state.teamID).then(function (teamData){
    var team = teamData.data();
    document.getElementById("h1").innerHTML = team.name;
    document.getElementById("wins").innerHTML += "5";
    document.getElementById("loss").innerHTML += "0";
    document.getElementById("goalsfor").innerHTML += "14";
    document.getElementById("goalsagainst").innerHTML += "4";
    document.getElementById("teamimglogo").src = team.logo;
  });
}

//getting the next game to be displayed
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

//when gets called redirects user to game details page
function funToGameDetails(gameID){
  return function() {
    mainState.setState("gameID", gameID);
    window.location='gamedetails.html';
  }
}

//this is used to create buttons that display the game snapshot on schedule page
function createGameButtonDetail(game){

  let state = mainState.getState();
  teamID = state.teamID;

  //get the opponent to be displayed on the schedule button
  let opponent = firestoreDB.getOpponent(teamID, game.opponent).then(function(opp){

    //Parse the date and time and create the button with the attributes
    var date = parseDateAndTime(game.date, game.time);
    var hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
    var ampm = date.getHours() >= 12 ? "PM" : "AM";
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "gamebutton");
    btn.onclick = funToGameDetails(game.id);
    btn.innerHTML = "<p class='gamebuttondetail'>" +
    date.getMonth() < 11 ? schedule.months[date.getMonth()-1] : schedule.months[date.getMonth() + 11]
    + " " + date.getDate() + ", " + date.getFullYear() + " @ " +  hours + ":" + (date.getMinutes() <10 ?'0':'') + date.getMinutes() + ampm + " - Pigs vs. " + opp.data().name + "</p>";

    //append the button to the element of html
    document.getElementById('schedulecontainer').appendChild(btn);
  });

}

//load the add event page
function loadAddEventPage(){
  document.getElementById('emptyeventfeed').style.fontSize="0rem";
  //show admin stuffs
  if(mainState.getState().admin){
    document.getElementById('addeventcontainer').style.display = 'block';
  }
  loadStats();
}

//load the stats of the game by getting from the db
loadStats = () => {
  const state = mainState.getState()
  let teamID = state.teamID
  let gameID = state.gameID

  //this is added dynamically when new stat is added
  let divSection = document.getElementById("dynamicevents");
  let datalist = document.getElementById("playernames");

  //get the players from the db for the dropdown menu
  firestoreDB.getTeamPlayers(teamID).then(function(players){

    players.forEach(function(player){

      if(!player.data().deleted){
        var option = document.createElement("option");
        option.value = player.data().name;
        datalist.appendChild(option)
      }
    });
  });

  firestoreDB.getTeamGame(teamID, gameID).then(function(game){

    firestoreDB.getOpponent(teamID, game.data().opponent).then(function(opp){

      var option = document.createElement("option");
      option.value = "Opponent " + opp.data().name;
      datalist.appendChild(option)
    });
  });

  var numEvents = 0;

  //get the stats from the db to be displayed as a button on the page
  firestoreDB.getStats(teamID,gameID).then(function(stats){

    stats.forEach(function(stat){

      //create the button and append to the html element
      let btn = document.createElement("button")
      btn.setAttribute("type", "button")
      btn.setAttribute("class", "eventfeedbutton")
      btn.innerHTML = "<span>" + stat.data().stat + "</span>"
      divSection.appendChild(btn)
      numEvents++;
    });
    if(numEvents == 0){
      document.getElementById('emptyeventfeed').style.fontSize="1rem";
    }
    else{
      document.getElementById('emptyeventfeed').style.fontSize="0rem";
    }
  });
}

//adding stats to the db when created
addStat = () => {

  let stat
  const state = mainState.getState()
  let teamID = state.teamID
  let gameID = state.gameID
  let type = document.getElementById("selectStat").value
  let player = document.getElementById("eventplayername").value


  //check what type of stat it is
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

  //reset the add event form
  document.getElementById('addeventform').reset();

  firestoreDB.setStat(teamID, gameID, stat).then(function(){
    window.location='addevent.html';

  });

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
