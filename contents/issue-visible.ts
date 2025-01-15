import { LocalStorageToken, type Message, MessageType, GithubTab } from '../models'
import './issue-visible.scss'
import { type Issue, IssueExt } from '../models/issue-visible.model'
import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['https://github.com/*/*']
}

if (chrome.runtime?.onMessage !== undefined) {
  chrome.runtime.onMessage.addListener((message: Message<unknown>, never, sendResponse) => {
    const tab = localStorage.getItem(LocalStorageToken.GitTab)
    if (tab !== GithubTab.Issues) {
      return
    }

    switch (message.type) {
      case MessageType.IssueGet: {
        getIssues().then(response => sendResponse(response)).catch(e => console.error('Failed to get issues', e))
        break
      }
      case MessageType.IssueShow: {
        showIssue(message.data as Issue).then(response => sendResponse(response)).catch(e => console.error('Failed to show issue', e))
        break
      }
      case MessageType.IssueLoadUI: {
        loadIssueUI().then().catch(e => console.error('Failed to load issue UI', e))
        break
      }
      default: break
    }
  })
}

async function loadIssueUI (): Promise<void> {
  const githubAuthor: string | null = await localStorage.getItem(LocalStorageToken.GitAuthor)
  const githubRepo: string | null = await localStorage.getItem(LocalStorageToken.GitRepo)

  if (githubAuthor === null || githubRepo === null) {
    console.error('[Issue Visible] Could not find author or repo')
    return
  }

  const rawNodeElements = document.querySelectorAll('[id^="issue_"]')
  const issueElements: HTMLDivElement[] = Array.from(rawNodeElements).filter(function (element) {
    return element instanceof HTMLDivElement
  }) as HTMLDivElement[]

  for (const issueElement of issueElements) {
    const issueId: string = issueElement.id.split('_')[1]
    const issueKey: string = IssueExt.getKey(githubAuthor, githubRepo, issueId)
    const visibleContainerExists: boolean = issueElement.firstElementChild?.querySelector(`#${getVisibleElementId(issueId)}`) !== null

    if (visibleContainerExists) {
      issueElement.firstElementChild?.removeChild(issueElement.firstElementChild.querySelector(`#${getVisibleElementId(issueId)}`) as Element)
    }

    issueElement.firstElementChild?.appendChild(getVisibleElement(issueId))

    const issueVisible: { [key: string]: Issue } = await chrome.storage.sync.get(issueKey)
    issueElement.style.display = (issueVisible[issueKey]?.isVisible === false) ? 'none' : 'block'
  }
}

function getVisibleElement (issueId: string): HTMLDivElement {
  const visibleDiv: HTMLDivElement = document.createElement('div')
  visibleDiv.dataset.issueId = issueId
  visibleDiv.className = 'visible-container'
  visibleDiv.id = getVisibleElementId(issueId)
  visibleDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>'

  visibleDiv.addEventListener('click', (ev: MouseEvent) => {
    const divElement: HTMLDivElement = ev.currentTarget as HTMLDivElement
    const issueId: string = divElement.dataset.issueId ?? '0'

    const issueElement = document.getElementById(`issue_${issueId}`)
    if (issueElement != null) {
      const githubAuthor: string | null = localStorage.getItem(LocalStorageToken.GitAuthor)
      const githubRepo: string | null = localStorage.getItem(LocalStorageToken.GitRepo)

      if (githubAuthor === null || githubRepo === null) {
        console.error('[Issue Visible] Could not find author or repo')
        return
      }

      issueElement.style.display = 'none'
      const issueTitleElement = issueElement.querySelector(`[id^="issue_${issueId}_link"]`)

      const issueVisible: Issue = {
        id: IssueExt.getKey(githubAuthor, githubRepo, issueId),
        isVisible: false,
        gitHub: {
          author: githubAuthor,
          repo: githubRepo,
          title: issueTitleElement?.textContent ?? 'UNKNOWN',
          issue: issueId
        },
        hiddenDate: new Date()
      }

      chrome.storage.sync.set({ [issueVisible.id]: issueVisible }).then().catch(e => console.error('Failed to set issue visible', e))
    }
  })

  return visibleDiv
}

async function getIssues (): Promise<Issue[]> {
  const rawNodeElements = document.querySelectorAll('[id^="issue_"]')
  const issueElements: HTMLDivElement[] = Array.from(rawNodeElements).filter(function (element) {
    return element instanceof HTMLDivElement
  }) as HTMLDivElement[]
  const githubAuthor: string = await localStorage.getItem(LocalStorageToken.GitAuthor) ?? ''
  const githubRepo: string = await localStorage.getItem(LocalStorageToken.GitRepo) ?? ''

  return issueElements.map(i => {
    const issueId: string = i.id.split('_')[1]
    const issueKey: string = IssueExt.getKey(githubAuthor, githubRepo, issueId)
    return ({
      id: issueKey,
      isVisible: i.style.display !== 'none',
      gitHub: {
        author: githubAuthor,
        repo: githubRepo,
        issue: issueId,
        title: 'N/A'
      },
      hiddenDate: new Date()
    })
  })
}

async function showIssue (issue: Issue): Promise<void> {
  const rawIssueElement = document.getElementById(`issue_${issue.gitHub.issue}`)

  if (rawIssueElement === null) {
    chrome.storage.sync.remove(issue.id).then().catch(e => console.error('Failed to remove issue', e))
    return
  }

  rawIssueElement.style.display = 'block'
  issue.isVisible = true
  await chrome.storage.sync.set({ [issue.id]: issue })
}

function getVisibleElementId (issueId: string): string {
  return `visible-container-${issueId}`
}
