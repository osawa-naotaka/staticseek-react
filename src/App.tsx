import { StrictMode } from "react";
import { type JSX, useState } from "react";
import { createRoot } from "react-dom/client";
import type { SearchResult } from "staticseek";
import StaticSeek from "../lib/StaticSeek.tsx";
import "./globals.css";

type SearchKey = {
    slug: string;
    data: {
        title: string;
    };
};

function StaticSeekResult(result: SearchResult[]): JSX.Element {
    const lis = result.map((item) => {
        const key = item.key as SearchKey;
        return (
            <li key={key.slug}>
                <h3>{key.data.title as string}</h3>
                <p>{item.refs[0].wordaround}</p>
            </li>
        );
    });

    return (
        <>
            <h2>results</h2>
            <ul>{result.length > 0 ? lis : <li>No results found.</li>}</ul>
        </>
    );
}

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
                <div>search</div>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="type your search query in English..."
                    onChange={onChangeInput}
                />
            </div>
            {trigger && (
                <StaticSeek query={query} indexUrl="searchindex.json" suspense={<div>Loading index...</div>}>
                    {StaticSeekResult}
                </StaticSeek>
            )}
        </main>
    );
}

// biome-ignore lint: no-unsafe-assignment
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
