'use client'

import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const RichTextEditor = ({ value, onChange, placeholder }) => {
    return (
        <div className='rich-text-editor'>
            <CKEditor
                editor={ClassicEditor}
                
                data={value || ''}
                config={{
                    placeholder: placeholder
                }}
                onChange={(event, editor) => {
                    const data = editor.getData()
                    onChange(data)
                }}
            />
            <style jsx global>{`
        .ck-editor__editable {
          min-height: 200px;
        }
      `}</style>
        </div>
    )
}

export default RichTextEditor
