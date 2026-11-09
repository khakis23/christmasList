export interface RawLinkObject {
  label?: string;
  title?: string;
  name?: string;
  url?: string;
  link?: string;
  href?: string;
}

export type RawLink = string | RawLinkObject;

export interface RawItem {
  id?: string;
  title: string;
  description?: string;
  link?: RawLink;
  links?: RawLink[];
  tags?: (string | RawLinkObject)[];
  options?: (string | RawLinkObject)[];
  note?: string;
}

export interface CleanLink {
  label: string;
  url: string;
}

export interface CleanTag {
  label: string;
}

export interface ChristmasItem {
  id: string;
  title: string;
  description?: string;
  links: CleanLink[];
  tags: CleanTag[];
}
