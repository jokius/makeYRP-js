import { handling } from '@/lib/errorsHandling'
import { createGame, loadGames, switchStatus } from '@/api/games'
import { GameModel } from '@/models/GameModel'

export const state = () => ({
  open: [],
  close: [],
  errors: [],
  loaded: false,
  id: null
})

export const actions = {
  async load({ commit }, axios) {
    try {
      const open = await loadGames({ axios, params: { open: true } })
      const close = await loadGames({ axios, params: { open: false } })
      commit('gamesLoaded', { open, close })
    } catch (error) {
      handling(error)
    }
  },

  async create({ commit }, params) {
    try {
      const result = await createGame(params)
      commit('updateGameId', result.id)
    } catch (error) {
      handling(commit, error)
    }
  },

  async endGame({ commit }, params) {
    try {
      await switchStatus(params)
      commit('endGame', params.id)
    } catch (error) {
      handling(commit, error)
    }
  },

  async startGame({ commit }, params) {
    try {
      await switchStatus(params)
      commit('startGame', params.id)
    } catch (error) {
      handling(commit, error)
    }
  },
}

export const mutations = {
  gamesLoaded(state, games) {
    state.open = games.open.map(game => new GameModel().setInfo(game))
    state.close = games.close.map(game => new GameModel().setInfo(game))
    state.loaded = true
  },

  updateGameId(state, id) {
    state.id = id
  },

  endGame(state, id) {
    const game = state.open.find(item => item.id === id)
    state.close = [...state.close, game]
    state.open = state.open.filter(item => item.id !== id)
  },

  startGame(state, id) {
    const game = state.close.find(item => item.id === id)
    state.open = [...state.open, game]
    state.close = state.close.filter(item => item.id !== id)
  },
}
