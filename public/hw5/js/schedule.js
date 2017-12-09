schedule = {};
schedule.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
schedule.months_long = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
schedule.parseDateAndTime = parseDateAndTime;

function parseDateAndTime(datestr, timestr){
  var datearry = datestr.split("-");
  var timearry = timestr.split(":");
  return new Date(datearry[0], datearry[1], datearry[2], timearry[0], timearry[1], 0, 0);
}

function validateGameForm(form, action){
  var incomplete = false;
  var game = {
    opponent:"",
    location: "",
    date: "",
    time: "",
    stats: [],
    active: true
  }

  game.opponent = form.elements['gameopponent'].value;
  incomplete = game.opponent == "Choose Opponent" || game.opponent == "";
  game.location = form.elements['gamelocation'].value;
  incomplete = incomplete || game.location == "";
  game.date = form.elements['gamedate'].value;
  incomplete = incomplete ||  game.date == "";
  game.time = form.elements['gametime'].value;
  incomplete = incomplete || game.time == "";

  var error_msg = (action == "add") ? 'addgamemsg' : 'editgamemsg';
  console.log(error_msg);
  if(incomplete){
    displayMessage(error_msg, "error", "Please fill out all fields");
    //error_msg.style.display = 'block';
  }
  else{
    //hideMessage(error_msg);
    //error_msg.style.display = 'none';
    if(action == "add"){
      game.active = true;
    }
    else if(action == "edit"){
      var state = mainState.getState();
      var teamID = state.teamID
    }
    updateGame(game, action);
  }
}

function updateGame(game, action){
  var state = mainState.getState();
  var teamID = state.teamID;
  var gameID = state.gameID


  var exists = false;
  if(exists){
    var duplicate_msg = action == "add" ? document.getElementById('addgame_duplicate') : document.getElementById('editgame_duplicate');
    duplicate_msg.style.display = 'block';
  }
  else{
    var returnTo="";
    if(action == "edit"){
      firestoreDB.updateGame(teamID, gameID, game).then(function(){
        window.location='gamedetails.html';
      });
    }
    else if(action == "add"){
      firestoreDB.addNewGame(teamID, game).then(function(){
        window.location='schedule.html';

      });
    }
  }
}

function loadSchedule(){
  var state = mainState.getState();
  firestoreDB.getTeamGames(state.teamID).then(function(games){
    var emptyschedule = document.getElementById('emptyschedule');
    if(!games){
      emptyschedule.style.display = 'block';
    }
    else{
      emptyschedule.style.display = 'none';

      var values = []
      games.forEach(function(game){

        values.push({

          id: game.id,
          ...game.data()
        })
      });


      values.sort(function(a,b){
          return new Date(a.date) - new Date(b.date);
      });

      for (var i = 0 ; i < values.length; i++){
        if(values[i].active){
          mainState.setState('gameID', values[i].id)
          let btn = createGameButtonDetail(values[i]);
          document.getElementById('schedulecontainer').appendChild(btn);
        }
      }
    }
  });
}

function populateOpponentSelect(selectcontainer){
  var teamID = mainState.getState().teamID;
  firestoreDB.getAllOpponents(teamID).then(function(snapshot) {
    snapshot.forEach(function(opponent) {
      var opt = document.createElement("option");
      opt.value = opponent.id;
      opt.text = opponent.data().name;
      document.getElementById(selectcontainer).appendChild(opt);
    });
  });
}

function loadAddForm(){
  populateOpponentSelect('addgameopponent');
}

//preload the edit form
function loadEditForm(){

  var state = mainState.getState();
  var gameID = state.gameID;
  var teamID = state.teamID;

  populateOpponentSelect('editgameopponent');

  var gameopponent = document.getElementById('editgameopponent');
  var gamelocation = document.getElementById('editgamelocation');
  var gamedate = document.getElementById('editgamedate');
  var gametime = document.getElementById('editgametime');

  firestoreDB.getTeamGame(teamID, gameID).then(function(game){

    setSelectedIndex(gameopponent, game.data().opponent);
    gamelocation.value = game.data().location;
    gamedate.value = game.data().date;
    gametime.value = game.data().time;
    loadOpponentImage('editgameopponent', 'editgameopimg');
  });

}

function setSelectedIndex(s, v) {
  for ( var i = 0; i < s.options.length; i++ ) {
    if ( s.options[i].value == v ) {
      s.options[i].selected = true;
      return;
    }
  }
}
