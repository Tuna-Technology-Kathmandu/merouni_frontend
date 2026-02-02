'use client'
import React, { useEffect, useRef, useState } from 'react'

const CKSiteControl = ({ onChange, value = '', id = 'editor_site_control' }) => {
    const textareaRef = useRef(null)
    const editorRef = useRef(null)
    const [editorLoaded, setEditorLoaded] = useState(false)

    // Load script
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

    // Initialize Editor
    useEffect(() => {
        if (editorLoaded && textareaRef.current && !editorRef.current) {

            // Safe check: if an instance with this ID already exists, destroy it first
            if (window.CKEDITOR.instances[id]) {
                try {
                    window.CKEDITOR.instances[id].destroy(true);
                } catch (e) {
                    console.warn("Failed to destroy existing instance", e);
                }
            }

            const editor = window.CKEDITOR.replace(textareaRef.current, {
                height: 300,
                extraPlugins: '',
                removePlugins: 'image,uploadimage,easyimage,cloudservices',
                // Ensure ID match
            })

            // Basic Dialog config (keeping same as CKUni for consistency)
            window.CKEDITOR.on('dialogDefinition', function (ev) {
                const dialogName = ev.data.name
                const dialogDefinition = ev.data.definition

                if (dialogName === 'image') {
                    const infoTab = dialogDefinition.getContents('info')
                    const previewField = infoTab.get('preview')
                    if (previewField) {
                        previewField.html = '<div style="text-align:center; color:#999;">No preview available</div>'
                    }
                }
            })

            const handleEditorChange = () => {
                const data = editor.getData()
                if (onChange) {
                    onChange(data)
                }
            }

            editor.on('change', handleEditorChange)
            editor.on('blur', handleEditorChange)
            editor.on('key', () => {
                setTimeout(handleEditorChange, 10) // Small delay to capture keypress result
            })

            // Initial data
            editor.setData(value)
            editorRef.current = editor
        }

        // Cleanup function
        return () => {
            if (editorRef.current) {
                // Remove listeners to avoid leaks if we added global ones (we used window.CKEDITOR.on which is global)
                // Note: Removing global listeners in CKEditor 4 is tricky, but destroying the instance is key.
                const instance = editorRef.current;
                try {
                    instance.removeAllListeners();
                    instance.destroy();
                } catch (e) {
                    console.error("Error destroying CKEditor instance", e)
                }
                editorRef.current = null;
            }
        }
    }, [editorLoaded, id])

    // Handle external value changes
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.getData()) {
            // Only update if significantly different to avoid cursor jumps or loops
            // However, CKEditor usually handles setData gracefully.
            // Check if it's focused to avoid interrupting user? 
            // For now, simple check:
            editorRef.current.setData(value)
        }
    }, [value])

    return (
        <div>
            <textarea
                id={id}
                ref={textareaRef}
                defaultValue={value}
                rows='10'
                cols='80'
            />
        </div>
    )
}

export default CKSiteControl
