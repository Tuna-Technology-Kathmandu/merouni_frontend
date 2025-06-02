'use client'
import React, { useEffect, useRef, useState } from 'react'

const CKEditor4 = ({ onChange, initialData = '', id = 'editor1' }) => {
  const textareaRef = useRef(null)
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
      // Destroy existing editor for this ID
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy(true)
      }

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

          // Ensure preview area is empty when dialog opens
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

          // Optional: prevent default lorem ipsum from being set
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
    }
  }, [editorLoaded, id, initialData])

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
