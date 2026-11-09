import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { normalizeItems, getDomainLabel, normalizeLink, extractUrl } from './utils';
import rawItems from '../items.json';

describe('Utility: getDomainLabel & extractUrl & normalizeLink', () => {
  it('extracts domain name cleanly', () => {
    expect(getDomainLabel('https://www.amazon.com/dp/B08N5WRWNW')).toBe('amazon.com');
    expect(getDomainLabel('https://patagonia.com/product/123')).toBe('patagonia.com');
    expect(getDomainLabel('not-a-valid-url')).toBe('Link');
  });

  it('extracts URL from url, link, or href properties', () => {
    expect(extractUrl({ url: 'https://example.com' })).toBe('https://example.com');
    expect(extractUrl({ link: 'https://example.com/item' })).toBe('https://example.com/item');
    expect(extractUrl({ href: 'https://example.com/page' })).toBe('https://example.com/page');
    expect(extractUrl({ label: 'No URL here' })).toBeNull();
  });

  it('normalizes string links', () => {
    const res = normalizeLink('https://www.lodgecastiron.com', 0);
    expect(res).toEqual({
      label: 'lodgecastiron.com',
      url: 'https://www.lodgecastiron.com',
    });
  });

  it('normalizes object links with custom labels and both link/url keys', () => {
    const resUrl = normalizeLink({ label: 'Store Link', url: 'https://example.com' }, 0);
    expect(resUrl).toEqual({
      label: 'Store Link',
      url: 'https://example.com',
    });

    const resLink = normalizeLink({ link: 'https://example.com/product' }, 0);
    expect(resLink).toEqual({
      label: 'example.com',
      url: 'https://example.com/product',
    });
  });
});

describe('Utility: normalizeItems', () => {
  it('handles empty or invalid data gracefully', () => {
    expect(normalizeItems([])).toEqual([]);
    expect(normalizeItems(null as any)).toEqual([]);
    expect(normalizeItems(undefined as any)).toEqual([]);
  });

  it('separates clickable links from informational labels without URLs', () => {
    const items = normalizeItems([
      {
        title: 'Road Biking Helmet',
        links: [
          { label: 'P2R A20 MIPS' },
          { label: 'Giant Rev Comp MIPS' },
          { link: 'https://www.amazon.com/helmet' },
        ],
      },
    ]);

    expect(items[0].tags.length).toBe(2);
    expect(items[0].tags[0].label).toBe('P2R A20 MIPS');
    expect(items[0].tags[1].label).toBe('Giant Rev Comp MIPS');

    expect(items[0].links.length).toBe(1);
    expect(items[0].links[0].url).toBe('https://www.amazon.com/helmet');
    expect(items[0].links[0].label).toBe('amazon.com');
  });

  it('filters out items without a valid title', () => {
    const items = normalizeItems([
      { title: '' },
      { title: '   ' },
      { title: 'Valid Title' },
    ]);
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Valid Title');
  });
});

describe('App component', () => {
  it('renders default Christmas list items from items.json dynamically', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Christmas List/i })).toBeInTheDocument();
    
    (rawItems as any[]).forEach((item) => {
      if (item.title) {
        expect(screen.getByText(item.title)).toBeInTheDocument();
      }
    });
  });

  it('renders labels without links as informational badges distinct from links', () => {
    const customItems = [
      {
        title: 'Road Biking Helmet',
        links: [
          { label: 'Giant Rev Comp MIPS' },
          { link: 'https://example.com/store' },
        ],
      },
    ];

    render(<App itemsOverride={customItems} />);

    const tag = screen.getByText('Giant Rev Comp MIPS');
    expect(tag).toBeInTheDocument();
    expect(tag.closest('a')).toBeNull();

    const link = screen.getByRole('link', { name: /example.com/i });
    expect(link).toHaveAttribute('href', 'https://example.com/store');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders descriptions when present and omits when absent', () => {
    const customItems = [
      { title: 'Item With Description', description: 'Very cozy blanket.' },
      { title: 'Item Without Description' },
    ];

    render(<App itemsOverride={customItems} />);

    expect(screen.getByText('Item With Description')).toBeInTheDocument();
    expect(screen.getByText('Very cozy blanket.')).toBeInTheDocument();
    expect(screen.getByText('Item Without Description')).toBeInTheDocument();
  });

  it('renders empty state when no items are present', () => {
    render(<App itemsOverride={[]} />);

    expect(screen.getByText(/No items listed yet/i)).toBeInTheDocument();
  });
});
