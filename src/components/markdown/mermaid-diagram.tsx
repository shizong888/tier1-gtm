'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

let mermaidInitialized = false;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#d9ff00',
          primaryTextColor: '#000000',
          primaryBorderColor: '#d9ff00',
          lineColor: '#d9ff00',
          secondaryColor: '#262626',
          tertiaryColor: '#0a0a0a',
          background: '#0a0a0a',
          mainBkg: '#262626',
          secondBkg: '#1a1a1a',
          textColor: '#ffffff',
          fontSize: '18px',
          fontFamily: 'var(--font-meltmino), ui-sans-serif, system-ui',
        },
        flowchart: {
          htmlLabels: true,
          curve: 'linear',
          padding: 20,
          nodeSpacing: 80,
          rankSpacing: 80,
        },
      });
      mermaidInitialized = true;
    }

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div className="my-16 p-8 bg-neutral-950/50 border border-neutral-800 rounded-sm overflow-x-auto">
      <div
        ref={ref}
        className="mermaid-diagram flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
