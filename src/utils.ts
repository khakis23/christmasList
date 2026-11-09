import { ChristmasItem, CleanLink, RawItem, RawLink } from './types';

export function getDomainLabel(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.replace(/^www\./, '');
    return host || 'Link';
  } catch {
    return 'Link';
  }
}

export function normalizeLink(link: RawLink, index: number): CleanLink | null {
  if (!link) return null;

  if (typeof link === 'string') {
    const trimmed = link.trim();
    if (!trimmed) return null;
    return {
      label: getDomainLabel(trimmed),
      url: trimmed,
    };
  }

  if (typeof link === 'object' && link.url) {
    const trimmedUrl = link.url.trim();
    if (!trimmedUrl) return null;
    const label = (link.label || link.title || link.name || '').trim();
    return {
      label: label || getDomainLabel(trimmedUrl) || `Link ${index + 1}`,
      url: trimmedUrl,
    };
  }

  return null;
}

export function normalizeItems(rawList: RawItem[]): ChristmasItem[] {
  if (!Array.isArray(rawList)) return [];

  return rawList
    .filter((item) => item && typeof item.title === 'string' && item.title.trim().length > 0)
    .map((item, index) => {
      const rawLinks: RawLink[] = [];
      if (item.links && Array.isArray(item.links)) {
        rawLinks.push(...item.links);
      }
      if (item.link) {
        rawLinks.push(item.link);
      }

      const cleanLinks: CleanLink[] = [];
      rawLinks.forEach((l, i) => {
        const normalized = normalizeLink(l, i);
        if (normalized && !cleanLinks.some((existing) => existing.url === normalized.url)) {
          cleanLinks.push(normalized);
        }
      });

      const description = (item.description || item.note || '').trim();

      return {
        id: item.id || `item-${index + 1}`,
        title: item.title.trim(),
        description: description.length > 0 ? description : undefined,
        links: cleanLinks,
      };
    });
}
