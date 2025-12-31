import React, { Suspense, useState, useEffect, useRef } from 'react'; // + useRef, useMemo

import ReactMarkdown from 'react-markdown'; // npm install react-markdown 
// react-markdown plugins
import remarkGfm from 'remark-gfm'; // Optional: for GitHub Flavored Markdown, Not Necessary ?? 
import mermaid from 'mermaid'; // npm install mermaid 
// import rehypeMermaid from 'rehype-mermaid'; // npm install rehype-mermaid

// Import the markdown file (bundler handles the path)
// Had to update the Amplify Rewrite/Redirect rule to allow md 
import markdownFilePath from '../README.md';

import * as functions from '../utils/functions.ts';

interface MermaidChartProps {
  chart: string; // The Mermaid markdown text
  id: string; // A unique ID for the container element
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

    // Render the chart when the component mounts or updates
    mermaid.render(id, chart)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch((err) => {
        console.error('Mermaid render error:', err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre>Error: ${String(err)}</pre>`;
        }
      });

      // Cleanup function (optional but good practice for SPAs)
      return () => {
          // Any necessary cleanup
      };
  }, [chart, id]); // Rerender if chart or id changes

  return <div ref={containerRef} id={id} />;
};

const About = () => {
  const [markdownComponentList, setMarkdownComponentList] = useState<React.ReactElement[]>([]);

  const addMarkdownComponent = (markdown: React.ReactElement) => {
    setMarkdownComponentList((list) => [...list, markdown])
  }

//   // let mermaidChart: React.ReactElement; 
//   const mermaidChart = useMemo((() => {
//     return (
//         <MermaidChart 
//         chart={mermaidFlowchartDefinition}
//         id='readme-mermaid-flowchart-id'
//         />
//     )
//   }), [mermaidFlowchartDefinition]);
  

  useEffect(() => {
    // // console.log("PUBLIC_URL: " + process.env.PUBLIC_URL);
    // // console.log("PWD: " + process.env.PWD);

    fetch(markdownFilePath)
        .then((response) => {
            // console.log(response);
            return response.text()
        }, (error) => {
            console.error(error)
            throw Error();
        }).then((text) => {
            // if (text) setMarkdown(text);

            const mermaidMatcherRegex: RegExp = /```mermaid[\s\S]*?```/g; 
            // (?!```) negative lookahead for triple backtick 
            // [\s\S] match any whitespace-character, including newlines (\s), or any non-whitespace character (\S)
            // *? match 0 or more of the preceding character, but match as few characters as possible 
            const nonMermaidMarkdown: string[] = text.split(mermaidMatcherRegex);
            const mermaidMarkdown: string[] = Array.from(text.matchAll(mermaidMatcherRegex)).map(match => match[0]);

            // mermaidMarkdown.forEach(str => console.log(str));
            
            const nonMermaidMarkdownComponents = nonMermaidMarkdown
                .map((markdown, index) => {
                    return (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            // rehypePlugins={[[rehypeMermaid, { mermaidConfig: { theme: 'default' } }]]}
                            key={`readme-non-mermaid-markdown-id-${index}`}
                        >
                            {markdown}
                        </ReactMarkdown>
                    )
                });
            const mermaidMarkdownComponents = mermaidMarkdown
                .map((markdown, index) => {
                    return (
                        <Suspense fallback={<div>Loading Mermaid diagram...</div>}>
                            <pre className="mermaid">
                                <MermaidChart 
                                    chart={markdown}
                                    id={`readme-mermaid-flowchart-id-${index}`}
                                    key={`readme-mermaid-flowchart-id-${index}`}
                                />
                            </pre>
                        </Suspense>
                    )
                });
            
            const nonMermaidGoesFirst: boolean = 
                mermaidMarkdown.length === 0 || 
                mermaidMarkdown.length < nonMermaidMarkdown.length || 
                text.startsWith(nonMermaidMarkdown[0]);
            const markdownToRender = nonMermaidGoesFirst ? 
                functions.interleave(nonMermaidMarkdownComponents, mermaidMarkdownComponents) : 
                functions.interleave(mermaidMarkdownComponents, nonMermaidMarkdownComponents);
            
            markdownToRender.forEach((component) => addMarkdownComponent(component));
                
        }, (error) => {
            console.error(error);
        });
//   }, [mermaidChart, mermaidStaticHTML, mermaidMarkdownOutput]);
  }, []);

  return (
    <>
        <article className="prose"> {/* Optional: use a CSS class for styling like Tailwind's typography plugin */}
            {
                markdownComponentList
            }
        </article>
    </>
  );
};

export default About;
