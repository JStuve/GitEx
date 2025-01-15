import type { PlasmoCSConfig } from 'plasmo'
import { Storage } from '@plasmohq/storage'
import { LocalStorageToken } from '~models'
import { PullTimelineFilterType } from '~models/pull-timeline-filter.model'

const storage = new Storage()

export const config: PlasmoCSConfig = {
  matches: ['https://github.com/*/*/pull/*']
}

export async function updateTimelineElement (): Promise<void> {
  const filter = await storage.get(LocalStorageToken.GitPullTimelineFilter)
  console.log('filter', filter)

  const timelineDivElements: NodeListOf<HTMLDivElement> | undefined = document.querySelector('.js-discussion')?.querySelectorAll<HTMLDivElement>('.js-timeline-item')

  if (timelineDivElements === undefined) {
    return
  }

  const timelineActionDevElement: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.discussion-timeline-actions')

  if (timelineActionDevElement !== null) {
    timelineActionDevElement.style.borderTop = 'none'
  }

  if (filter === undefined || filter === PullTimelineFilterType.ShowAll) {
    // Even though we are showing all here, we need to make sure that all the elements are visible when toggling between filters.
    timelineDivElements?.forEach((timelineDivElement) => {
      timelineDivElement.style.display = 'block'
    })
  } else if (filter === PullTimelineFilterType.ShowOpenReviews) {
    timelineDivElements?.forEach((timelineDivElement) => {
      if (timelineDivElement.dataset.gid?.startsWith('PRR') === true) {
        const detailsElements = timelineDivElement.querySelectorAll('details')
        const allResolved = Array.from(detailsElements).every(detail =>
          detail.getAttribute('data-resolved') === 'true'
        )
        timelineDivElement.style.display = allResolved ? 'none' : 'block'
      } else {
        timelineDivElement.style.display = 'none'
      }
    })
  }
}

updateTimelineElement().then().catch(console.error)
