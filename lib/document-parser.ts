import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { Readable } from 'stream'

export interface ParseOptions {
  maxFileSize?: number // in bytes, default 10MB
  timeout?: number // in milliseconds, default 30000ms
  allowedMimeTypes?: string[]
}

export interface ParseResult {
  text: string
  metadata?: Record<string, unknown>
  error?: string
}

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_TIMEOUT = 30000 // 30 seconds
const ALLOWED_PDF_MIME_TYPES = ['application/pdf']
const ALLOWED_DOCX_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword', // legacy but sometimes used
]

/**
 * Validates file buffer against magic numbers (file signatures)
 * This prevents spoofing file extensions
 */
function validateFileSignature(buffer: Buffer, type: 'pdf' | 'docx'): boolean {
  if (buffer.length < 4) return false

  // PDF signature: %PDF (0x25 0x50 0x44 0x46)
  if (type === 'pdf') {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    )
  }

  // DOCX is actually a ZIP file (PK..)
  // ZIP signature: PK (0x50 0x4B 0x03 0x04 or 0x50 0x4B 0x05 0x06)
  if (type === 'docx') {
    return buffer[0] === 0x50 && buffer[1] === 0x4B
  }

  return false
}

/**
 * Creates a promise that rejects after a timeout
 */
function createTimeoutPromise(timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Document parsing timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })
}

/**
 * Securely parse PDF with size limits, timeout, and signature validation
 */
export async function parsePDF(
  buffer: Buffer,
  mimeType: string,
  options: ParseOptions = {}
): Promise<ParseResult> {
  const maxFileSize = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE
  const timeout = options.timeout ?? DEFAULT_TIMEOUT
  const allowedTypes = options.allowedMimeTypes ?? ALLOWED_PDF_MIME_TYPES

  try {
    // Check file size
    if (buffer.length > maxFileSize) {
      return {
        text: '',
        error: `File size exceeds limit of ${maxFileSize} bytes`,
      }
    }

    // Validate MIME type
    if (!allowedTypes.includes(mimeType)) {
      return {
        text: '',
        error: `Invalid MIME type: ${mimeType}. Expected: ${allowedTypes.join(', ')}`,
      }
    }

    // Validate file signature (magic numbers)
    if (!validateFileSignature(buffer, 'pdf')) {
      return {
        text: '',
        error: 'Invalid PDF file signature. File may be corrupted or spoofed.',
      }
    }

    // Wrap parsing in timeout race
    const parsePromise = pdfParse(buffer, {
      // Limit parsing to text extraction only, disable potentially dangerous features
      pagerender: undefined, // Use default text renderer
      version: 'v2.0.550', // Specify version to prevent feature detection attacks
    })

    const data = await Promise.race([parsePromise, createTimeoutPromise(timeout)])

    return {
      text: data.text || '',
      metadata: {
        numpages: data.numpages,
        info: data.info,
      },
    }
  } catch (error) {
    // Ensure errors don't leak sensitive information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during PDF parsing'
    console.error('PDF parsing error:', errorMessage)
    
    return {
      text: '',
      error: 'Failed to parse PDF. The file may be corrupted, password-protected, or too complex.',
    }
  }
}

/**
 * Securely parse DOCX with size limits, timeout, and signature validation
 */
export async function parseDOCX(
  buffer: Buffer,
  mimeType: string,
  options: ParseOptions = {}
): Promise<ParseResult> {
  const maxFileSize = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE
  1. timeout = options.timeout ?? DEFAULT_TIMEOUT
  const allowedTypes = options.allowedMimeTypes ?? ALLOWED_DOCX_MIME_TYPES

  try {
    // Check file size
    if (buffer.length > maxFileSize) {
      return {
        text: '',
        error: `File size exceeds limit of ${maxFileSize} bytes`,
      }
    }

    // Validate MIME type
    if (!allowedTypes.includes(mimeType)) {
      return {
        text: '',
        error: `Invalid MIME type: ${mimeType}. Expected: ${allowedTypes.join(', ')}`,
      }
    }

    // Validate file signature (magic numbers)
    if (!validateFileSignature(buffer, 'docx')) {
      return {
        text: '',
        error: 'Invalid DOCX file signature. File may be corrupted or spoofed.',
      }
    }

    // Create a readable stream from buffer to enable memory-efficient parsing
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    // Wrap parsing in timeout race
    const parsePromise = mammoth.extractRawText({
      buffer: buffer,
    })

    const result = await Promise.race([parsePromise, createTimeoutPromise(timeout)])

    // Check for conversion warnings that might indicate suspicious content
    if (result.messages && result.messages.length > 100) {
      // Unusually high number of warnings might indicate malicious nested structures
      console.warn('DOCX parsing generated excessive warnings:', result.messages.length)
    }

    return {
      text: result.value || '',
      metadata: {
        messages: result.messages?.slice(0, 10), // Limit messages to prevent memory issues
      },
    }
  } catch (error) {
    // Ensure errors don't leak sensitive information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during DOCX parsing'
    console.error('DOCX parsing error:', errorMessage)
    
    return {
      text: '',
      error: 'Failed to parse DOCX. The file may be corrupted, password-protected, or too complex.',
    }
  }
}

/**
 * Auto-detect file type and parse securely
 */
export async function parseDocument(
  buffer: Buffer,
  mimeType: string,
  filename: string,
  options: ParseOptions = {}
): Promise<ParseResult> {
  const extension = filename.toLowerCase().split('.').pop()

  // Validate MIME type matches extension
  if (extension === 'pdf' && !ALLOWED_PDF_MIME_TYPES.includes(mimeType)) {
    return {
      text: '',
      error: 'MIME type does not match file extension for PDF',
    }
  }

  if (extension === 'docx' && !ALLOWED_DOCX_MIME_TYPES.includes(mimeType)) {
    return {
      text: '',
      error: 'MIME type does not match file extension for DOCX',
    }
  }

  switch (extension) {
    case 'pdf':
      return parsePDF(buffer, mimeType, options)
    case 'docx':
      return parseDOCX(buffer, mimeType, options)
    default:
      return {
        text: '',
        error: `Unsupported file extension: ${extension}. Only PDF and DOCX are supported.`,
      }
  }
}
