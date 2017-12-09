function populateTeamInformation(){
  var teamID = mainState.getState().teamID;
  firestoreDB.getTeam(teamID).then(function(team){
    var teamData = team.data();
    document.getElementById('newteamname').value = teamData.name;
    document.getElementById('editteam_teamimg').src = teamData.logo;
  });
}

function populateUserInformation(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById('newemail').value=user.email;
      document.getElementById('teamidinvite').innerHTML= mainState.getState().teamID;
    }
  });
}

function copyTeamIDToClipboard(){
  var textArea = document.createElement("textarea");
  textArea.value = document.getElementById("teamidinvite").innerHTML;
  textArea.style.opacity = 0;
  document.body.appendChild(textArea);
  // var copyText = document.getElementById("teamidinvite");
  textArea.select();
  document.execCommand("Copy");
  console.log("copied");
}

function updateTeam(){
  var teamID = mainState.getState().teamID;
  firestoreDB.getTeam(teamID).then(function(team){
    var teamData = team.data();
    var newTeamName = document.getElementById('newteamname').value;
    newTeamName = newTeamName.replace(/\s+/g, '');

    var changesMade = false;
    if(newTeamName != teamData.name && newTeamName != ""){
      teamData.name = newTeamName;
      changesMade = true;
    }
    var newTeamLogo = document.getElementById('editteam_teamimg').src;
    if(newTeamLogo != teamData.logo){
      teamData.logo = newTeamLogo;
      changesMade = true;
    }
    if(newTeamName == ""){
      displayMessage("editteammsg", "error", "Team name cannot be empty");
    }
    else{
      hideMessage('editteammsg');
      if(changesMade){
        firestoreDB.setTeam(teamID, teamData);
        displayMessage("editteammsg", "confirm", "Team information updated");
      }
    }  
  });
}

var needsReauth = false;
function updateEmail(){
  hideMessage('settingsmsg_newemail');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if(needsReauth){
        var reauthPW = document.getElementById('reauth_pw').value;
        if(reauthPW == ""){
          displayMessage("settingsmsg_newemail", "error", "Please enter your password");
        }
        else{
          reauthenticate(user.email, reauthPW, "email");
        }
      }
      else{
        var newEmail = document.getElementById('newemail').value;
        if(newEmail == user.email){
          displayMessage("settingsmsg_newemail", "error", "E-mail is the same as old e-mail")
        } 
        else {
          user.updateEmail(newEmail).then(function() {
            displayMessage("settingsmsg_newemail", "confirm", "E-mail updated");
          }).catch(function(error) {
            console.log(error);
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/email-already-in-use') {
              displayMessage("settingsmsg_newemail", "error", "E-mail already linked to an account.");
            } else if (errorCode === 'auth/invalid-email') {
              displayMessage("settingsmsg_newemail", "error", "Invalid e-mail");
            } else if (errorCode === 'auth/requires-recent-login'){
              showReauthorization();
              needsReauth = true;
            }
          });
        }
      }
    }
  });  
}

function updatePassword(){
  hideMessage('settingsmsg_newpassword');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var newPassword = document.getElementById('newpassword').value;
      var confirmNewPassword = document.getElementById('confirmnewpassword').value;
      var oldPassword = document.getElementById('oldpassword').value;
      if(oldPassword == ""){
        displayMessage("settingsmsg_newpassword", "error", "Please enter your old password");
      } else if(newPassword != confirmNewPassword){
        displayMessage('settingsmsg_newpassword', "error", "Passwords don't match")
      } else{
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
        user.reauthenticateWithCredential(credential).then(function() {
          user.updatePassword(newPassword).then(function() {
            displayMessage("settingsmsg_newpassword", "confirm", "Password updated");
          }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
              displayMessage("settingsmsg_newpassword", "error", "Password must be at least 6 characters");
            } else if (errorCode === 'auth/requires-recent-login'){
              reauthenticate(user.email, oldPassword, "password");
            }
          });
        }).catch(function(error){
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            displayMessage("settingsmsg_newpassword", "error", "Wrong password");
          }
          else{
            displayMessage("settingsmsg_newpassword", "error", "Something went wrong");
          }
        });
      }
    }
  });  
}

function reauthenticate(email, password, action){
  const credential = firebase.auth.EmailAuthProvider.credential(email, password);
  var msg = (action == "email") ? "settingsmsg_newemail" : "settingsmsg_newpassword";
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.reauthenticateWithCredential(credential).then(function() {
        if(action == "email"){
          hideReauthorization();
          needsReauth = false;
          updateEmail();
        }
        else if(action == "password"){
          updatePassword();
        }
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          displayMessage(msg, "error", "Wrong password");
        }
        else{
          displayMessage(msg, "error", "Something went wrong");
        }
      });
    }
  });
}

function displayMessage(elementid, type, message){
  var msg = document.getElementById(elementid);
  msg.style.color = (type == "error") ? "red" : "blue";
  msg.innerHTML = message;
  document.getElementById(elementid).style.opacity="1";
  if(type == "confirm"){
    setTimeout(function(){
      document.getElementById(elementid).style.opacity="0";
    }, 4000);
  }
}

function hideMessage(elementid){
  document.getElementById(elementid).style.opacity = "0";
}

function showReauthorization(){
  document.getElementById('reauth_pw').style.height="2rem";
  document.getElementById('reauth_pw').style.border="1px solid lightgrey";
  document.getElementById('reauth_pw').style.margin="0.5rem auto 0 auto";
  document.getElementById('reauth_msg').style.fontSize="0.7rem";
  document.getElementById('reauth_msg').style.margin="0.5rem auto 0.5rem auto";
}

function hideReauthorization(){
  document.getElementById('reauth_pw').style.height="0rem";
  document.getElementById('reauth_pw').style.border="0";
  document.getElementById('reauth_pw').style.margin="0";
  document.getElementById('reauth_msg').style.fontSize="0";
  document.getElementById('reauth_msg').style.margin="0";
}

