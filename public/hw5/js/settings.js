function changeTeamName(newName){
  var team = mainState.getState().teamID;
  team.name = newName;
  
}

function changeTeamLogo(newLogo){

}

function populateTeamInformation(){
  var teamID = mainState.getState().teamID;
  firedatabase.getTeam(teamID).then(function(teamData){
    var team = teamData.val();
    document.getElementById('newteamname').value = team.name;
    document.getElementById('editteam_teamimg').src = team.logo;
  });

}

function updateTeam(){
  var teamID = mainState.getState().teamID;
  firedatabase.getTeam(teamID).then(function(teamData){
    var team = teamData.val();
    var newTeamname = document.getElementById('newteamname').value;
    var changesMade = false;
    console.log(team.name);
    if(newTeamname != team.name && newTeamname != ""){
        team.name = newTeamname;
        changesMade = true;
    }
    var newTeamLogo = document.getElementById('editteam_teamimg').src;
    if(newTeamLogo != team.logo){
      team.logo = newTeamLogo;
      changesMade = true;
    }
    console.log(changesMade);
    if(changesMade && newTeamname != ""){
      firedatabase.setTeam(teamID, team);
      document.getElementById('editteam_confirm').style.fontSize="1rem";
      document.getElementById('editteam_confirm').style.opacity="1";
      setTimeout(function(){
        document.getElementById('editteam_confirm').style.opacity="0";
      }, 4000);
      setTimeout(function(){
        document.getElementById('editteam_confirm').style.fontSize="0rem";
      }, 5000);
     

    }
  });
 
}