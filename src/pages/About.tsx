import React, { Suspense, useState, useEffect, useRef } from 'react'; // + useRef, useMemo
import ReactMarkdown from 'react-markdown'; // npm install react-markdown 
// react-markdown plugins
import remarkGfm from 'remark-gfm'; // Optional: for GitHub Flavored Markdown, Not Necessary ?? 
import mermaid from 'mermaid'; // npm install mermaid 
// import rehypeMermaid from 'rehype-mermaid'; // npm install rehype-mermaid

// import { renderToStaticMarkup } from 'react-dom/server';
// import { convert } from 'html-to-markdown'; // npm install @wcj/html-to-markdown ??? 

// import TurndownService from 'turndown';

// Import the markdown file (bundler handles the path)
import markdownFilePath from '../README.md';
// WHY ISN'T THIS WORKING??? It was the AWS Amplify Redirect/Rewrite smh 

import * as functions from '../utils/functions.ts';


// // MermaidChart + convertHtmlToMarkdown not necessary with rehype-mermaid plugin ... FAIL 
interface MermaidChartProps {
  chart: string; // The Mermaid markdown text
  id: string; // A unique ID for the container element
}

// const MermaidChart: React.FC<MermaidChartProps> = ({ chartDefinition, id }) => {
//   const chartRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Basic initialization for mermaid
//     mermaid.initialize({
//       startOnLoad: false, // Prevent mermaid from scanning the entire document automatically
//       theme: 'neutral', // Optional: choose a theme
//       // Add other configurations as needed
//     });

//     if (chartRef.current) {
//       try {
//         // Clear previous content
//         chartRef.current.innerHTML = chartDefinition;

//         // // Render the new chart using the API
//         // // The render function takes an ID and the chart definition
//         // mermaid.render(id, chartDefinition, (svgCode) => {
//         //   chartRef.current!.innerHTML = svgCode;
//         // });
//       } catch (error) {
//         console.error('Mermaid rendering error:', error);
//       }
//     }
//   }, [chartDefinition, id]); // Re-run effect if the chart definition or ID changes

//   return <div id={id} ref={chartRef} className="mermaid" />;
// };


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




// const convertHtmlToMarkdown = (html: string): string => {
//   const turndownService = new TurndownService();
// //   console.log(`convertHtmlToMarkdown: original html: ${JSON.stringify(html)}`);
//   const markdownOutput = turndownService.turndown(html);
// //   console.log(`convertHtmlToMarkdown: converted markdown: ${JSON.stringify(markdownOutput)}`);
//   return markdownOutput;
// };



// // Function to convert React Element to Markdown string
// const reactElementToMarkdown = (element: React.ReactElement): string => {
//   // 1. Convert React element to a static HTML string
//   const htmlString = renderToStaticMarkup(element);

//   console.log(htmlString);

//   // 2. Convert the HTML string to Markdown
//   // 'convert' takes an HTML string and options for conversion
//   const markdownString = convert(htmlString, {
//     // You can specify options here, e.g., to handle specific HTML tags
//     // For basic use, default options work well.
//   });

//   console.log(markdownString);

//   return markdownString;
// };

const About = () => {
  const [markdownComponentList, setMarkdownComponentList] = useState<React.ReactElement[]>([]);

  const addMarkdownComponent = (markdown: React.ReactElement) => {
    setMarkdownComponentList((list) => [...list, markdown])
  }

// not necessary with rehype-mermaid plugin 
//   const mermaidFlowchartDefinition = `
//     graph LR
//         Browser[Browser / React SPA]
//         Browser -->|React Router| Routes[Routes: /, /game/:id, /notes]
//         Browser -->|POST / GET| APIGW[API Gateway]
//         APIGW --> Lambda[Lambda]
//         Lambda --> DynamoDB[(DynamoDB)]
//         CI[GitHub → AWS GitHub App]
//         CI --> Amplify[Amplify]
//         Amplify --> Browser
//   `;

//   // let mermaidChart: React.ReactElement; 
//   const mermaidChart = useMemo((() => {
//     return (
//         <MermaidChart 
//         chartDefinition={mermaidFlowchartDefinition}
//         id='readme-mermaid-flowchart-id'
//         />
//     )
//   }), [mermaidFlowchartDefinition]);
  

  // const mermaidMarkdownOutput = reactElementToMarkdown(mermaidChart); // html-to-markdown + react-dom/server
//   const mermaidStaticHTML = renderToStaticMarkup(mermaidChart);
//   const mermaidMarkdownOutput = convertHtmlToMarkdown(mermaidStaticHTML);

  useEffect(() => {
    // // Fetch the content of the imported file path
    // let filePathToFetch = process.env.PUBLIC_URL + '/resources/README.md'; // markdownFilePath;
    // // console.log("PUBLIC_URL: " + process.env.PUBLIC_URL);
    // // console.log("PWD: " + process.env.PWD);
    // const matcher: RegExp = /\/static\/media\/README/;
    // console.log(markdownFilePath);
    // if (markdownFilePath.match(matcher)) {
    //     console.log(`${markdownFilePath} matches ${matcher}`);
    //     // filePathToFetch = process.env.PUBLIC_URL + '/README.md';
    //     filePathToFetch = markdownFilePath;
    // } else {
    //     console.log(`No match between ${matcher} and ${markdownFilePath}`);
    // }
    fetch(markdownFilePath)
        .then((response) => {
            // console.log(response);
            return response.text()
        }, (error) => {
            console.error(error)
            throw Error();
        }).then((text) => {
            // console.log(mermaidChart);
            // console.log(mermaidStaticHTML);
            // console.log(mermaidMarkdownOutput);
            // text = text.replace(/```mermaid[\s\S]*```/g, `${mermaidMarkdownOutput}`);
            // console.log(mermaidMarkdownOutput);
            // console.log(text);

            // if (text) setMarkdown(text);

            const mermaidMatcherRegex: RegExp = /```mermaid[\s\S]*```/g;
            const nonMermaidMarkdown: string[] = text.split(mermaidMatcherRegex);
            const mermaidMarkdown: string[] = Array.from(text.matchAll(mermaidMatcherRegex)).map(match => match[0]);

            mermaidMarkdown.forEach(str => console.log(str));
            
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
                        <pre className="mermaid">
                            <MermaidChart 
                                chart={markdown}
                                id={`readme-mermaid-flowchart-id-${index}`}
                                key={`readme-mermaid-flowchart-id-${index}`}
                            />
                        </pre>
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
            <Suspense fallback={<div>Loading Mermaid diagram...</div>}>
                {/* <ReactMarkdown 
                    // plugins={[remarkGfm]}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[[rehypeMermaid, { mermaidConfig: { theme: 'default' } }]]}
                >
                    {markdown}
                </ReactMarkdown> */}
                {
                    markdownComponentList
                }
            </Suspense>
        </article>
        {/* {mermaidChart}
        <MermaidChart 
            chartDefinition={mermaidFlowchartDefinition}
            id='readme-mermaid-flowchart-id'
        /> */}
    </>
  );
};

export default About;
