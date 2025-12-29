import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm'; // Optional: for GitHub Flavored Markdown
import mermaid from 'mermaid';
// import { renderToStaticMarkup } from 'react-dom/server';
// import { convert } from 'html-to-markdown';
import TurndownService from 'turndown';

// Import the markdown file (bundler handles the path)
import markdownFilePath from '../README.md';

// export default function About() {
//     return <h2 style={{ color: 'white' }}>About</h2>;
// }

interface MermaidChartProps {
  chartDefinition: string; // The Mermaid markdown text
  id: string; // A unique ID for the container element
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chartDefinition, id }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic initialization for mermaid
    mermaid.initialize({
      startOnLoad: false, // Prevent mermaid from scanning the entire document automatically
      theme: 'neutral', // Optional: choose a theme
      // Add other configurations as needed
    });

    if (chartRef.current) {
      try {
        // Clear previous content
        chartRef.current.innerHTML = chartDefinition;

        // // Render the new chart using the API
        // // The render function takes an ID and the chart definition
        // mermaid.render(id, chartDefinition, (svgCode) => {
        //   chartRef.current!.innerHTML = svgCode;
        // });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    }
  }, [chartDefinition, id]); // Re-run effect if the chart definition or ID changes

  return <div id={id} ref={chartRef} className="mermaid" />;
};

const convertHtmlToMarkdown = (html: string): string => {
  const turndownService = new TurndownService();
  console.log(`convertHtmlToMarkdown: original html: ${html}`);
  const markdownOutput = turndownService.turndown(html);
  console.log(`convertHtmlToMarkdown: converted markdown: ${markdownOutput}`);
  return markdownOutput;
};

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
  const [markdown, setMarkdown] = useState('');

//   const markdownFilePath = '../../README.md';

  const mermaidFlowchartDefinition = `
    graph LR
        Browser[Browser / React SPA]
        Browser -->|React Router| Routes[Routes: /, /game/:id, /notes]
        Browser -->|POST / GET| APIGW[API Gateway (future)]
        APIGW --> Lambda[Lambda]
        Lambda --> DynamoDB[(DynamoDB)]
        CI[GitHub → AWS GitHub App]
        CI --> Amplify[Amplify (CI/CD + Hosting)]
        Amplify --> Browser
  `;

  const mermaidChart = (
    <MermaidChart 
      chartDefinition={mermaidFlowchartDefinition}
      id='readme-mermaid-flowchart-id'
    />
  )

  //   const mermaidMarkdownOutput = reactElementToMarkdown(mermaidChart);
  const mermaidMarkdownOutput = convertHtmlToMarkdown(mermaidChart.toString());

  useEffect(() => {
    // Fetch the content of the imported file path
    console.log(markdownFilePath);
    fetch(markdownFilePath)
      .then((response) => response.text(), (error) => console.error(error))
      .then((text) => {
        // text = text.replace(/```mermaid[\s\S]*```/g, `${mermaidMarkdownOutput}`);
        // console.log(mermaidMarkdownOutput);
        console.log(text);
        if (text) setMarkdown(text);
      });
  }, [mermaidMarkdownOutput]);

  return (
    <article className="prose"> {/* Optional: use a CSS class for styling like Tailwind's typography plugin */}
      <ReactMarkdown 
        // plugins={[remarkGfm]}
        // remarkPlugins={[remarkGfm]}
      >
        {markdown}
    </ReactMarkdown>
    </article>
  );
};

export default About;
