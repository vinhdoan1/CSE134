function changeTeamName(newName){
  var team = mainState.getState().teamID;
  team.name = newName;
  
}

function changeTeamLogo(newLogo){

}

function updateTeam(){
  var teamID = mainState.getState().teamID;
  var team = firedatabase.getTeam(teamID);
  var newTeamname = document.getElementById('newteamname').value;
  
  if(newTeamname != team.name){
    team.name = newTeamname;
  }
  if()

}