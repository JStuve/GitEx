export interface PullTimelineFilter {
  type: PullTimelineFilterType
  title: string
  label: string
}

export enum PullTimelineFilterType {
  ShowAll = 'show_all',
  ShowActive = 'show_active',
  ShowOpenReviews = 'show_open_reviews'
}
