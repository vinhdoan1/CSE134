var imageSet = false;

//Mocked login function with hardcoded passwords
function authenticate(form) {
  var username = form.username.value;
  var password = form.password.value;
  var user = api.authenticateUser(username, password);
  var login_error = document.getElementById('login_error');
  if (user){
    mainState.setState("loggedIn", true);
    mainState.setState("teamID", user.id);
    login_error.style.display = 'none';
    window.location='team.html';
  }
  else{
    login_error.style.display = 'block';
  }
}

function uploadLogo() {
  var logoForm = document.getElementById('logoupload');
  if (logoForm.files.length <= 0) {
    return;
  }
  image.readImageAndResize(logoForm.files[0], 300, function(result) {
    var playerImage = document.getElementById('teamlogoimg');
    playerImage.style.visibility = "visible";
    playerImage.src = result;
    imageSet = true;
  }, true);
}

function createTeam() {
  var incomplete = false;
  var teamForm = document.getElementById('signupform');
  var name = document.getElementById('teaminput').value;
  var email = teamForm.elements['teamEmail'].value;
  var username = teamForm.elements['teamUser'].value;
  var pass1 = teamForm.elements['teamPass1'].value;
  var pass2 = teamForm.elements['teamPass2'].value;
  var picture = document.getElementById('teamlogoimg').src
  incomplete = name == "" || email == "" ||  username == "" || pass1 == "" || pass2 == "" || !imageSet;
  var addteam_error = document.getElementById('addteam_error');
  var accountexists_error = document.getElementById('accountexists_error');
  var password_error = document.getElementById('password_error');
  if(incomplete){
    addteam_error.style.display = 'block';
    accountexists_error.display = 'none';
    password_error.style.display = 'none';
  } else if (api.userExists(username)){
    addteam_error.style.display = 'none';
    accountexists_error.display = 'block';
    password_error.style.display = 'none';
  }
  else if (pass1 != pass2) {
    addteam_error.style.display = 'none';
    accountexists_error.display = 'none';
    password_error.style.display = 'block';
  } else{
    addteam_error.style.display = 'none';
    accountexists_error.display = 'none';
    password_error.style.display = 'none';
    var userID = api.addUser(username, pass1, email);
    api.addTeam(userID, name, picture);
    mainState.setState("loggedIn", true);
    mainState.setState("teamID", userID);
    window.location='team.html';
  }
}
