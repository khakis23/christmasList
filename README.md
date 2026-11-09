# Christmas List

A fast, minimal, mobile-friendly single-page Christmas list.

## Adding or Editing Items

Open [`items.json`](./items.json) in the root directory and add items directly to the list:

```json
[
  {
    "title": "Item name",
    "description": "Optional notes, sizes, color preferences, etc.",
    "links": [
      { "label": "Store Name", "url": "https://example.com" }
    ]
  }
]
```

### Supported Item Fields
- `title` *(required)*: The name of the item.
- `description` *(optional)*: Details such as size, color, or notes.
- `links` *(optional)*: An array of links. Each can be:
  - An object with `label` and `url`: `{ "label": "Amazon", "url": "https://..." }`
  - A plain string URL: `"https://..."` (the site domain will be automatically displayed as the label).
- `link` *(optional)*: A single link if you only have one store URL.

## Development

```bash
# Start local development server
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. Push your repository to GitHub.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Pushing to `main` will automatically build and publish your Christmas list.
