'use client'
import React, { useEffect, useRef, useState } from 'react'

const CKUni = ({ onChange, initialData = '', id = 'editor1' }) => {
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

  // Initialize CKEditor only once
  useEffect(() => {
    if (editorLoaded && textareaRef.current && !editorRef.current) {
      const editor = window.CKEDITOR.replace(id, {
        height: 300,
        extraPlugins: '',
        removePlugins: 'image,uploadimage,easyimage,cloudservices'
      })

      window.CKEDITOR.on('dialogDefinition', function (ev) {
        const dialogName = ev.data.name
        const dialogDefinition = ev.data.definition

        if (dialogName === 'image') {
          const infoTab = dialogDefinition.getContents('info')
          const previewField = infoTab.get('preview')
          dialogDefinition.onShow = function () {
            const dialog = this
            const previewElement = dialog.getContentElement('info', 'preview')
            if (previewElement && previewElement.getElement()) {
              previewElement
                .getElement()
                .setHtml(
                  '<div style="text-align:center; color:#999;">No preview available</div>'
                )
            }
          }

          if (previewField) {
            previewField.html =
              '<div style="text-align:center; color:#999;">No preview available</div>'
          }
        }
      })

      editor.on('change', () => {
        const data = editor.getData()
        onChange && onChange(data)
      })

      editor.setData(initialData)
      editorRef.current = editor
    }
  }, [editorLoaded, id])

  // Only update data, not recreate the editor
  useEffect(() => {
    if (editorRef.current && initialData !== editorRef.current.getData()) {
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

export default CKUni
