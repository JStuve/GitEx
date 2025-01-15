export interface Issue {
  id: string
  gitHub: {
    author: string | null
    repo: string | null
    issue: string
    title: string
  }
  hiddenDate?: Date
  isVisible?: boolean
}

export const IssueExt = {
  getKey (author: string, repo: string, issueId: string): string {
    return `${author}-${repo}-${issueId}`
  }
}
