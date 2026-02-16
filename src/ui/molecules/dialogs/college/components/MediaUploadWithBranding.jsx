import { useRef, useState, useEffect } from "react"
import { X, ImagePlus } from "lucide-react"

const FileUploadWithPreview = ({
  onUploadComplete,
  label,
  defaultPreview = null,
  accept = "image/*",
  onClear,
}) => {
  const fileInputRef = useRef(null)

  const [preview, setPreview] = useState(defaultPreview)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPreview(defaultPreview)
  }, [defaultPreview])

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    if (preview && preview !== defaultPreview) {
      URL.revokeObjectURL(preview)
    }

    setPreview(null)
    setError(null)

    if (onClear) onClear()
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Local preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("title", file.name)
      formData.append("altText", file.name)
      formData.append("description", "")
      formData.append("file", file)
      formData.append("authorId", "1")

      const mediaUrl = process.env.mediaUrl
      const version = process.env.version

      if (!mediaUrl || !version) {
        throw new Error("Environment variables not configured")
      }

      const response = await fetch(
        `${mediaUrl}${version}/media/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      if (data.success && data.media?.url) {
        setPreview(data.media.url)
        onUploadComplete?.(data.media.url)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("Upload failed. Please try again.")
      handleClear()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-20 h-20 rounded-lg border overflow-hidden group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              aria-label="Remove image"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-[10px] mt-1">
              {loading ? "Uploading..." : "Upload"}
            </span>
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept={accept}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

export default FileUploadWithPreview
