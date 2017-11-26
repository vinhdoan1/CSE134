//Mocked login function with hardcoded passwords
function authenticate(form) {
  var username = form.username.value;
  var password = form.password.value;
  var user = api.authenticateUser(username, password);
  if (user){
    mainState.setState({
      loggedIn: true,
      teamID: user.id,
    })
    login_error.style.display = 'none';
    window.location='team.html';
  }
  else{
    var login_error = document.getElementById('login_error');
    login_error.style.display = 'block';
  }
}

function createTeam() {
  var incomplete = false;
  var teamForm = document.getElementById('signupform');
  var name = document.getElementById('teaminput').value;
  var email = teamForm.elements['teamEmail'].value;
  var username = teamForm.elements['teamUser'].value;
  var pass1 = teamForm.elements['teamPass1'].value;
  var pass2 = teamForm.elements['teamPass2'].value;
  incomplete = name == "" || email == "" ||  username == "" || pass1 == "" || pass2 == "";
  var addplayer_error = document.getElementById('addplayer_error');
  if(incomplete){
    addplayer_error.style.display = 'block';
    password_error.style.display = 'none';
  } else if (pass1 != pass2) {
    addplayer_error.style.display = 'none';
    password_error.style.display = 'block';
  }
  else{
    addplayer_error.style.display = 'none';
    password_error.style.display = 'none';
    var userID = api.addUser(username, pass1, email);
    api.addTeam(userID, name, "");
    mainState.setState({
      loggedIn: true,
      teamID: userID,
    })
    window.location='team.html';
  }
}
