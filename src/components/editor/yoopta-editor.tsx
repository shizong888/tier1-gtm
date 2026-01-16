'use client';

import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { markdown } from '@yoopta/exports';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Code from '@yoopta/code';
import Link from '@yoopta/link';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import { BulletedList, NumberedList } from '@yoopta/lists';
import { Bold, Italic, Strike, Underline } from '@yoopta/marks';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';

import { useEffect, useMemo, useRef } from 'react';

const MARKS = [Bold, Italic, Strike, Underline];

const plugins = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Code,
  Link,
  BulletedList,
  NumberedList,
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
};

interface YooptaEditorWrapperProps {
  value: string;
  onChange: (markdown: string) => void;
}

export function YooptaEditorWrapper({ value, onChange }: YooptaEditorWrapperProps) {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const initialized = useRef(false);

  // Initialize editor with markdown content
  useEffect(() => {
    if (!initialized.current && value) {
      try {
        const yooptaValue = markdown.deserialize(editor, value);
        editor.setEditorValue(yooptaValue);
        initialized.current = true;
      } catch (error) {
        console.error('Failed to deserialize markdown:', error);
      }
    }
  }, [editor, value]);

  const handleChange = (editorValue: any) => {
    try {
      const markdownContent = markdown.serialize(editor, editorValue);
      onChange(markdownContent);
    } catch (error) {
      console.error('Failed to serialize markdown:', error);
    }
  };

  return (
    <div
      ref={selectionRef}
      className="yoopta-editor-wrapper bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden"
    >
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        marks={MARKS}
        tools={TOOLS}
        selectionBoxRoot={selectionRef}
        onChange={handleChange}
        autoFocus={false}
        placeholder="Start writing your content..."
        style={{
          width: '100%',
          minHeight: 'calc(100vh - 500px)',
          padding: '24px',
        }}
      />
    </div>
  );
}
