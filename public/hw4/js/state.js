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
  return JSON.parse(localStorage.getItem("state"));
}

function checkLoggedIn() {
  var state = mainState.getState();
  if (!state.loggedIn) {
    window.location='login.html';
  }
}
