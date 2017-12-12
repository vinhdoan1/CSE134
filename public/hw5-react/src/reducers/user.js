var stateStart = {
  loggedIn: false,
  admin: false,
  teamID: "",
  player: undefined,
  game: undefined,
}

const user = (state = stateStart, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
          ...state,
          loggedIn: true,
          teamID: action.teamID,
          admin: action.admin,
        }
    }
    case 'LOGOUT': {
      return {
          loggedIn: false,
        }
    }
    case 'SETPLAYER': {
      return {
          ...state,
          player: action.player,
        }
    }
    default:
    {
      return state
    }
  }
}

export default user
