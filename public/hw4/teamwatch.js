//Mocked login function with hardcoded passwords
function authenticate(form) {
  if(form.username.value == "user" && form.password.value == "pass"){
    window.location='team.html';
  }
  else{
    var login_error = document.getElementById('login_error');
    login_error.style.display = 'block';
  }
  console.log("helloworld");
}

//Schedule
function validateAddGameForm(form){
  var game = new Object();
  var incomplete = false; 
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
  //create or retrieve the schedule
  var scheduleList = JSON.parse(localStorage.getItem("schedule"));
  if(scheduleList == null){
    scheduleList = new Array();
  }

  var exists = scheduleList.some(function (other) {
    return other.opponent == game.opponent && other.location == game.location &&
      other.date == game.date && other.time == game.time;
  });

  if(exists){
    var addgame_duplicate = document.getElementById('addgame_duplicate');
    addgame_duplicate.style.display = 'block';
  }
  else{
    scheduleList.push(game);
    localStorage.setItem("schedule", JSON.stringify(scheduleList));
    window.location='schedule.html';
    console.log(scheduleList);  
  }
}

function displaySchedule(){
  var scheduleList = JSON.parse(localStorage.getItem("schedule"));
  if(scheduleList == null){
    //There are currently no games scheduled
  }
  else{
    for(var i = 0; i < scheduleList.length; i++){
      var game = scheduleList[i];
      var date = new Date(game.date);
      var time = game.time.split(":");
      var ampm = time[0] >= 12 ? "PM" : "AM";
      let btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.setAttribute("class", "gamebutton");
      btn.setAttribute("onclick", "window.location='gamedetails.html';");
      btn.innerHTML = "<p class='gamebuttondetail'>" + date.getMonth() + "/" + date.getDate() + " @ " +  time[0] + ":" + time[1] + ampm + " - Pigs vs. " + game.opponent + "</p>";
      document.getElementById('schedulecontainer').appendChild(btn);
      console.log(game)
    }
  }
}