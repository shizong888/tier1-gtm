'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
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
        fontSize: '14px',
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

    if (ref.current) {
      ref.current.innerHTML = chart;
      mermaid.run({
        nodes: [ref.current],
      });
    }
  }, [chart]);

  return (
    <div className="my-16 p-8 bg-neutral-950/50 border border-neutral-800 rounded-sm overflow-x-auto">
      <div ref={ref} className="mermaid-diagram flex justify-center" />
    </div>
  );
}
