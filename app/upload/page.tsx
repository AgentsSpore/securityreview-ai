'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, File, X, Shield, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB in bytes

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || 
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
              file.name.endsWith('.pdf') ||
              file.name.endsWith('.docx')
    )
    
    const validFiles: File[] = []
    const oversizedFiles: string[] = []
    
    droppedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name)
      } else {
        validFiles.push(file)
      }
    })
    
    if (oversizedFiles.length > 0) {
      setError(`File(s) exceed 50MB limit: ${oversizedFiles.join(', ')}`)
    }
    
    setFiles(prev => [...prev, ...validFiles])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setError(null)
      const selectedFiles = Array.from(e.target.files)
      
      const validFiles: File[] = []
      const oversizedFiles: string[] = []
      
      selectedFiles.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          oversizedFiles.push(file.name)
        } else {
          validFiles.push(file)
        }
      })
      
      if (oversizedFiles.length > 0) {
        setError(`File(s) exceed 50MB limit: ${oversizedFiles.join(', ')}`)
      }
      
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setError(null)
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return
    
    setIsUploading(true)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }
    
    // Navigate to review page after upload
    setTimeout(() => {
      router.push('/review/123')
    }, 500)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">SecurityReview AI</span>
              </Link>
            </div>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Security Questionnaire
          </h1>
          <p className="text-lg text-gray-600">
            Drag and drop your PDF or DOCX files, or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Maximum file size: 50MB
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-2">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition cursor-pointer">
            <File className="w-4 h-4" />
            Browse Files
            <input
              type="file"
              multiple
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <File className="w-8 h-8 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                    disabled={isUploading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}