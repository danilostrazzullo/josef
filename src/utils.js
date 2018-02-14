const isMessage = event => Boolean(event.type === 'message' && event.text)

const isMessageToChannel = message => typeof message.channel === 'string' && (message.channel[0] === 'C' || message.channel[0] === 'G')

const isFromUser = (event, userId) => event.user === userId

const messageContainsText = (message, keywords) => {
  const messageText = message.text.toLowerCase()
  const words = Array.isArray(keywords) ? keywords : [keywords]
  for (const text of words) {
    if (messageText.indexOf(text.toLowerCase()) > -1) {
      return true
    }
  }

  return false
}

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

export { isMessage, isMessageToChannel, isFromUser, messageContainsText, pickRandom }
