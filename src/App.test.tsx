import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { normalizeItems, getDomainLabel, normalizeLink } from './utils';

describe('Utility: getDomainLabel & normalizeLink', () => {
  it('extracts domain name cleanly', () => {
    expect(getDomainLabel('https://www.amazon.com/dp/B08N5WRWNW')).toBe('amazon.com');
    expect(getDomainLabel('https://patagonia.com/product/123')).toBe('patagonia.com');
    expect(getDomainLabel('not-a-valid-url')).toBe('Link');
  });

  it('normalizes string links', () => {
    const res = normalizeLink('https://www.lodgecastiron.com', 0);
    expect(res).toEqual({
      label: 'lodgecastiron.com',
      url: 'https://www.lodgecastiron.com',
    });
  });

  it('normalizes object links with custom labels', () => {
    const res = normalizeLink({ label: 'Store Link', url: 'https://example.com' }, 0);
    expect(res).toEqual({
      label: 'Store Link',
      url: 'https://example.com',
    });
  });

  it('falls back to domain when object link has no label', () => {
    const res = normalizeLink({ url: 'https://fellowproducts.com' }, 0);
    expect(res).toEqual({
      label: 'fellowproducts.com',
      url: 'https://fellowproducts.com',
    });
  });
});

describe('Utility: normalizeItems', () => {
  it('handles empty or invalid data gracefully', () => {
    expect(normalizeItems([])).toEqual([]);
    expect(normalizeItems(null as any)).toEqual([]);
    expect(normalizeItems(undefined as any)).toEqual([]);
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

  it('correctly consolidates single link and multiple links without duplicates', () => {
    const items = normalizeItems([
      {
        title: 'Espresso Mug',
        link: 'https://example.com/mug',
        links: [
          'https://example.com/mug',
          { label: 'Alternative', url: 'https://example.com/alt' },
        ],
      },
    ]);
    expect(items[0].links.length).toBe(2);
    expect(items[0].links[0].url).toBe('https://example.com/mug');
    expect(items[0].links[1].label).toBe('Alternative');
  });
});

describe('App component', () => {
  it('renders default Christmas list items from items.json', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Christmas List/i })).toBeInTheDocument();
    expect(screen.getByText(/Merino Wool Beanie/i)).toBeInTheDocument();
    expect(screen.getByText(/Ceramic Pour-Over Dripper/i)).toBeInTheDocument();
    expect(screen.getByText(/Field Notes Expedition Notebooks/i)).toBeInTheDocument();
    expect(screen.getByText(/Cast Iron Skillet \(10-inch\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Espresso Coffee Beans/i)).toBeInTheDocument();
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

  it('renders clickable links with target="_blank" and rel="noopener noreferrer"', () => {
    const customItems = [
      {
        title: 'Book Recommendation',
        links: [
          { label: 'Local Indie Bookstore', url: 'https://indiebookstore.example' },
        ],
      },
    ];

    render(<App itemsOverride={customItems} />);

    const link = screen.getByRole('link', { name: /Local Indie Bookstore/i });
    expect(link).toHaveAttribute('href', 'https://indiebookstore.example');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders empty state when no items are present', () => {
    render(<App itemsOverride={[]} />);

    expect(screen.getByText(/No items listed yet/i)).toBeInTheDocument();
  });
});
