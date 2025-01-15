import type { PlasmoCSConfig } from 'plasmo'
import { type GithubDetails, GithubTab, LocalStorageToken, type Message, MessageType } from '../models'
import { ArrayUtility } from '../utilities'
import { CookieUtility } from '~utilities/cookie.utility'

export const config: PlasmoCSConfig = {
  matches: ['https://github.com/*/*']
}

if (chrome?.runtime?.onMessage !== undefined) {
  chrome.runtime.onMessage.addListener((message: Message<unknown>, never, sendResponse) => {
    switch (message.type) {
      case MessageType.GithubDetailsGet: {
        sendResponse(getGithubDetails())
        break
      }
      default: break
    }
  })
}

function getGithubDetails (): GithubDetails {
  const splitUrl: string[] = document.location?.pathname?.split('/')

  const author: string = ArrayUtility.safeGetNth(splitUrl, 1) ?? ''
  const repo: string = ArrayUtility.safeGetNth(splitUrl, 2) ?? ''
  const tab: GithubTab = ArrayUtility.safeGetNth(splitUrl, 3) as GithubTab ?? GithubTab.Home

  localStorage.setItem(LocalStorageToken.GitAuthor, author)
  localStorage.setItem(LocalStorageToken.GitRepo, repo)
  localStorage.setItem(LocalStorageToken.GitTab, tab)

  const githubColorModeCookie: string | undefined = CookieUtility.getCookie('color_mode')
  const githubColorMode: { 'color_mode': string } = githubColorModeCookie === undefined ? {} : JSON.parse(decodeURIComponent(githubColorModeCookie) ?? '{}')

  let colorTheme: 'light' | 'dark' = 'light'

  switch (githubColorMode.color_mode) {
    case 'auto': {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        colorTheme = 'dark'
      } else {
        colorTheme = 'light'
      }
      break
    }
    case 'dark': {
      colorTheme = 'dark'
      break
    }
    default: {
      colorTheme = 'light'
      break
    }
  }

  localStorage.setItem(LocalStorageToken.GitColorMode, colorTheme)

  return {
    isGithubSite: document.location.hostname.includes('github'),
    author,
    repo,
    tab,
    colorTheme
  }
}

getGithubDetails()
