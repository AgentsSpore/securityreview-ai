'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, File, X, Shield, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const ALLOWED_EXTENSIONS = ['.pdf', '.docx']

interface UploadError {
  filename: string
  message: string
}

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState<UploadError[]>([])

  /**
   * Validate file before adding to queue
   */
  const validateFile = (file: File): UploadError | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        filename: file.name,
        message: `File exceeds maximum size of 10MB`,
      }
    }

    // Check MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        filename: file.name,
        message: `Invalid file type: ${file.type}. Only PDF and DOCX are supported.`,
      }
    }

    // Check extension matches MIME type (additional security)
    const extension = file.name.toLowerCase().slice(-4)
    if (!ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      return {
        filename: file.name,
        message: `File extension does not match allowed types`,
      }
    }

    // PDF files should have .pdf extension
    if (file.type === 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return {
        filename: file.name,
        message: `PDF file must have .pdf extension`,
      }
    }

    // DOCX files should have .docx extension
    if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
      !file.name.toLowerCase().endsWith('.docx')
    ) {
      return {
        filename: file.name,
        message: `DOCX file must have .docx extension`,
      }
    }

    return null
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      const newErrors: UploadError[] = []
      const validFiles: File[] = []

      droppedFiles.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          newErrors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors])
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles])
      }
    },
    []
  )

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const newErrors: UploadError[] = []
      const validFiles: File[] = []

      selectedFiles.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          newErrors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors])
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles])
      }

      // Reset input to allow selecting the same file again
      e.target.value = ''
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setErrors([])

    try {
      // Create FormData
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Call the secure API endpoint
      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()

      // Check for individual file errors
      const failedFiles = data.results?.filter((r: { success: boolean }) => !r.success) || []
      if (failedFiles.length > 0) {
        setErrors(
          failedFiles.map((f: { filename: string; error: string }) => ({
            filename: f.filename,
            message: f.error,
          }))
        )
      }

      // Navigate to review page if at least one file succeeded
      const hasSuccess = data.results?.some((r: { success: boolean }) => r.success)
      if (hasSuccess) {
        setTimeout(() => {
          router.push('/review/123')
        }, 500)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors([
        {
          filename: 'Upload',
          message: error instanceof Error ? error.message : 'Upload failed. Please try again.',
        },
      ])
      setIsUploading(false)
      setUploadProgress(0)
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Security Questionnaire</h1>
          <p className="text-lg text-gray-600">
            Upload PDF or DOCX files to automatically extract and answer security questions
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Maximum file size: 10MB per file. PDF and DOCX formats only.
          </p>
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-red-800 mb-2">Upload errors:</h3>
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">
                      <span className="font-medium">{error.filename}:</span> {error.message}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={clearErrors}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Clear errors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                Drag and drop your files here
              </p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition">
                Select Files
              </span>
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                        {file.type && ` • ${file.type}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                    className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="mt-8">
              {isUploading ? (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    Processing {uploadProgress}%
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleUpload}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition"
                >
                  Upload and Process {files.length} File{files.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
