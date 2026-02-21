'use client'

import { useState } from 'react'
import { Upload, FileText, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SecurityReview AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/knowledge-base" className="text-gray-600 hover:text-gray-900">
                Knowledge Base
              </Link>
              <Link href="/upload" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                Upload Questionnaire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Auto-complete security questionnaires
              <br />
              <span className="text-primary-200">in minutes, not days</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Upload enterprise security questionnaires and get AI-generated answers from your knowledge base. 
              Accelerate your sales cycle and close deals faster.
            </p>
            <Link 
              href="/upload"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Questionnaire
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">85%</div>
              <div className="text-gray-600">Time Saved on Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">2 Days</div>
              <div className="text-gray-600">Average Completion Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Answer Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Upload</h3>
            <p className="text-gray-600">Upload your security questionnaire (PDF or Docx)</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. AI Processing</h3>
            <p className="text-gray-600">Our AI extracts questions and generates answers from your knowledge base</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Review</h3>
            <p className="text-gray-600">Review AI-generated answers with confidence scores and citations</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">4. Export</h3>
            <p className="text-gray-600">Export completed questionnaire in original format</p>
          </div>
        </div>
      </div>

      {/* Recent Questionnaires */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Questionnaires</h2>
            <Link href="/questionnaires" className="text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Enterprise Corp - Security Assessment</h3>
                      <p className="text-sm text-gray-600">247 questions • Completed 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">94% Confidence</div>
                      <div className="text-xs text-gray-500">Auto-generated</div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">TechGiant Inc - Vendor Security Review</h3>
                      <p className="text-sm text-gray-600">189 questions • Pending review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">87% Confidence</div>
                      <div className="text-xs text-gray-500">12 questions need review</div>
                    </div>
                    <Link href="/review/2" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
                      Review
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">FinanceCo - Data Security Questionnaire</h3>
                      <p className="text-sm text-gray-600">312 questions • Processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Processing...</div>
                      <div className="text-xs text-gray-500">~3 minutes remaining</div>
                    </div>
                    <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary-900 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to accelerate your sales cycle?
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of B2B SaaS companies using SecurityReview AI to close enterprise deals faster.
          </p>
          <Link 
            href="/upload"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
          >
            <Upload className="w-5 h-5" />
            Get Started Free
          </Link>
        </div>
      </div>
    </main>
  )
}