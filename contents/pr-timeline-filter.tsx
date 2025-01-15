import { type ReactNode } from 'react'
import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from 'plasmo'
import { useStorage } from '@plasmohq/storage/hook'
import { LocalStorageToken } from '~models'
import { PullTimelineFilterType, type PullTimelineFilter } from '~models/pull-timeline-filter.model'
import { updateTimelineElement } from './pr-timeline-manager'

export const config: PlasmoCSConfig = {
  matches: ['https://github.com/*/*/pull/*']
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.querySelector('.TimelineItem') as Element

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style')
  style.textContent = `
    .gitkit-button-group {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      align-items: center;
      gap: var(--control-small-gap);
      border-color: var(--borderColor-default);
      border-style: solid;
      border-radius: var(--borderRadius-medium);
      border-width: var(--borderWidth-thin);
      margin-top: 0.5rem;
      padding: 0.5rem;
    }

    .gitkit-button {
      all: unset;
      font-size: 14px;
      padding: 6px 12px;
      color: var(--fgColor-muted, var(--color-fg-muted));
      border-radius: 6px;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
      transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
    }

    .gitkit-button:hover {
      color: var(--fgColor-default, var(--color-fg-default));
    }

    .gitkit-button--active {
      color: var(--fgColor-default, var(--color-fg-default));
      font-weight: var(--base-text-weight-semibold, 600);
    }
    
    .gitkit-button:focus {
      outline: 2px solid #0969da;
      outline-offset: 2px;
    }
  
  `
  return style
}

export default function FilterButton (): ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timelineFilter, setTimelineFilter, { setRenderValue, setStoreValue }] = useStorage<PullTimelineFilterType>(LocalStorageToken.GitPullTimelineFilter, v => v === undefined ? PullTimelineFilterType.ShowAll : v)

  const filters: PullTimelineFilter[] = [
    { type: PullTimelineFilterType.ShowAll, title: 'Display all PR timeline events', label: 'Show all' },
    // { type: PullTimelineFilterType.ShowActive, title: 'Hides manually hidden timeline events', label: 'Show active' },
    { type: PullTimelineFilterType.ShowOpenReviews, title: 'Shows only open reviews', label: 'Show open reviews' }
  ]

  const handleFilterChange = (filter: PullTimelineFilterType): void => {
    setStoreValue(filter).then(() => {
      setRenderValue(filter)
      updateTimelineElement().then().catch(console.error)
    }).catch(console.error)
  }

  return (
    <div className='gitkit-button-group'>
      {filters.map(filter => (
        <button
          key={filter.type}
          className={`gitkit-button ${timelineFilter === filter.type ? 'gitkit-button--active' : ''}`}
          title={filter.title}
          onClick={() => handleFilterChange(filter.type)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
