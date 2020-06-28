import { mapValues } from 'lodash'

const basePath = '/'
const createLinks = links => mapValues(links, (link => `${basePath}${link}`))

const links = {
  base: createLinks({
    home: '',
    createGame: 'games/new',
    systems: 'systems',
    newSystem: 'systems/new',
    games: 'games',
    newGame: 'games/new',
    game: 'games/:id',
    joinGame: 'games/:id/join',
    gameSwitchStatus: 'games/:id/switch_status',
    sheets: 'games/:game_id/sheets',
    sheet: 'games/:game_id/sheets/:id',
    gameUsers: 'games/:game_id/users',
    messages: 'games/:game_id/messages',
    items: 'games/:game_id/items',
    folderTree: 'folders/tree',
    rootFolder: 'folder',
    folder: 'folders/:id',
    folderImages: 'folders/:folder_id/images',
    folderImage: 'folders/:folder_id/images/:id',
    tokens: 'pages/:page_id/tokens',
    images: 'pages/:page_id/images',
    graphics: 'pages/:page_id/graphics',
    acl: 'acl',

    adminGames: 'admin/games',
    adminGame: 'admin/games/:id',
  }),

  dynamic: (link, params) => {
    let resultLink = link
    Object.keys(params).forEach(parameter => resultLink = resultLink.replace(`:${parameter}`,
      params[parameter]))
    return resultLink
  },

  json: link => `${link}.json`,
}

export default links
