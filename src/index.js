import { RtmClient, WebClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client'

import {
  isMessage,
  isMessageToChannel,
  isFromUser,
  messageContainsText,
  pickRandom
} from './utils'
import responses from './data/responses'

const token = `xoxb-${process.env.SLACK_TOKEN}`
const appData = {}

const defaults = {
  triggerWords: ['josef'],
  color: '#4dbdd5'
}

class SlackBot {
  constructor (settings) {
    this.settings = settings || {}
    this.options = Object.assign({}, defaults, this.settings)
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
      console.log(event.channel)
      if (
        isMessage(event) &&
        isMessageToChannel(event) &&
        !isFromUser(event, appData.botId) &&
        messageContainsText(event, this.options.triggerWords)
      ) {
        const response = pickRandom(responses)
        const { color } = this.options
        const message = {
          as_user: true,
          attachments: [
            {
              color,
              title: response.text
            }
          ]
        }
        console.log(message)

        this.web.chat.postMessage(event.channel, '', message)
        console.info(`Posting message to ${event.channel}`)
      }
    })
  }
}

const Josef = new SlackBot()

Josef.rtm.start()
