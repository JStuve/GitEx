export enum MessageType {
  SetGithubDetails = 'set-github-details',
  GithubDetailsGet = '[Github Details] Get',
  Standard = '[Generic] Standard',
  SetIcon = '[Generic] Set icon',
  IssueGet = '[Issue] Get',
  IssueShow = '[Issue] Show',
  IssueLoadUI = '[Issue] Load UI',
  IssueVisitedCheck = '[Issue Visited] Check issue url'
}

export interface Message<T> {
  type: MessageType
  data: T
};
