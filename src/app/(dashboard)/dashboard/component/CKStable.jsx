'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'

const CKStable = React.memo(
  ({ value, onChange, id = 'stable-editor' }) => {
    const editorInstance = useRef(null)
    const [isEditorReady, setIsEditorReady] = useState(false)
    const textareaRef = useRef(null)

    // Initialize CKEditor
    useEffect(() => {
      const initEditor = () => {
        if (typeof window === 'undefined' || !window.CKEDITOR) return

        // Destroy previous instance if exists
        if (window.CKEDITOR.instances[id]) {
          window.CKEDITOR.instances[id].destroy(true)
        }

        // Create new instance
        editorInstance.current = window.CKEDITOR.replace(id, {
          height: 300,
          removePlugins: 'image,uploadimage,easyimage,cloudservices',
          extraAllowedContent: true,
          autoGrow_onStartup: true,
          autoGrow_minHeight: 300,
          autoGrow_maxHeight: 800
        })

        // Set initial data
        editorInstance.current.setData(value || '')

        // Setup change event
        editorInstance.current.on('change', () => {
          const data = editorInstance.current.getData()
          onChange(data)
        })

        editorInstance.current.on('instanceReady', () => {
          setIsEditorReady(true)
        })
      }

      if (!window.CKEDITOR) {
        const script = document.createElement('script')
        script.src = '/ckeditor/ckeditor.js'
        script.onload = initEditor
        document.body.appendChild(script)
      } else {
        initEditor()
      }

      return () => {
        if (window.CKEDITOR?.instances[id]) {
          window.CKEDITOR.instances[id].destroy(true)
        }
      }
    }, [id])

    // Update content when value prop changes
    useEffect(() => {
      if (
        isEditorReady &&
        editorInstance.current &&
        value !== editorInstance.current.getData()
      ) {
        editorInstance.current.setData(value || '')
      }
    }, [value, isEditorReady])

    return (
      <div className='ckeditor-container'>
        <textarea
          id={id}
          ref={textareaRef}
          style={{ display: 'none' }}
          defaultValue={value}
        />
        {!isEditorReady && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className='w-full p-2 border rounded min-h-[300px]'
          />
        )}
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if the initial value changes significantly
    return prevProps.value === nextProps.value
  }
)

export default CKStable
