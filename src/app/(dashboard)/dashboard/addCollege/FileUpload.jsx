import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Label } from '@/ui/shadcn/label'
import { cn } from '@/app/lib/utils'

const FileUpload = ({
  onUploadComplete,
  label,
  defaultPreview = null,
  accept = 'image/*'
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(defaultPreview)
  const [fileType, setFileType] = useState(null)
  const fileInputRef = useRef(null)

  // Add useEffect to update preview when defaultPreview changes
  useEffect(() => {
    setPreview(defaultPreview)
    if (defaultPreview) {
      // Check if it's a PDF file
      if (defaultPreview.includes('.pdf') || defaultPreview.endsWith('.pdf')) {
        setFileType('pdf')
      } else {
        setFileType('image')
      }
    }
  }, [defaultPreview])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Create preview for images
    if (file.type.startsWith('image/')) {
      setFileType('image')
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf') {
      // For PDF files, set file type but don't create image preview
      setFileType('pdf')
      setPreview(file.name) // Store file name for display
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', file.name)
    formData.append('altText', file.name)
    formData.append('description', '')
    formData.append('file', file)
    formData.append('authorId', '1')

    try {
      const response = await axios.post(
        `${process.env.mediaUrl}${process.env.version}/media/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Response success
      const data = response.data

      if (data.success === false) {
        toast.error(data.message || 'Upload failed.')
        // Reset file input and preview on failure
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setPreview(defaultPreview)
        setFileType(null)
        return
      }

      toast.success('File uploaded successfully!')
      onUploadComplete(data.media.url)
    } catch (error) {
      console.error('Upload failed:', error)

      // Reset file input and preview on error
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setPreview(defaultPreview)
      setFileType(null)

      if (error.response) {
        toast.error(error.response.data?.message || 'Upload failed.')
      } else if (error.request) {
        toast.error('No response from server.')
      } else {
        toast.error('Error: ' + error.message)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    setPreview(null)
    setFileType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onUploadComplete('')
  }

  return (
    <div className='space-y-2'>
      {label && <Label>{label}</Label>}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 transition-all duration-200',
          'border-input bg-background/50 hover:bg-muted/30 hover:border-ring/40',
          isUploading && 'opacity-60 cursor-not-allowed',
          preview ? 'border-primary/20 bg-primary/[0.02]' : 'border-input'
        )}
      >
        <div className='flex flex-col items-center justify-center min-h-[120px]'>
          {!preview && !isUploading && (
            <div className='flex flex-col items-center animate-in fade-in zoom-in duration-300'>
              <Upload className='h-8 w-8 text-muted-foreground mb-3 opacity-60' />
              <div className='text-sm text-center'>
                <label className='cursor-pointer text-primary hover:underline font-medium'>
                  Click to upload
                  <input
                    ref={fileInputRef}
                    type='file'
                    className='hidden'
                    onChange={handleFileUpload}
                    accept={accept}
                    disabled={isUploading}
                  />
                </label>
                <span className='text-muted-foreground ml-1'>
                  or drag and drop
                </span>
              </div>
            </div>
          )}

          {isUploading && (
            <div className='flex flex-col items-center animate-in fade-in duration-300'>
              <Loader2 className='h-8 w-8 text-primary animate-spin mb-3' />
              <span className='text-sm font-medium text-muted-foreground'>
                Uploading...
              </span>
            </div>
          )}

          {preview && !isUploading && (
            <div className='w-full animate-in fade-in slide-in-from-bottom-2 duration-300'>
              <div className='flex items-center justify-between mb-3 px-1'>
                <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70'>
                  {fileType === 'pdf' ? 'PDF Document' : 'Image Preview'}
                </span>
                <button
                  onClick={handleRemove}
                  className='p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors'
                  title='Remove file'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>

              {fileType === 'image' ? (
                <div className='relative mx-auto rounded-md overflow-hidden border shadow-sm bg-muted/20'>
                  <img
                    src={preview}
                    alt='Preview'
                    className='max-h-48 w-auto mx-auto object-contain'
                  />
                </div>
              ) : (
                <div className='flex items-center gap-3 p-3 bg-card border rounded-md shadow-sm mx-auto max-w-[340px]'>
                  <div className='p-2 bg-muted rounded text-muted-foreground'>
                    <FileText className='h-5 w-5' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {preview}
                    </p>
                    {defaultPreview && (
                      <a
                        href={defaultPreview}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[11px] text-muted-foreground hover:text-primary transition-colors'
                      >
                        Open External File
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload
