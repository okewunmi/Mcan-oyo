'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '@/lib/upload'
import { Upload, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  value: string
  onChange: (url: string) => void
  folder?: string
}

export default function ImageUploader({ value, onChange, folder = 'general' }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }

    setUploading(true)
    const url = await uploadImage(file, folder)
    setUploading(false)

    if (url) {
      onChange(url)
      toast.success('Image uploaded!')
    } else {
      toast.error('Upload failed. Check Supabase storage bucket.')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          uploading ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-primary-500 animate-spin" />
            <p className="text-sm text-primary-600 font-body">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-gray-400" />
            <p className="text-sm text-gray-500 font-body">
              <span className="text-primary-600 font-medium">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-gray-400 font-body">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </div>

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="h-32 rounded-lg object-cover border border-gray-100" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}