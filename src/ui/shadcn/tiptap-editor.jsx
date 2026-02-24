'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Table as TableIcon,
  Trash2,
  ImageIcon,
  Loader2,
  Globe,
  Upload,
  ChevronDown,
  Plus,
  Check,
  ListOrdered
} from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { cn } from '@/app/lib/utils'

const MenuBar = ({ editor, onMediaUpload, showImageUpload = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const menuRef = useRef(null);
  const linkMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (linkMenuRef.current && !linkMenuRef.current.contains(event.target)) {
        setIsLinkMenuOpen(false);
      }
    };
    if (isMenuOpen || isLinkMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isLinkMenuOpen]);

  if (!editor) return null;

  const handleLinkSubmit = (e) => {
    if (e) e.preventDefault();
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkMenuOpen(false);
    }
  }

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsLinkMenuOpen(false);
  }


  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        setIsMenuOpen(false)
        if (onMediaUpload) {
          setIsUploading(true)
          try {
            const url = await onMediaUpload(file)
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          } catch (error) {
            console.error('Image upload failed:', error)
          } finally {
            setIsUploading(false)
          }
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            editor.chain().focus().setImage({ src: e.target.result }).run()
          }
          reader.readAsDataURL(file)
        }
      }
    }
    input.click()
  }

  const handleImageUrlSubmit = (e) => {
    if (e) e.preventDefault();
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsMenuOpen(false);
    }
  }

  return (
    <>
      <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm'>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-[#387cae] text-white')}
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-[#387cae] text-white')}
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('underline') && 'bg-[#387cae] text-white')}
        >
          <UnderlineIcon className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm'>
        {[1, 2, 3, 4, 5, 6].map((level) => {
          const Icon = {
            1: Heading1,
            2: Heading2,
            3: Heading3,
            4: Heading4,
            5: Heading5,
            6: Heading6,
          }[level]
          return (
            <Button
              key={level}
              type='button'
              size='sm'
              variant={editor.isActive('heading', { level }) ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              className={cn('h-8 w-8 p-0', editor.isActive('heading', { level }) && 'bg-[#387cae] text-white')}
              title={`Heading ${level}`}
            >
              <Icon className='h-4 w-4' />
            </Button>
          )
        })}
      </div>

      <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm'>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-[#387cae] text-white')}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-[#387cae] text-white')}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm'>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'left' }) && 'bg-[#387cae] text-white')}
        >
          <AlignLeft className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'center' }) && 'bg-[#387cae] text-white')}
        >
          <AlignCenter className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          size='sm'
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'right' }) && 'bg-[#387cae] text-white')}
        >
          <AlignRight className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm'>
        <div className="relative" ref={linkMenuRef}>
          <Button
            type='button'
            size='sm'
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            onClick={() => {
              if (editor.isActive('link')) {
                // Pre-fill URL when editing
                setLinkUrl(editor.getAttributes('link').href || '');
              }
              setIsLinkMenuOpen(!isLinkMenuOpen);
            }}
            className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-[#387cae] text-white')}
            title='Add Link'
          >
            <LinkIcon className='h-4 w-4' />
          </Button>

          {isLinkMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in duration-200 shadow-[#387cae]/5">
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link URL</label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleLinkSubmit();
                        }
                      }}
                      autoFocus
                      className="h-9 text-xs bg-gray-50 border-gray-100 focus:bg-white"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleLinkSubmit}
                      className="h-9 px-3 bg-[#387cae] hover:bg-[#387cae]/90"
                      disabled={!linkUrl}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {editor.isActive('link') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLink}
                    className="w-full justify-start gap-2 h-8 text-red-500 hover:text-red-600 hover:bg-red-50 text-[10px] font-bold"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Unset Link
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm'>
        <Button
          type='button'
          size='sm'
          variant='ghost'
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className='h-8 w-8 p-0 hover:text-[#387cae] hover:bg-[#387cae]/5'
          title='Insert Table'
        >
          <TableIcon className='h-4 w-4' />
        </Button>
      </div>

      {showImageUpload && (
        <div className='relative' ref={menuRef}>
          <Button
            type='button'
            size='sm'
            variant='outline'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'h-8 px-3 flex items-center gap-2 transition-all',
              isMenuOpen ? 'border-[#387cae] bg-[#387cae]/5' : 'border-[#387cae]/20 hover:border-[#387cae] hover:bg-[#387cae]/5'
            )}
            title='Insert Image'
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <>
                <ImageIcon className='h-4 w-4 text-[#387cae]' />
                <span className='text-xs font-bold text-[#387cae]'>Image</span>
                <ChevronDown className={cn("h-3 w-3 text-[#387cae]/50 transition-transform", isMenuOpen && "rotate-180")} />
              </>
            )}
          </Button>

          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in duration-200 shadow-[#387cae]/5">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Upload from computer</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleImageUpload}
                    className="w-full justify-start gap-2 h-10 border border-dashed border-gray-200 hover:border-[#387cae] hover:bg-[#387cae]/5 text-gray-600 hover:text-[#387cae]"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-xs font-semibold">Select Files</span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold">
                    <span className="bg-white px-2 text-gray-400">OR</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Image URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleImageUrlSubmit();
                          }
                        }}
                        className="h-9 px-8 text-xs bg-gray-50 border-gray-100 focus:bg-white"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleImageUrlSubmit}
                      className="h-9 px-3 bg-[#387cae] hover:bg-[#387cae]/90"
                      disabled={!imageUrl}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default function TipTapEditor({ value, onChange, onMediaUpload, placeholder = 'Write something...', showImageUpload = false, height = '400px' }) {
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
          class: 'text-[#387cae] underline cursor-pointer',
        },
      }),
      Image.configure({
        allowBase64: true,
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
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      // Use a small timeout or check to avoid interrupting the user
      // or simply rely on the fact that useEffect runs after render
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  return (
    <div className='border border-gray-200 rounded-xl bg-white flex flex-col focus-within:ring-2 focus-within:ring-[#387cae]/10 focus-within:border-[#387cae] transition-all shadow-sm'>
      <div className='flex flex-wrap items-center gap-2 p-2 border-b border-gray-100 bg-gray-50/50 rounded-t-xl'>
        <MenuBar editor={editor} onMediaUpload={onMediaUpload} showImageUpload={showImageUpload} />
      </div>
      <div
        className="overflow-y-auto custom-scrollbar cursor-text"
        style={{ minHeight: '200px', height: height }}
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent
          editor={editor}
          className='[&_.ProseMirror]:p-6 [&_.ProseMirror]:min-h-full [&_.ProseMirror]:text-gray-800 [&_.ProseMirror]:text-base [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:outline-none [&_.ProseMirror>*]:mb-4 [&_.ProseMirror>*:last-child]:mb-0 [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-8 [&_.ProseMirror_h1]:text-gray-900 [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:text-gray-900 [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:text-gray-900 [&_.ProseMirror_h4]:text-xl [&_.ProseMirror_h4]:font-bold [&_.ProseMirror_h4]:mt-4 [&_.ProseMirror_h4]:text-gray-900 [&_.ProseMirror_h5]:text-lg [&_.ProseMirror_h5]:font-bold [&_.ProseMirror_h5]:mt-4 [&_.ProseMirror_h5]:text-gray-900 [&_.ProseMirror_h6]:text-base [&_.ProseMirror_h6]:font-bold [&_.ProseMirror_h6]:mt-4 [&_.ProseMirror_h6]:text-gray-900 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:table-auto [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:my-6 [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-200 [&_.ProseMirror_td]:p-3 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-200 [&_.ProseMirror_th]:p-3 [&_.ProseMirror_th]:bg-gray-50 [&_.ProseMirror_th]:font-bold [&_.ProseMirror_a]:text-[#387cae] [&_.ProseMirror_a]:underline [&_.ProseMirror_img]:my-6 [&_.ProseMirror_img]:rounded-xl [&_.ProseMirror_img]:shadow-lg [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0'
        />
      </div>
    </div>
  )
}