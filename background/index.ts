import { type Message, MessageType } from '../models'

if (chrome?.tabs?.onUpdated !== undefined) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
      // Important: Github details must be called before anything else
      chrome.tabs.sendMessage<Message<null>>(tabId, { type: MessageType.GithubDetailsGet, data: null }).then().catch(e => console.error(e))

      chrome.tabs.sendMessage<Message<null>>(tabId, { type: MessageType.IssueLoadUI, data: null }).then().catch(e => console.error(e))

      chrome.tabs.query({ active: true, currentWindow: true })
        .then(tab => {
          chrome.tabs.sendMessage<Message<string | undefined>>(tabId, { type: MessageType.IssueVisitedCheck, data: tab[0]?.url })
            .then().catch(e => console.error(e))
        })
        .catch(e => console.error(e))
    }
  })
}
