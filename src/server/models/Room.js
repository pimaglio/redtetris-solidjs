let Player = require('./Player')

const players = {}

class Room {
  constructor(room, leader) {
    this.name = room
    this.players = []
    this.gameLeader = leader
    this.isStarted = false
    this.listBlocks = []
    this.allBlocks = []
  }

  gameStarted(listBlocks) {
    this.listBlocks = listBlocks
    this.allBlocks = listBlocks
    this.isStarted = true
  }

  getPlayer(name) {
    return this.players.find(player => player.username === name)
  }

  addPlayer(player, socket) {
    let newPlayer = new Player(player.username, player.room, socket)
    this.players.push(newPlayer)
    console.log(
      `(ROOM) - Success adding player '${player.username}' to room '${player.room}'`,
    )
    return newPlayer
  }

  getMoreBlocks() {
    let newBlock = []
    for (let i = this.listBlocks.length + 1; i < this.allBlocks.length; i++) {
      newBlock.push(this.allBlocks[i])
    }
    return newBlock
  }

  addBlocks(newBlocks) {
    this.allBlocks = [...this.allBlocks, newBlocks]
  }

  updateSpectre(data) {
    let player = this.players.find(player => player.username === data.username)
    player.setSpectre(data.spectre)
  }

  updateListBlocks(list) {
    this.listBlocks = list
  }
}

module.exports = Room
