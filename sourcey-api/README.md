# PF4J Sourcey API reference

This directory reproduces the static API reference published under `/api/`.

## Pinned inputs

- PF4J release: `3.15.0`
- PF4J commit: `2ce777013963706c868b79da1483270e2690afab`
- Sourcey: `3.6.5` (`sha512-Pq0UMFsMha5lYrA57iPiUxXe3usvpzbuOs8kawQydxFGUlGvasP9bPFF2gQpN9yWBTWpnIVlaxZamHEzdtj+1A==`)
- Moxygen: `2.1.12` (`sha512-jPDT933A9JJNDPXyy4HayCUYhMr9+42oB4n5OwIwcI8b8EX1n184lTRzvyLiNQuv386fj5Qp0F54u1RMTKvkzA==`)
- Node.js: 20 or newer
- Doxygen: tested with `1.15.0`

The npm dependency graph is pinned by `package-lock.json`. The build uses `npm ci --ignore-scripts`.

## Build

```bash
cd sourcey-api
npm run build:all
```

The script checks out the immutable PF4J release commit, generates Doxygen XML, builds the Sourcey site into `../api/`, copies the Sourcey license/third-party notice, and verifies page count, exact-commit source links, canonical URLs, search data, and local links.

Generated output is committed so GitHub Pages can publish it without adding a Node/Doxygen build step to the existing Jekyll site.
