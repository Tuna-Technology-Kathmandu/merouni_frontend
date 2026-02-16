'use client'
import React, { useEffect, useRef, useState } from 'react'

const CKEditor4 = ({ onChange, initialData = '', id = 'editor1' }) => {
  const textareaRef = useRef(null)
  const [editorLoaded, setEditorLoaded] = useState(false)

  const editorRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.CKEDITOR) {
        const script = document.createElement('script')
        script.src = '/ckeditor/ckeditor.js'
        script.onload = () => setEditorLoaded(true)
        document.body.appendChild(script)
      } else {
        setEditorLoaded(true)
      }
    }
  }, [])

  useEffect(() => {
    if (editorLoaded && textareaRef.current && !editorRef.current) {
      // Destroy existing editor if somehow already exists
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy(true)
      }

      const editor = window.CKEDITOR.replace(id, {
        height: 300,
        extraPlugins: '',
        removePlugins: 'image,uploadimage,easyimage,cloudservices'
      })

      editorRef.current = editor

      editor.on('change', () => {
        const data = editor.getData()
        onChange && onChange(data)
      })

      editor.setData(initialData)
    }
    return () => {
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy(true)
        editorRef.current = null
      }
    }
  }, [editorLoaded, id])

  // Optional: update editor content only if `initialData` changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.getData() !== initialData) {
      editorRef.current.setData(initialData)
    }
  }, [initialData])

  return (
    <div>
      <textarea
        id={id}
        ref={textareaRef}
        defaultValue={initialData}
        rows='10'
        cols='80'
      />
    </div>
  )
}
export default CKEditor4
