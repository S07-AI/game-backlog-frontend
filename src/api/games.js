import client from './client'

export const getGames = (params) => client.get('/games', { params })
export const getGame = (id) => client.get(`/games/${id}`)
export const createGame = (game) => client.post('/games', game)
export const updateGame = (id, game) => client.put(`/games/${id}`, game)
export const deleteGame = (id) => client.delete(`/games/${id}`)
export const searchGames = (q) => client.get('/games/search', { params: { q } })
export const getStats = () => client.get('/stats')
export const getPlatforms = () => client.get('/platforms')
export const createPlatform = (platform) => client.post('/platforms', platform)
export const getPlatformGames = (id) => client.get(`/platforms/${id}/games`)
