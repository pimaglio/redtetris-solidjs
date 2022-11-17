class Player {
  constructor(username, room, socket) {
    this.username = username
    this.room = room
    this.socket = socket
    this.spectre = []
  }

  setSpectre(spectre) {
    this.spectre = spectre
  }
}

module.exports = Player
