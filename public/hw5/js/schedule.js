schedule = {};
schedule.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
schedule.months_long = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
schedule.parseDateAndTime = parseDateAndTime;

//parser for the date and time entries
function parseDateAndTime(datestr, timestr){
  var datearry = datestr.split("-");
  var timearry = timestr.split(":");
  console.log(datearry);
  return new Date(datearry[0], datearry[1]-1, datearry[2], timearry[0], timearry[1], 0, 0);
}

function validateGameForm(form, action){

  //sanity check for validgame form
  var incomplete = false;

  //game form to be addded to the database
  var game = {
    opponent:"",
    location: "",
    date: "",
    time: "",
    active: true
  }

  //checking the form for validations
  game.opponent = form.elements['gameopponent'].value;
  incomplete = game.opponent == "Choose Opponent" || game.opponent == "";
  game.location = form.elements['gamelocation'].value;
  incomplete = incomplete || game.location == "";
  game.date = form.elements['gamedate'].value;
  incomplete = incomplete ||  game.date == "";
  game.time = form.elements['gametime'].value;
  incomplete = incomplete || game.time == "";

  var error_msg = (action == "add") ? 'addgamemsg' : 'editgamemsg';
  if(incomplete){
    displayMessage(error_msg, "error", "Please fill out all fields");
  }
  else{

    //check for adding or editing game
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

function updateUpcomingGame(){
  var state = mainState.getState();
  firestoreDB.getTeamGames(state.teamID).then(function(games){
    if(!games){
    }
    else{
      var values = []
      games.forEach(function(game){
        values.push({
          id: game.id,
          ...game.data()
        });
      });

      values.sort(function(a,b){
          return new Date(a.date) - new Date(b.date);
      });

      var j = 0;
      while(!values[j].active){
        j++;
      }
      if(values[j].active){
        mainState.setState("upcomingGame", values[j].id);
      } else{
        mainState.setState("upcomingGame", "hello");
      }
    }
  });
}

//update the game by calling firebase
function updateGame(game, action){
  var state = mainState.getState();
  var teamID = state.teamID;
  var gameID = state.gameID

  //check for different action add or edit a game
  if(action == "edit"){

    //call to CRUD for editing the game
    firestoreDB.updateGame(teamID, gameID, game).then(function(){
      window.location='gamedetails.html';
    });
  }
  else if(action == "add"){

    //call to CRUD for adding a new game
    firestoreDB.addNewGame(teamID, game).then(function(){
      window.location='schedule.html';

    });
  }
  updateUpcomingGame();
}

function loadSchedulePage(){
  if(mainState.getState().admin){
    document.getElementById('addgamebutton').style.display = 'initial';
  }
  loadSchedule();
}

function loadSchedule(){
  emptyschedule.style.fontSize="0rem";
  var state = mainState.getState();
  var gamesCount= 0;
  firestoreDB.getTeamGames(state.teamID).then(function(games){
    var emptyschedule = document.getElementById('emptyschedule');
    if(!games){
    }
    else{
      var values = []
      //go through all games and get the data for displaying
      games.forEach(function(game){
        values.push({
          id: game.id,
          ...game.data()
        });
      });

      //sort the schedule of the game by date of occurance
      values.sort(function(a,b){
          return new Date(a.date) - new Date(b.date);
      });

      //traverse the schedule objects and create a button for display
      for (var i = 0 ; i < values.length; i++){
        if(values[i].active){
          console.log(values[i]);
          mainState.setState('gameID', values[i].id);
          createGameButtonDetail(values[i], 'schedulecontainer');
          // document.getElementById('schedulecontainer').appendChild(btn);
          gamesCount++;
        }
      }
      // console.log(gamesCount);
      if(gamesCount == 0){
        emptyschedule.style.fontSize="1rem";
      }
      else{
        emptyschedule.style.fontSize="0rem";
      }
    }
  });
}

//populates the list of opponnets to be displayed in the drop downs
function populateOpponentSelect(selectcontainer){
  var teamID = mainState.getState().teamID;

  //get the list of opponents from db
  firestoreDB.getAllOpponents(teamID).then(function(snapshot) {
    snapshot.forEach(function(opponent) {
      var opt = document.createElement("option");
      opt.value = opponent.id;
      opt.text = opponent.data().name;
      document.getElementById(selectcontainer).appendChild(opt);
    });
  });
}

//load the add game form
function loadAddForm(){
  populateOpponentSelect('addgameopponent');
}

//preload the edit form
function loadEditForm(){

  var state = mainState.getState();
  var gameID = state.gameID;
  var teamID = state.teamID;

  //get the opponents list in the dropdown
  populateOpponentSelect('editgameopponent');

  var gameopponent = document.getElementById('editgameopponent');
  var gamelocation = document.getElementById('editgamelocation');
  var gamedate = document.getElementById('editgamedate');
  var gametime = document.getElementById('editgametime');

  //get the game that should be updated and display as a form
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
