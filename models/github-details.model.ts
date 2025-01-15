export enum GithubTab {
  Home = '',
  Issues = 'issues'
}
export interface GithubDetails {
  isGithubSite: boolean
  tab: GithubTab
  author: string
  repo: string
  colorTheme: 'light' | 'dark'
}
