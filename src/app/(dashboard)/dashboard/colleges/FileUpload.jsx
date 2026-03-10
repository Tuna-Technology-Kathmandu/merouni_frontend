import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Label } from '@/ui/shadcn/label'
import { cn } from '@/app/lib/utils'

const FileUpload = ({
  onUploadComplete,
  onFileSelect,
  label,
  required = false,
  defaultPreview = null,
  accept = 'image/*',
  extraData = {},
  autoUpload = false,
  authorId = '1' // Added support for dynamic authorId
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(defaultPreview)
  const [fileType, setFileType] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [description, setDescription] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    setPreview(defaultPreview)
    if (defaultPreview) {
      if (defaultPreview.includes('.pdf') || defaultPreview.endsWith('.pdf')) {
        setFileType('pdf')
      } else {
        setFileType('image')
      }
    }
  }, [defaultPreview])

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setDescription('') // Reset description for new file
    if (onFileSelect) onFileSelect(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      setFileType('image')
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        if (autoUpload) {
          // Trigger upload immediately after preview is ready
          handleFileUploadWithFile(file)
        }
      }
      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf') {
      setFileType('pdf')
      setPreview(file.name)
      if (autoUpload) handleFileUploadWithFile(file)
    }
  }

  // Accepts a file directly (for autoUpload mode)
  const handleFileUploadWithFile = async (file) => {
    if (!file) return
    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', file.name)
    formData.append('altText', file.name)
    formData.append('description', '')
    formData.append('file', file)
    formData.append('authorId', authorId)

    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    try {
      const response = await axios.post(
        `${process.env.mediaUrl}${process.env.version}/media/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const data = response.data
      if (data.success === false) {
        toast.error(data.message || 'Upload failed.')
        return
      }
      toast.success('File uploaded successfully!')
      setSelectedFile(null)
      setDescription('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      onUploadComplete(data.media.url)
    } catch (error) {
      console.error('Upload failed:', error)
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

  const handleFileUpload = async () => {
    if (!selectedFile) return
    await handleFileUploadWithFile(selectedFile)
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
      {label && <Label required={required}>{label}</Label>}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-md p-4 transition-all duration-200',
          'border-input bg-background/50 hover:bg-muted/30 hover:border-[#387cae]/40',
          isUploading && 'opacity-60 cursor-not-allowed',
          preview ? 'border-[#387cae]/20 bg-[#387cae]/[0.02]' : 'border-input'
        )}
      >
        <div className='flex flex-col items-center justify-center min-h-[120px]'>
          {!selectedFile && !preview && !isUploading && (
            <div className='flex flex-col items-center animate-in fade-in zoom-in duration-300'>
              <Upload className='h-8 w-8 text-muted-foreground mb-3 opacity-60' />
              <div className='text-sm text-center'>
                <label className='cursor-pointer text-[#387cae] hover:underline font-medium'>
                  Click to upload
                  <input
                    ref={fileInputRef}
                    type='file'
                    className='hidden'
                    onChange={handleFileSelect}
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
              <Loader2 className='h-8 w-8 text-[#387cae] animate-spin mb-3' />
              <span className='text-sm font-medium text-muted-foreground'>
                Uploading...
              </span>
            </div>
          )}

          {(selectedFile || preview) && !isUploading && (
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
                        className='text-[11px] text-muted-foreground hover:text-[#387cae] transition-colors'
                      >
                        Open External File
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedFile && !autoUpload && (
                <div className='mt-4 space-y-3'>
                  <div className='space-y-1.5'>
                    <Label htmlFor="file-description" className="text-xs font-medium text-gray-500">Remarks / Description</Label>
                    <textarea
                      id="file-description"
                      className='w-full min-h-[80px] p-2 text-sm border rounded-md bg-white focus:ring-2 focus:ring-[#387cae]/20 focus:border-[#387cae] outline-none transition-all'
                      placeholder='Add some remarks about this document...'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleFileUpload}
                    className='w-full py-2 bg-[#387cae] text-white rounded-md text-sm font-medium hover:bg-[#2d658e] transition-colors shadow-sm'
                  >
                    Upload Document
                  </button>
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
