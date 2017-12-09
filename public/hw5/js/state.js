// used to pesist data between multiple pages
// uses: loggedIn, teamID, playerID

var mainState = {};
mainState.setState = setState;
mainState.getState = getState;

// STATE
function setState(key, value) {
  var state = getState();
  state[key] = value;
  localStorage.setItem('state', JSON.stringify(state));
}

function getState() {
  var stateString = localStorage.getItem('state');
  var fullState = {};
  if (stateString != null) {
    fullState = JSON.parse(stateString);
  } else {
    localStorage.setItem('state', JSON.stringify(fullState));
  }
  return fullState;
}

function checkLoggedIn() {
  var state = mainState.getState();
  if (!state.loggedIn) {
    window.location='login.html';
  }
}

function goTo(wheredidyoucomefrom, wheredidyougo){
  setState("back", wheredidyoucomefrom);
  window.location = wheredidyougo;
}

function goBack(){
  var state = mainState.getState();
  console.log(state.back);
  window.location = state.back;
}
