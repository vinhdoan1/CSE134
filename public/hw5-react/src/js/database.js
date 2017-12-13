import firebase from './firebase.js';
import '@firebase/firestore'


var enablePersistenceOn = false;

  /*
  Obtains reference to firestore database. On first call, it enables offline
  persistence, and then gets firestore directly on other occasions.
  */
  async function getDB() {
    if (enablePersistenceOn) {
      return firebase.firestore();
    } else {
      var db;
      enablePersistenceOn = true;
      await firebase.firestore().enablePersistence()
        .catch(function(err) {
            if (err.code === 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                enablePersistenceOn= false ;
                // ...
            } else if (err.code === 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
        })
        .then(function() {
          // Initialize Cloud Firestore through firebase
          db = firebase.firestore();

        });
      return db;
    }
  }
  var firestoreDB = {};

  // USERS
  firestoreDB.addUser = async function(userID, team, admin) {
    var db = await getDB();
    return (db.collection("users").doc(userID).set({
      team: team,
      admin: admin,
    }))
  }

  firestoreDB.getUser = async function(userID) {
    var db = await getDB();
    return db.collection("users").doc(userID).get();
  }

  // TEAMS
  firestoreDB.addTeam = async function(name, logo) {
    var db = await getDB();
    return (db.collection("teams").add({
      name: name,
      logo: logo,
      wins: 0,
      losses: 0
    }));
  }

  firestoreDB.getTeam = async function(teamID) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).get();
  }

  firestoreDB.setTeam = async function(teamID, teamData){
    var db = await getDB();
    return db.collection("teams").doc(teamID).set(teamData);
  }

  firestoreDB.updateTeamWins = async function(teamID, wins){
    var db = await getDB();
    var teamref = db.collection("teams").doc(teamID);
    return teamref.update({wins: wins});
  }

  firestoreDB.updateTeamLosses = async function(teamID, losses){
    var db = await getDB();
    var teamref = db.collection("teams").doc(teamID);
    return teamref.update({losses: losses});
  }


  // OPPONENTS
  firestoreDB.addOpponent = async function(teamID, opName, logo) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").add({
      name: opName,
      logo: logo,
      active: true
    });
  }

  firestoreDB.getOpponent = async function(teamID, opID){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").doc(opID).get();
  }

  firestoreDB.getAllOpponents = async function(teamID){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").get();
  }

  firestoreDB.setOpponent = async function(teamID, opID, opponent){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").doc(opID).set(opponent);
  }

  firestoreDB.deleteOpponent = async function(teamID, opID){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").doc(opID).delete();
  }

  firestoreDB.setInactive = async function(teamID, opID){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("opponents").doc(opID).set({active: false},{merge: true});
  }

  //STATS
  firestoreDB.getStats = async function(teamID, gameID){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").doc(gameID).collection("stats").get()
  }

  firestoreDB.setStat = async function(teamID, gameID, stat){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games")
    .doc(gameID).collection("stats").add({stat})
  }

  //GAMES
  firestoreDB.getTeamGames = async function(teamID){

    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").get()
  }

  firestoreDB.getTeamGame = async function(teamID, gameID){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").doc(gameID).get()
  }

  firestoreDB.setTeamGame = async function(teamID, gameID, game){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").doc(gameID).set(game);
  }

  firestoreDB.addNewGame = async function(teamID, game){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").add(game)
  }

  firestoreDB.updateGame = async function(teamID, gameID, game){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games")
    .doc(gameID).set(game)
  }

  firestoreDB.markGameComplete = async function(teamID, gameID, isComplete){
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("games").doc(gameID).set({complete: isComplete},{ merge: true });
  }

  // PLAYERS
  firestoreDB.getTeamPlayers = async function(teamID) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("players").get();
  }

  firestoreDB.getTeamPlayer = async function(teamID, playerID) {
    var db = await getDB();
    return db.collection("teams").doc(teamID).collection("players").doc(playerID).get();
  }

  firestoreDB.addNewPlayer = async function(teamID, player) {
    var db = await getDB();
    return (db.collection("teams").doc(teamID).collection("players").add(player));
  }

  firestoreDB.updatePlayer = async function(teamID, playerID, player) {
    var db = await getDB();
    return (db.collection("teams").doc(teamID).collection("players").doc(playerID).update(player));
  }

export default firestoreDB;
