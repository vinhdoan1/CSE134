//Mocked login function with hardcoded passwords
function authenticate(form) {
  var username = form.username.value;
  var password = form.password.value;
  //var dummyemail = username + "@teamwatch.com";
  //Firebase auth
  firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode) {
      login_error.style.display = 'block';
    }
  })
  .then(function(user) {
    if (user) {
      firestoreDB.getUser(user.uid).then(function(user) {
        mainState.setState("teamID", user.data().team);
        mainState.setState("admin", user.data().admin);
        window.location='team.html';
      });
    }
  });
}

function logout(){
  mainState.setState('loggedIn', false);
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
  window.location='login.html';
}

// function uploadLogo(imagefilenameid, teamlogoimgid) {
//   var logoForm = document.getElementById(imagefilenameid);
//   if (logoForm.files.length <= 0) {
//     return;
//   }
//   image.readImageAndResize(logoForm.files[0], 300, function(result) {
//     var playerImage = document.getElementById(teamlogoimgid);
//     playerImage.style.visibility = "visible";
//     playerImage.src = result;
//     imageSet = true;
//   }, true);
// }

function createTeam() {
  var incomplete = false;
  var teamForm = document.getElementById('signupform');
  var name = document.getElementById('teaminput').value;
  var email = teamForm.elements['teamEmail'].value;
  var pass1 = teamForm.elements['teamPass1'].value;
  var pass2 = teamForm.elements['teamPass2'].value;
  var picture = document.getElementById('newteam_teamimg').src;
  incomplete = name == "" || email == "" || pass1 == "" || pass2 == "";
  var signup_error = document.getElementById('signup_error');
  if(incomplete){
    signup_error.innerText = "Please fill out all fields."
  } else if (pass1 != pass2) {
    signup_error.innerText =  "Passwords do not match."
  }
  else{
    firebase.auth().createUserWithEmailAndPassword(email, pass1)
    .then(function (user) {
      // successful account creation
      signup_error.innerText = "";
      firestoreDB.addTeam(name, picture).then(function(teamData) {
        var teamKey = teamData.id;
        firestoreDB.addUser(user.uid, teamKey, true).then(function(userKey) {
          mainState.setState("teamID", teamKey);
          window.location='team.html';
        });
      });
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        signup_error.innerText = "Account already in use."
      } else if (errorCode === 'auth/invalid-email') {
        signup_error.innerText = "Email not valid."
      } else if (errorCode === 'auth/weak-password') {
        signup_error.innerText = "Password not valid."
      }
    });
  }

  function signUpNonAdmin(){
    var incomplete = false;
    var teamForm = document.getElementById('signupform_inv');
    var teamIDInv = document.getElementById('inviteinput');
    var email = teamForm.elements['invemail'].value;
    var pass1 = teamForm.elements['invpass1'].value;
    var pass2 = teamForm.elements['invpass2'].value;
    incomplete = name == "" || email == "" || pass1 == "" || pass2 == "";
    if(incomplete){
      displayMessage("signupinvmsg", "error", "Please fill out all fields");
    }
  }
}
