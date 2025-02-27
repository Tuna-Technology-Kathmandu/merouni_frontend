import React, { useEffect } from "react";
import "prismjs/themes/prism.css";
import Prism from "prismjs";
import { useEditor, EditorContent } from "@tiptap/react";
import CodeBlock from "@tiptap/extension-code-block";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: size }).run();
        },
    };
  },
});

const RichTextEditor = ({ onEditorChange, initialContent = "" }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlock,
      TextStyle,
      FontSize,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      ListItem,
      OrderedList,
      BulletList,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Paragraph,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onEditorChange) {
        onEditorChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor) {
      Prism.highlightAll();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Toolbar */}
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-3 py-1 border rounded ${
          editor.isActive("codeBlock")
            ? "bg-gray-800 text-white"
            : "bg-gray-200"
        }`}
      >
        Code
      </button>

      <div className="mb-4 flex flex-wrap gap-2">
        {/* Bold, Italic */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 border rounded ${
            editor.isActive("bold") ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 border rounded ${
            editor.isActive("italic") ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
        >
          Italic
        </button>

        {/* Bullet & Ordered List */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 border rounded ${
            editor.isActive("bulletList")
              ? "bg-gray-800 text-white"
              : "bg-gray-200"
          }`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 border rounded ${
            editor.isActive("orderedList")
              ? "bg-gray-800 text-white"
              : "bg-gray-200"
          }`}
        >
          Ordered List
        </button>

        {/* Heading Selector */}
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            className={`px-3 py-1 border rounded ${
              editor.isActive("heading", { level })
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            H{level}
          </button>
        ))}

        {/* Paragraph */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1 border rounded ${
            editor.isActive("paragraph")
              ? "bg-gray-800 text-white"
              : "bg-gray-200"
          }`}
        >
          P
        </button>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="px-3 py-1 border rounded"
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="px-3 py-1 border rounded"
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="px-3 py-1 border rounded"
        >
          Right
        </button>

        {/* Font Size Input */}
        <select
          onChange={(e) =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
          className="px-3 py-1 border rounded"
        >
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>

        {/* Color Picker */}
        <input
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="w-10 h-8 border rounded"
        />

        {/* Table Actions */}
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          className="px-3 py-1 border rounded bg-blue-500 text-white"
        >
          Insert Table
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="px-3 py-1 border rounded bg-green-500 text-white"
        >
          Add Row
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="px-3 py-1 border rounded bg-green-500 text-white"
        >
          Add Column
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="px-3 py-1 border rounded bg-red-500 text-white"
        >
          Delete Row
        </button>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="px-3 py-1 border rounded bg-red-500 text-white"
        >
          Delete Column
        </button>
      </div>

      {/* Editor Content */}
      <div className="border rounded-lg p-4 bg-white min-h-[200px]">
        <EditorContent editor={editor} />
      </div>

      {/* Custom Styles for Lists & Tables */}
      <style jsx global>{`
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }

        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }

        .tiptap table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .tiptap th,
        .tiptap td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        .tiptap th {
          background-color: #f4f4f4;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
