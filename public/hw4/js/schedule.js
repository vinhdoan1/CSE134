months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

function validateAddGameForm(form){
  var incomplete = false; 
  var game = {
    gameid: api.generateID(),
    opponent: "",
    location: "",
    date: "",
    time: ""
  }
  game.opponent = form.elements['gameopponent'].value;
  incomplete = game.opponent == "Choose Opponent" || game.opponent == "";
  game.location = form.elements['gamelocation'].value;
  incomplete = incomplete || game.location == "";
  game.date = form.elements['gamedate'].value;
  incomplete = incomplete ||  game.date == "";
  game.time = form.elements['gametime'].value;
  incomplete = incomplete || game.time == "";
  var addgame_error = document.getElementById('addgame_error');
  if(incomplete){
    addgame_error.style.display = 'block';
  }
  else{
    addgame_error.style.display = 'none';
    addGame(game);
  }
}

function addGame(game){
  //create or retrieve the game schedule
  var state = mainState.getState();
  var gamesList = api.getTeamGames(state.teamID);
  if(gamesList == null){
    gamesList = {};
  }

  var exists = gamesList.some(function (other) {
    return other.opponent == game.opponent && other.location == game.location &&
      other.date == game.date && other.time == game.time;
  });

  if(exists){
    var addgame_duplicate = document.getElementById('addgame_duplicate');
    addgame_duplicate.style.display = 'block';
  }
  else{
    gamesList.push(game);
    gamesList.sort(function(a,b){
      return new Date(a.date) - new Date(b.date);
    });
    // localStorage.setItem("schedule", JSON.stringify(scheduleList));
    api.setTeamGames(state.teamID, gamesList);
    window.location='schedule.html';
    console.log(scheduleList);  
  }
}

function parseDateAndTime(datestr, timestr){
  var datearry = datestr.split("-");
  var timearry = timestr.split(":");
  return new Date(datearry[0], datearry[1], datearry[2], timearry[0], timearry[1], 0, 0);
}

function createGameButtonDetail(game){
  var date = parseDateAndTime(game.date, game.time);
  var hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12; 
  var ampm = date.getHours() >= 12 ? "PM" : "AM";
  let btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("class", "gamebutton");
  btn.setAttribute("onclick", "window.location='gamedetails.html';");
  btn.innerHTML = "<p class='gamebuttondetail'>" + months[date.getMonth()-1] + " " + date.getDate() + ", " + date.getFullYear() + " @ " +  hours + ":" + (date.getMinutes() <10 ?'0':'') + date.getMinutes() + ampm + " - Pigs vs. " + game.opponent + "</p>";
  return btn;
}

function loadSchedule(){
  var state = mainState.getState();
  var gamesList= api.getTeamGa
  var emptyschedule = document.getElementById('emptyschedule');
  if(scheduleList == null){
    emptyschedule.style.display = 'block';
  }
  else{
    emptyschedule.style.display = 'none';
    for(var i = 0; i < scheduleList.length; i++){
      var game = scheduleList[i];
      let btn = createGameButtonDetail(game);
      document.getElementById('schedulecontainer').appendChild(btn);
    }
  }
}

function loadDashboard(){
  getUpcomingGame();
}

function getUpcomingGame(){
  var scheduleList = JSON.parse(localStorage.getItem("schedule"));
  if(scheduleList == null){

  }
  else{
    var game = scheduleList[0];
    let btn = createGameButtonDetail(game);
    document.getElementById('upcominggamecontainer').appendChild(btn);
  }
}

