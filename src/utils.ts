import { ChristmasItem, CleanLink, CleanTag, RawItem, RawLink } from './types';

export function getDomainLabel(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.replace(/^www\./, '');
    return host || 'Link';
  } catch {
    return 'Link';
  }
}

export function extractUrl(entry: any): string | null {
  if (!entry) return null;
  const target = entry.url || entry.link || entry.href;
  if (typeof target === 'string') {
    const trimmed = target.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return null;
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

  if (typeof link === 'object') {
    const url = extractUrl(link);
    if (!url) return null;
    const label = (link.label || link.title || link.name || '').trim();
    return {
      label: label || getDomainLabel(url) || `Link ${index + 1}`,
      url,
    };
  }

  return null;
}

export function normalizeItems(rawList: RawItem[]): ChristmasItem[] {
  if (!Array.isArray(rawList)) return [];

  return rawList
    .filter((item) => item && typeof item.title === 'string' && item.title.trim().length > 0)
    .map((item, index) => {
      const rawEntries: RawLink[] = [];
      if (item.links && Array.isArray(item.links)) {
        rawEntries.push(...item.links);
      }
      if (item.tags && Array.isArray(item.tags)) {
        rawEntries.push(...item.tags);
      }
      if (item.options && Array.isArray(item.options)) {
        rawEntries.push(...item.options);
      }
      if (item.link) {
        rawEntries.push(item.link);
      }

      const cleanLinks: CleanLink[] = [];
      const cleanTags: CleanTag[] = [];

      rawEntries.forEach((entry, entryIndex) => {
        if (!entry) return;

        if (typeof entry === 'string') {
          const trimmed = entry.trim();
          if (!trimmed) return;
          if (/^https?:\/\//i.test(trimmed)) {
            if (!cleanLinks.some((l) => l.url === trimmed)) {
              cleanLinks.push({
                label: getDomainLabel(trimmed),
                url: trimmed,
              });
            }
          } else {
            if (!cleanTags.some((t) => t.label === trimmed)) {
              cleanTags.push({ label: trimmed });
            }
          }
          return;
        }

        if (typeof entry === 'object') {
          const url = extractUrl(entry);
          const rawLabel = (entry.label || entry.title || entry.name || '').trim();

          if (url) {
            const label = rawLabel || getDomainLabel(url) || `Link ${entryIndex + 1}`;
            if (!cleanLinks.some((l) => l.url === url)) {
              cleanLinks.push({ label, url });
            }
          } else if (rawLabel) {
            if (!cleanTags.some((t) => t.label === rawLabel)) {
              cleanTags.push({ label: rawLabel });
            }
          }
        }
      });

      const description = (item.description || item.note || '').trim();

      return {
        id: item.id || `item-${index + 1}`,
        title: item.title.trim(),
        description: description.length > 0 ? description : undefined,
        links: cleanLinks,
        tags: cleanTags,
      };
    });
}
