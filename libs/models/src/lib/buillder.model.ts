export interface MessageContentItem {
  elementType: string;
  text?: string;
  innerHtml?: string;
  class: string;
  src?: string;
  items?: { text: string }[];
}

export interface BaseState {
  contentItems: MessageContentItem[];
}
