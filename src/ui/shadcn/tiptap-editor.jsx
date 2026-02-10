'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Table as TableIcon,
  Trash2
} from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { useState } from 'react'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  return (
    <div className='flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50'>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className='h-8 w-8 p-0'
      >
        <Bold className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className='h-8 w-8 p-0'
      >
        <Italic className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('underline') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className='h-8 w-8 p-0'
      >
        <UnderlineIcon className='h-4 w-4' />
      </Button>
      <div className='w-px h-8 bg-gray-300 mx-1' />
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className='h-8 w-8 p-0'
      >
        <Heading2 className='h-4 w-4' />
      </Button>
      <div className='w-px h-8 bg-gray-300 mx-1' />
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className='h-8 w-8 p-0'
      >
        <List className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className='h-8 w-8 p-0'
      >
        <ListOrdered className='h-4 w-4' />
      </Button>
      <div className='w-px h-8 bg-gray-300 mx-1' />
      <Button
        type='button'
        size='sm'
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className='h-8 w-8 p-0'
      >
        <AlignLeft className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className='h-8 w-8 p-0'
      >
        <AlignCenter className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        size='sm'
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className='h-8 w-8 p-0'
      >
        <AlignRight className='h-4 w-4' />
      </Button>
      <div className='w-px h-8 bg-gray-300 mx-1' />
      <Button
        type='button'
        size='sm'
        variant={editor.isActive('link') ? 'default' : 'outline'}
        onClick={addLink}
        className='h-8 w-8 p-0'
        title='Add Link'
      >
        <LinkIcon className='h-4 w-4' />
      </Button>
      {editor.isActive('link') && (
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={removeLink}
          className='h-8 w-8 p-0'
          title='Remove Link'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      )}
      <div className='w-px h-8 bg-gray-300 mx-1' />
      <Button
        type='button'
        size='sm'
        variant='outline'
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className='h-8 w-8 p-0'
        title='Insert Table'
      >
        <TableIcon className='h-4 w-4' />
      </Button>
    </div>
  )
}

export default function TipTapEditor({ value, onChange, placeholder = 'Write something...' }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when value prop changes
  if (editor && value !== editor.getHTML()) {
    editor.commands.setContent(value || '')
  }

  return (
    <div className='border border-gray-200 rounded-md overflow-hidden bg-white'>
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className='[&_.ProseMirror]:p-4 [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:text-base [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:outline-none [&_.ProseMirror>*]:mb-3 [&_.ProseMirror>*:last-child]:mb-0 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:table-auto [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:my-4 [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-300 [&_.ProseMirror_td]:p-2 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-300 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_th]:bg-gray-100 [&_.ProseMirror_th]:font-bold [&_.ProseMirror_a]:text-blue-600 [&_.ProseMirror_a]:underline [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0'
      />
    </div>
  )
}
