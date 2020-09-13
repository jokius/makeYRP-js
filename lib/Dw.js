import { Pbta } from './Pbta'

export class Dw {
  static newItem() {
    return {
      ...Pbta.newItem(),
      use: 1,
      weight: 0,
      protectionAdd: false,
      edit: false,
    }
  }

  static newSpell(name, description) {
    return {
      name,
      description,
      long: false,
      edit: true,
      remove: true,
    }
  }

  static statShortValue(value) {
    if (value >= 18) return 3
    else if (value >= 16) return 2
    else if (value >= 13) return 1
    else if (value >= 9) return 0
    else if (value >= 6) return -1
    else if (value >= 4) return -2
    return -3
  }
}
