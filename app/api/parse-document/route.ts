import { NextRequest, NextResponse } from 'next/server'
import { parseDocument, ParseOptions } from '@/lib/document-parser'

// Configure route to handle large files with memory limits
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Request size limit (10MB) - matches the parser default
const MAX_REQUEST_SIZE = 10 * 1024 * 1024
const MAX_FILES_PER_REQUEST = 5

interface ParseResponse {
  success: boolean
  filename: string
  text?: string
  error?: string
  metadata?: Record<string, unknown>
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check content length header
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Request body too large. Maximum size is 10MB.' },
        { status: 413 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files')

    // Validate number of files
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { success: false, error: `Too many files. Maximum is ${MAX_FILES_PER_REQUEST} files per request.` },
        { status: 400 }
      )
    }

    const parseOptions: ParseOptions = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      timeout: 30000, // 30 seconds
    }

    const results: ParseResponse[] = []

    for (const file of files) {
      if (!(file instanceof File)) {
        results.push({
          success: false,
          filename: 'unknown',
          error: 'Invalid file object',
        })
        continue
      }

      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('wordprocessingml')) {
        results.push({
          success: false,
          filename: file.name,
          error: `Unsupported file type: ${file.type}. Only PDF and DOCX are supported.`,
        })
        continue
      }

      try {
        // Convert File to Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Parse document securely
        const result = await parseDocument(buffer, file.type, file.name, parseOptions)

        if (result.error) {
          results.push({
            success: false,
            filename: file.name,
            error: result.error,
          })
        } else {
          results.push({
            success: true,
            filename: file.name,
            text: result.text,
            metadata: result.metadata,
          })
        }
      } catch (error) {
        // Ensure parsing failures don't crash the server
        console.error('Document processing error:', error)
        results.push({
          success: false,
          filename: file.name,
          error: 'Internal server error during document processing',
        })
      }
    }

    // Check if all parsing failed
    const allFailed = results.every((r) => !r.success)
    if (allFailed && results.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          results,
          error: 'All documents failed to parse' 
        },
        { status: 422 }
      )
    }

    return NextResponse.json({
      success: results.some((r) => r.success),
      results,
    })

  } catch (error) {
    // Global error boundary - don't crash the server
    console.error('API route error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests with error
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to upload documents.' },
    { status: 405 }
  )
}
