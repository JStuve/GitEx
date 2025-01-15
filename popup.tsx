/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useState, type ReactNode } from 'react'
import { Eye, RefreshCcw } from 'lucide-react'
import './popup.scss'
import { type GithubDetails, GithubTab, LoadState, MessageType } from './models'
import { type Issue } from './models/issue-visible.model'
import Button from './components/button/Button'
import clsx from 'clsx'
import { ArrayUtility } from './utilities'
import ReportIssueLink from './components/report-issue-link/ReportIssueLink'
import Loader from './components/loader/Loader'
import { StringUtility } from '~utilities/string.utility'

function IndexPopup (): ReactNode {
  const [loadState, setLoadState] = useState<LoadState>(LoadState.Pending)
  const [hiddenIssues, setHiddenIssues] = useState<Issue[]>([])
  const [activeTabId, setActiveTabId] = useState<number>(0)
  const [repo, setRepo] = useState<string>('')
  const [githubDetails, setGithubDetails] = useState<GithubDetails>()

  useEffect(() => {
    const loadIssues = async (): Promise<void> => {
      setLoadState(LoadState.Loading)

      const tabs = chrome?.tabs !== undefined ? await chrome.tabs.query({ active: true, currentWindow: true }) : null
      const activeTab = tabs?.find(t => t.active)

      if (activeTab != null) {
        try {
          const domIssues: Issue[] = await chrome.tabs.sendMessage(activeTab.id ?? 0, { type: MessageType.IssueGet, data: null })
          const storedIssues: { [key: string]: Issue } = await chrome.storage.sync.get(domIssues.map(d => d.id))
          const hiddenIssues: Issue[] = ArrayUtility.sortBy<Issue, string>(Object.values(storedIssues).filter(i => i.isVisible === false), i => i.gitHub.issue, true)

          setActiveTabId(activeTab.id ?? 0)
          setHiddenIssues(hiddenIssues)

          const githubDetails: GithubDetails = await chrome.tabs.sendMessage(activeTab.id ?? 0, { type: MessageType.GithubDetailsGet, data: null })

          setGithubDetails(githubDetails)

          if (StringUtility.hasValue(githubDetails?.author)) {
            setRepo(`${githubDetails.author}/${githubDetails.repo}`)
          } else {
            setRepo('')
          }
        } catch (err) {
          console.error('Failed to send message', err)
        }
      }

      setLoadState(LoadState.Loaded)
    }

    if (loadState === LoadState.Pending) {
      loadIssues().then().catch(e => console.error('Failed to load issues', e))
    }
  }, [loadState])

  const showIssue = async (issue: Issue): Promise<void> => {
    const updatedIssues: Issue[] = hiddenIssues.filter(h => h.id !== issue.id)

    await chrome.tabs.sendMessage(activeTabId, { type: MessageType.IssueShow, data: issue })

    setHiddenIssues(updatedIssues)
  }

  const IssueElement = (issue: Issue): ReactNode => (
    <div className='issue-container'>
      <div className='content-container'>
        <h3 title={issue.gitHub.title}>{issue.gitHub.title}</h3>
        <span>{'#' + issue.gitHub.issue}</span>
      </div>
      <div className='action-container'>
        <Button child={<Eye />} variant='no-style' handleClick={async () => await showIssue(issue)} title='Show issue' />
      </div>
    </div>
  )

  const NoIssuesElement = (): ReactNode => (
    <div className={clsx('issues-none')}>
      <h3>All issues are visible</h3>
    </div>
  )

  if (githubDetails?.isGithubSite === false) {
    return (
      <div className={clsx('app-site-invalid')}>
        <h3>This site is not supported.</h3>
        <ReportIssueLink />
      </div>
    )
  }

  if (githubDetails?.tab !== GithubTab.Issues) {
    return (
      <div className={clsx('app-site-invalid')}>
        <h3>This Github tab currently has no features.</h3>
        <Button child='Request feature' handleClick={() => window.open('https://github.com/JStuve/github-extension/issues', '_blank')} title='Request feature' />
      </div>
    )
  }

  return (
    <div className='app-container'>
      <div className={clsx('issues-header')}>
        <div className={clsx('title')}>
          <span className={clsx('title__feature')} title='Issues'>Issues</span>
          <span className={clsx('title__repo')} title={repo}>{repo !== null ? `in @${repo}` : ''}</span>
        </div>
        <Button
          child={loadState === LoadState.Loading ? <Loader /> : <RefreshCcw />}
          handleClick={() => setLoadState(LoadState.Pending)}
          title='Refresh issues'
        />
      </div>

      <div className='issues-container'>
        {hiddenIssues?.length > 0 ? hiddenIssues?.map(i => IssueElement(i)) : NoIssuesElement()}
      </div>
      <div className={clsx('issues-footer')}>
        <ReportIssueLink />
      </div>
    </div>
  )
}

export default IndexPopup
