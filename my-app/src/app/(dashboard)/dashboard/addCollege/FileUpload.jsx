import { Upload } from "lucide-react";
import { useState, useEffect } from "react";

const FileUpload = ({ onUploadComplete, label, defaultPreview = null }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(defaultPreview);

  // Add useEffect to update preview when defaultPreview changes
  useEffect(() => {
    setPreview(defaultPreview);
  }, [defaultPreview]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("altText", file.name);
    formData.append("description", "");
    formData.append("file", file);
    formData.append("authorId", "1");

    try {
      const response = await fetch(
        "https://uploads.merouni.com/api/v1/media/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload media");
      }

      const data = await response.json();
      console.log("Upload complete:", data);
      onUploadComplete(data.media.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          {!preview && <Upload className="h-12 w-12 text-gray-400" />}
          <div className="mt-4 text-center">
            <label className="cursor-pointer">
              <span className="text-blue-500 hover:text-blue-600">
                {preview ? "Change file" : "Click to upload"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
        {isUploading && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Uploading...
          </div>
        )}
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-40 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;