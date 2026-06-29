import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5220/api'

export const getGames = (params) => axios.get(`${API_URL}/games`, { params })
export const getGame = (id) => axios.get(`${API_URL}/games/${id}`)
export const createGame = (game) => axios.post(`${API_URL}/games`, game)
export const updateGame = (id, game) => axios.put(`${API_URL}/games/${id}`, game)
export const deleteGame = (id) => axios.delete(`${API_URL}/games/${id}`)
export const searchGames = (q) => axios.get(`${API_URL}/games/search`, { params: { q } })
export const getStats = () => axios.get(`${API_URL}/stats`)
export const getPlatforms = () => axios.get(`${API_URL}/platforms`)
export const createPlatform = (platform) => axios.post(`${API_URL}/platforms`, platform)
export const getPlatformGames = (id) => axios.get(`${API_URL}/platforms/${id}/games`)