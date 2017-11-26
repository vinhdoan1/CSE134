var api = {}; // not necessary just to make it more obvious
api.generateID = generateID;
api.getUsers = getUsers;
api.addUser = addUser;
api.authenticateUser = authenticateUser;
api.userExists = userExists;
api.getTeams = getTeams;
api.addTeam = addTeam;
api.getTeam = getTeam;
api.getTeamGames = getTeamGames;
api.getTeamPlayers = getTeamPlayers;
api.setTeamGames = setTeamGames;
api.setTeamPlayers = setTeamPlayers;
api.getTeamPlayer = getTeamPlayer;
api.setTeamPlayer = setTeamPlayer;

function generateID() {
  return Date.now().toString(36);
}

// USERS
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getUsers() {
  var allUsersString = localStorage.getItem("users");
  var allUsers = [];
  if (allUsersString != null) {
    allUsers = JSON.parse(allUsersString);
  } else {
    saveUsers(allUsers);
  }
  return allUsers;
}

function addUser(username, password, email) {
  var allUsers = getUsers();

  var newID = generateID();
  allUsers.push({
    name: username,
    pass: password,
    email: email,
    id: newID,
  })
  saveUsers(allUsers);
  return newID;
}

function authenticateUser(username, password) {
  var allUsers = getUsers();
  return allUsers.find(function(user) {
    return user.name == username && user.pass == password;
  });
}

function userExists(username) {
  var allUsers = getUsers();
  return allUsers.find(function(user) {
    return user.name == username;
  });
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
  allTeams[teamID].players = teamPlayers;
  saveTeams(allTeams);
}

function getTeamPlayer(teamID, playerID) {
  var allTeams = getTeams();
  var teamPlayers = allTeams[teamID].players;
  return teamPlayers.find(function(player) {
    return player.id == playerID;
  })
}

function setTeamPlayer(teamID, playerID, player) {
  var players = api.getTeamPlayers(teamID);
  var playerIndex = players.findIndex(function(player) {
    return player.id == playerID;
  });
  if (playerIndex) {
    players[playerIndex] = player;
    setTeamPlayers(teamID, players);
  }
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
