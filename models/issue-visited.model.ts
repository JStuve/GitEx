export interface IssueVisited {
  id: string
  gitHub: {
    author: string | null
    repo: string | null
    issue: string
  }
  visitedDate?: Date
  isVisited?: boolean
}

export const IssueVisitedExt = {
  getKey (author: string, repo: string, issueId: string): string {
    return `visited-${author}-${repo}-${issueId}`
  }
}
