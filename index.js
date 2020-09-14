const { Plugin } = require('powercord/entities')
const { inject, uninject} = require('powercord/injector')
const { getModule } = require('powercord/webpack')

let camouflageAuto = false
let zeroWidth = ['​', '‍', '‌']

module.exports = class CamoTalker extends Plugin {
  startPlugin () {
    this.injection()

    powercord.api.commands.registerCommand({
      command: 'camouflage',
      aliases: ['cf', 'camo'],
      description: 'Surrounds a message with zero width characters.',
      usage: '{c} [text]', 
      executor: (args) => ({
        send: true, 
        result: args.join(' ').split('').map((char => {
          return char + zeroWidth[(Math.floor(Math.random() * 3))]
        })).join('').slice(0, -1)
      })
    })

    powercord.api.commands.registerCommand({
      command: 'camotoggle',
      aliases: ['cft', 'ct'],
      description: 'Automatically camouflages all of your messages.',
      usage: '{c} [text]', 
      executor: this.toggleAuto.bind(this)
    })
  }

  async injection() {
    const messageEvents = await getModule(['sendMessage'])
    inject('camouflage', messageEvents, 'sendMessage', (args) => {
      let text = args[1].content

      if(camouflageAuto)
        text = text.split('').map((char => {
          return char + zeroWidth[(Math.floor(Math.random() * 3))]
        })).join('').slice(0, -1)

      args[1].content = text
      return args  
    }, true)
  }

  async toggleAuto() {
    camouflageAuto = !camouflageAuto
    powercord.api.notices.sendToast('camouflageNotif', {
      header: 'Comouflage Status',
      content: camouflageAuto ? 'Ready to go, solider!' : 'Standing by sir!',
      buttons: [{
        text: 'Dismiss',
        color: camouflageAuto ? 'green' : 'red',
        look: 'outlined',
        onClick: () => powercord.api.notices.closeToast('camouflageNotif')
      }],
      timeout: 3e3
    })
  }

  pluginWillUnload () {
    uninject('camouflage') 
    powercord.api.commands.unregisterCommand('camouflage')
    powercord.api.commands.unregisterCommand('camotoggle')
  }
}
