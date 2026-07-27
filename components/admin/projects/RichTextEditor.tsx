"use client";

import { useEffect, useRef } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3, 
  Type, 
  RefreshCw 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isFocusedRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg = "") => {
    document.execCommand(command, false, arg);
    handleInput();
    editorRef.current?.focus();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:border-slate-400 transition-all flex flex-col min-h-[140px]">
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-editor-area[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        .rich-editor-area ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .rich-editor-area ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .rich-editor-area h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
          color: #0f172a;
        }
        .rich-editor-area h3 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
          color: #1e293b;
        }
      `}} />

      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap gap-1 items-center select-none">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
        
        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "h2")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "h3")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "p")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Paragraph"
        >
          <Type className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        
        <div className="w-px h-5 bg-slate-200 mx-1" />
        
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          className="p-1.5 rounded text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          title="Clear Formatting"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => { isFocusedRef.current = true; }}
        onBlur={() => { 
          isFocusedRef.current = false; 
          handleInput();
        }}
        className="rich-editor-area flex-1 p-3.5 text-slate-900 outline-none min-h-[170px] text-xs leading-relaxed overflow-y-auto font-sans"
        data-placeholder={placeholder}
      />
    </div>
  );
}
