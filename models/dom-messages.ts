export interface DOMMessage {
  type: 'GET_DOM'
}

export interface DOMMessageResponse {
  title?: string
  headlines?: string[]
}
