'use client'

import { useState } from 'react'
import { Shield, ArrowLeft, CheckCircle, AlertCircle, Search, Filter, ChevronDown, ChevronUp, BookOpen, ExternalLink, Download, Save } from 'lucide-react'
import Link from 'next/link'

// Mock data for the review page
const mockQuestions = [
  {
    id: 1,
    question: "Do you have a formal Information Security Policy in place?",
    category: "Security Governance",
    answer: "Yes, we have a comprehensive Information Security Policy that is reviewed annually and approved by executive management. The policy covers all aspects of information security including data classification, access control, incident response, and business continuity.",
    confidence: 95,
    status: "approved",
    source: "Security Policy v2.3",
    citations: ["Section 2.1 - Information Security Policy", "ISO 27001 Certification Document"]
  },
  {
    id: 2,
    question: "What encryption standards are used for data at rest?",
    category: "Data Protection",
    answer: "We use AES-256 encryption for all data at rest. Database encryption is enabled by default for all customer data. Encryption keys are managed through AWS KMS with automatic key rotation every 90 days.",
    confidence: 92,
    status: "approved",
    source: "Data Encryption Standards",
    citations: ["Technical Architecture Document", "AWS Security Configuration"]
  },
  {
    id: 3,
    question: "Do you perform background checks on employees with access to customer data?",
    category: "Personnel Security",
    answer: "Yes, background checks are conducted for all employees prior to hire and annually thereafter. This includes criminal history verification, reference checks, and education verification for all roles with data access.",
    confidence: 88,
    status: "pending",
    source: "HR Security Policy",
    citations: ["Employment Screening Policy", "Background Check Procedure"]
  },
  {
    id: 4,
    question: "What is your data retention policy for customer data after contract termination?",
    category: "Data Management",
    answer: "Customer data is retained for 30 days after contract termination to allow for data export requests, after which it is securely purged using NIST 800-88 compliant deletion methods. Backups are retained for 90 days with automatic deletion thereafter.",
    confidence: 45,
    status: "needs_review",
    source: "Data Retention Policy",
    citations: ["Data Retention Schedule", "Secure Disposal Procedure"],
    aiNote: "The retention period may vary based on specific contractual agreements. Please verify the standard retention period for this client."
  },
  {
    id: 5,
    question: "Do you maintain a Business Continuity Plan (BCP) and Disaster Recovery Plan (DRP)?",
    category: "Business Continuity",
    answer: "Yes, we maintain both BCP and DRP documents that are tested quarterly. Our RTO is 4 hours and RPO is 1 hour. Plans include procedures for various scenarios including natural disasters, cyber attacks, and system failures.",
    confidence: 91,
    status: "approved",
    source: "BCP/DRP Documentation",
    citations: ["Business Continuity Plan v3.1", "Disaster Recovery Plan v2.8"]
  },
  {
    id: 6,
    question: "Are security awareness training programs mandatory for all employees?",
    category: "Training & Awareness",
    answer: "Yes, all employees are required to complete annual security awareness training and quarterly phishing simulations. Completion is tracked and reported to management. New hires must complete training within 30 days of start date.",
    confidence: 94,
    status: "approved",
    source: "Training Program Documentation",
    citations: ["Security Awareness Training Policy", "Training Completion Records"]
  },
  {
    id: 7,
    question: "Do you have a vulnerability management program in place?",
    category: "Vulnerability Management",
    answer: "Yes, we conduct automated vulnerability scans weekly and penetration tests annually. Critical vulnerabilities are remediated within 48 hours. Our program includes both infrastructure and application security testing.",
    confidence: 78,
    status: "pending",
    source: "Vulnerability Management Policy",
    citations: ["Vulnerability Management Procedure", "Penetration Test Reports"]
  },
  {
    id: 8,
    question: "What third-party security certifications do you hold?",
    category: "Compliance",
    answer: "We are ISO 27001:2013 certified and SOC 2 Type II compliant. Certifications are maintained through annual audits. We are also GDPR compliant and CCPA ready.",
    confidence: 96,
    status: "approved",
    source: "Compliance Certificates",
    citations: ["ISO 27001 Certificate", "SOC 2 Type II Report"]
  }
]

const categories = ["All", "Security Governance", "Data Protection", "Personnel Security", "Data Management", "Business Continuity", "Training & Awareness", "Vulnerability Management", "Compliance"]

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState(mockQuestions)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all')
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [editedAnswer, setEditedAnswer] = useState("")

  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || q.status === activeTab
    return matchesCategory && matchesSearch && matchesTab
  })

  const stats = {
    total: questions.length,
    approved: questions.filter(q => q.status === 'approved').length,
    pending: questions.filter(q => q.status === 'pending').length,
    needsReview: questions.filter(q => q.status === 'needs_review').length,
    avgConfidence: Math.round(questions.reduce((acc, q) => acc + q.confidence, 0) / questions.length)
  }

  const handleApprove = (id: number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, status: 'approved' } : q))
  }

  const handleEdit = (id: number, currentAnswer: string) => {
    setEditingQuestion(id)
    setEditedAnswer(currentAnswer)
  }

  const handleSaveEdit = (id: number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, answer: editedAnswer, status: 'approved' } : q))
    setEditingQuestion(null)
    setEditedAnswer("")
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500'
    if (confidence >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return 'High'
    if (confidence >= 70) return 'Medium'
    return 'Low'
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
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                Complete Review
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TechGiant Inc - Vendor Security Review</h1>
              <p className="text-gray-600 mt-1">189 questions • Started 2 hours ago</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Overall Confidence</div>
                <div className="text-2xl font-bold text-primary-600">{stats.avgConfidence}%</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-green-700">Approved</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-yellow-700">Pending Review</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{stats.needsReview}</div>
              <div className="text-sm text-red-700">Need Attention</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`w-full px-4 py-3 text-left text-sm font-medium border-b border-gray-100 ${
                  activeTab === 'all' ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Questions ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`w-full px-4 py-3 text-left text-sm font-medium border-b border-gray-100 ${
                  activeTab === 'pending' ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Pending Review ({stats.pending + stats.needsReview})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`w-full px-4 py-3 text-left text-sm font-medium ${
                  activeTab === 'approved' ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Approved ({stats.approved})
              </button>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedCategory === category 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div 
                  key={q.id}
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                    q.status === 'needs_review' ? 'border-red-200' : 
                    q.status === 'approved' ? 'border-green-200' : 'border-gray-200'
                  }`}
                >
                  {/* Question Header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {q.category}
                          </span>
                          {q.status === 'approved' && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          )}
                          {q.status === 'needs_review' && (
                            <span className="flex items-center gap-1 text-xs text-red-600">
                              <AlertCircle className="w-3 h-3" />
                              Needs Review
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900">{q.question}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Confidence Badge */}
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            q.confidence >= 90 ? 'bg-green-100 text-green-700' :
                            q.confidence >= 70 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${getConfidenceColor(q.confidence)}`} />
                            {q.confidence}% {getConfidenceText(q.confidence)}
                          </div>
                        </div>
                        {expandedQuestion === q.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedQuestion === q.id && (
                    <div className="border-t border-gray-200 p-4">
                      {/* AI Warning */}
                      {q.aiNote && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-yellow-800 mb-1">AI Note - Requires Attention</h4>
                              <p className="text-sm text-yellow-700">{q.aiNote}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Answer */}
                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Answer</label>
                        {editingQuestion === q.id ? (
                          <div>
                            <textarea
                              value={editedAnswer}
                              onChange={(e) => setEditedAnswer(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                              rows={6}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setEditingQuestion(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(q.id)}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800">{q.answer}</p>
                          </div>
                        )}
                      </div>

                      {/* Sources */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium">Sources & Citations</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {q.source}
                            <ExternalLink className="w-3 h-3" />
                          </span>
                          {q.citations.map((citation, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      {editingQuestion !== q.id && (
                        <div className="flex gap-3">
                          {q.status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(q.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve Answer
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(q.id, q.answer)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            Edit Answer
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                            <BookOpen className="w-4 h-4" />
                            Add to KB
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No questions found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}