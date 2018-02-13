import { RtmClient, WebClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client'

import {
  isMessage,
  // isMessageToChannel,
  isFromUser,
  messageContainsText
} from './utils'

const token = `xoxb-${process.env.SLACK_TOKEN}`
const appData = {}

const defaults = {
  triggerWords: ['josef_help'],
  color: '#4dbdd5'
}

class SlackBot {
  constructor (settings) {
    this.options = Object.assign({}, defaults, settings)
    this.web = new WebClient(token)
    this.rtm = new RtmClient(token, {
      dataStore: false,
      useRtmConnect: true
    })

    this.init()
  }

  init () {
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
      // Cache the data necessary for this app in memory
      appData.botId = connectData.self.id
      console.log(`Logged in as ${appData.botId} of team ${connectData.team.id}`)
    })

    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      console.log(`Ready`)
    })

    this.rtm.on(RTM_EVENTS.MESSAGE, (event) => {
      if (
        isMessage(event) &&
        // isMessageToChannel(event) &&
        !isFromUser(event, appData.botId) &&
        messageContainsText(event, this.options.triggerWords)
      ) {
        this.web.chat.postMessage(event.channel, '', 'Food. Now.')
        console.info(`Posting message to ${event.channel}`)
      }
    })
  }
}

const Josef = new SlackBot()

Josef.rtm.start()
