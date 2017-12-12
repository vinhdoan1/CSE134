export const login = (user) => ({
  type: 'LOGIN',
  teamID: user.teamID,
  admin: user.admin,
})

export const logout = () => ({
  type: 'LOGOUT',
})

export const setPlayer = (player) => ({
  type: 'SETPLAYER',
  player: player,
})
