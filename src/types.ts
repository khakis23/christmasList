export interface RawLinkObject {
  label?: string;
  title?: string;
  name?: string;
  url: string;
}

export type RawLink = string | RawLinkObject;

export interface RawItem {
  id?: string;
  title: string;
  description?: string;
  link?: RawLink;
  links?: RawLink[];
  note?: string;
}

export interface CleanLink {
  label: string;
  url: string;
}

export interface ChristmasItem {
  id: string;
  title: string;
  description?: string;
  links: CleanLink[];
}
