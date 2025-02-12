# staticseek-react

A React component wrapper for [staticseek], providing easy integration of full-text search capabilities into React applications.

## Installation

```bash
npm install staticseek-react
```

## Quick Start

```jsx
import StaticSeek from 'staticseek-react';

function App() {
  return (
    <StaticSeek 
      query="search term" 
      indexUrl="/searchindex.json"
      suspense={<div>Loading...</div>}
    >
      {(results) => (
        <ul>
          {results.map(result => (
            <li key={result.id}>{result.key.title}</li>
          ))}
        </ul>
      )}
    </StaticSeek>
  );
}
```

## Component API

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| query | string | Yes | The search query to execute |
| indexUrl | string | Yes | URL to the pre-generated search index JSON file |
| suspense | ReactNode | Yes | Component to show while loading the index |
| children | (results: SearchResult[]) => ReactNode | Yes | Render function for search results |

### Types

```typescript
type SearchResult = {
    id: number;
    key: Record<string, unknown>;
    score: number;
    refs: Reference[];
};

type Reference = {
    token: string;
    path: string;
    pos?: number;
    wordaround?: string;
    distance: number;
};
```

## Complete Example

Here's a complete example showing how to implement a search interface with staticseek-react:

```typescript
import { type JSX, useState } from "react";
import type { SearchResult } from "staticseek";
import StaticSeek from "staticseek-react";

// Define the structure of your search result keys
type SearchKey = {
    slug: string;
    data: {
        title: string;
    };
};

// Component to render search results
function StaticSeekResult(result: SearchResult[]): JSX.Element {
    const lis = result.map((item) => {
        const key = item.key as SearchKey;
        return (
            <li key={key.slug}>
                <h3>{key.data.title}</h3>
                <p>{item.refs[0].wordaround}</p>
            </li>
        );
    });

    return (
        <>
            <h2>Results</h2>
            <ul>{result.length > 0 ? lis : <li>No results found.</li>}</ul>
        </>
    );
}

// Main application component
function App() {
    const [query, setQuery] = useState<string>("");
    const [trigger, setTrigger] = useState<boolean>(false);

    function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        setTrigger(true);
    }

    return (
        <main>
            <div className="input-area">
                <div>Search</div>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Type your search query..."
                    onChange={onChangeInput}
                />
            </div>
            {trigger && (
                <StaticSeek 
                    query={query} 
                    indexUrl="searchindex.json" 
                    suspense={<div>Loading index...</div>}
                >
                    {StaticSeekResult}
                </StaticSeek>
            )}
        </main>
    );
}
```

## Generating the Search Index

Before using staticseek-react, you need to generate a search index. Here's how to create one:

```javascript
import { LinearIndex, createIndex, indexToObject } from 'staticseek';
import fs from 'fs';

// Your content array
const articles = [
    {
        slug: "getting-started",
        content: "Welcome to our documentation...",
        data: {
            title: "Getting Started Guide",
            description: "Learn how to get started..."
        }
    }
    // ... more articles
];

// Create the index
const index = createIndex(LinearIndex, articles, {
    key_fields: ['slug', 'data.title'],
    search_targets: ['content', 'data.title', 'data.description']
});

// Convert to serializable object and save
const indexObject = indexToObject(index);
fs.writeFileSync('public/searchindex.json', JSON.stringify(indexObject));
```

## Advanced Features

### Query Syntax

staticseek-react supports all the search features from staticseek:

- Fuzzy Search: `distance:2 searchterm`
- Exact Match: `"exact phrase"`
- Boolean Operations: 
  - AND: `term1 term2`
  - OR: `term1 OR term2`
  - NOT: `-term1 term2`
- Field-Specific: `from:title searchterm`
- Custom Weights: `from:title weight:2.5 searchterm`

### Performance Optimization

For better performance with large datasets, consider:

1. Using GPU-accelerated search:
```javascript
import { GPULinearIndex } from 'staticseek';

const index = createIndex(GPULinearIndex, articles);
```

2. Using optimized index for CJK languages:
```javascript
import { HybridBigramInvertedIndex } from 'staticseek';

const index = createIndex(HybridBigramInvertedIndex, articles);
```

## Browser Support

staticseek-react requires browsers that support:
- ES6+ features
- `Intl.Segmenter` for proper Unicode handling
- WebGPU (optional, for GPU-accelerated search)

## License

MIT

[staticseek]: https://github.com/osawa-naotaka/staticseek