'use client'
import React, { useEffect, useRef, useState } from 'react'

const CKExam = ({
  onChange,
  initialData = '',
  id = 'editor1',
  onEditorReady
}) => {
  const textareaRef = useRef(null)
  const editorRef = useRef(null)
  const [editorLoaded, setEditorLoaded] = useState(false)

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
    if (editorLoaded && textareaRef.current) {
      // Initialize CKEditor only if it's not initialized yet
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
        if (onChange) onChange(data) // Sync CKEditor data to React state
      })

      if (typeof onEditorReady === 'function') {
        onEditorReady(editor)
      }
    }
  }, [editorLoaded, id]) // Only run this when CKEditor is loaded and id is provided

  // Sync `initialData` with CKEditor data when it changes from the parent (ExamManager)
  useEffect(() => {
    if (editorRef.current && initialData !== undefined) {
      // Set the editor data only if it is different from the current content
      if (editorRef.current.getData() !== initialData) {
        editorRef.current.setData(initialData)
      }
    }
  }, [initialData]) // This effect runs only when initialData changes

  return (
    <div>
      <textarea
        id={id}
        ref={textareaRef}
        defaultValue={initialData} // Use defaultValue, uncontrolled textarea
        rows='10'
        cols='80'
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default CKExam
