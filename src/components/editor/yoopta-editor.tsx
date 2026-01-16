'use client';

import { useState, useEffect } from 'react';

interface YooptaEditorWrapperProps {
  value: string;
  onChange: (markdown: string) => void;
}

export function YooptaEditorWrapper({ value, onChange }: YooptaEditorWrapperProps) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden">
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Enter markdown content..."
        className="w-full h-[calc(100vh-280px)] bg-neutral-950 text-neutral-300 p-6 resize-none outline-none font-mono text-sm leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}
