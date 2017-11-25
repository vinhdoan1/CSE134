function generateID() {
  return Date.now().toString(36);
}

// STATE: loggedIn, teamID
function setState(state) {
  localStorage.setItem('state', JSON.stringify(state));
}

function getState() {
  return localStorage.getItem("state");
}

// USERS
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getUsers() {
  var allUsersString = localStorage.getItem("users");
  var allUsers = {};
  if (allUsersString != null) {
    allUsers = JSON.parse(allUsersString);
  } else {
    saveUsers(allUsers);
  }
  return allUsers;
}

function addUser(username, password, email) {
  var alllUsers = getUsers();

  var newID = generateID();
  alllUsers.push({
    name: username,
    pass: password,
    email: email,
    id: newID,
  })
  saveUser(alllUsers);
  return newID;
}

// TEAMS

function saveTeams(teams) {
  localStorage.setItem('teams', JSON.stringify(teams));
}

function getTeams() {
  var allTeamsString = localStorage.getItem("teams");
  var allTeams = {};
  if (allTeamsString != null) {
    allTeams = JSON.parse(allTeamsString);
  } else {
    saveTeams(allTeams);
  }
  return allTeams;
}

function addTeam(userID, name, logo) {
  var allTeams = getTeams();
  allTeams[userID] = {
    id: userID,
    name: name,
    logo: logo,
    games: [],
    players: [],
  }
  saveTeams(allTeams);
}

// TEAM SPECIFICS

function getTeam(teamID) {
  var allTeams = getTeams();
  return allTeams[teamID];
}

function getTeamGames(teamID) {
  var allTeams = getTeams();
  return allTeams[teamID].games;
}

function getTeamPlayers(teamID) {
  var allTeams = getTeams();
  return allTeams[teamID].players;
}

function setTeamGames(teamID, teamGames) {
  var allTeams = getTeams();
  allTeams[teamID].games = teamGames;
  saveTeams(allTeams);
}

function setTeamPlayers(teamID, teamPlayers) {
  var allTeams = getTeams();
  allTeams[teamID].players = teamGames;
  saveTeams(allTeams);
}

/*
function addToSchedule(teamID, schedule) {
  var allTeams = getTeams();
  var teamGames = allTeams[teamID];
  teamGames.push({
    gameID
  })
  allTeams[teamID] = teamGames;
  saveTeams(allTeams);
}*/
