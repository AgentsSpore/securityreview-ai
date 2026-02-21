'use client'

import { useState } from 'react'
import { Shield, ArrowLeft, Plus, Search, FileText, Tag, Trash2, Edit3, Upload, FolderOpen } from 'lucide-react'
import Link from 'next/link'

// Mock data for knowledge base
const mockDocuments = [
  {
    id: 1,
    title: "Information Security Policy v2.3",
    type: "policy",
    category: "Security Governance",
    lastUpdated: "2024-01-15",
    size: "245 KB",
    questionsAnswered: 47,
    tags: ["ISO 27001", "Governance", "Policy"]
  },
  {
    id: 2,
    title: "Data Encryption Standards",
    type: "standard",
    category: "Data Protection",
    lastUpdated: "2024-01-10",
    size: "128 KB",
    questionsAnswered: 23,
    tags: ["Encryption", "Technical", "Data Protection"]
  },
  {
    id: 3,
    title: "SOC 2 Type II Report 2023",
    type: "compliance",
    category: "Compliance",
    lastUpdated: "2023-12-20",
    size: "4.2 MB",
    questionsAnswered: 89,
    tags: ["SOC 2", "Audit", "Compliance"]
  },
  {
    id: 4,
    title: "Incident Response Plan",
    type: "procedure",
    category: "Security Operations",
    lastUpdated: "2024-01-05",
    size: "312 KB",
    questionsAnswered: 34,
    tags: ["Incident Response", "Operations", "Security"]
  },
  {
    id: 5,
    title: "Vendor Security Requirements",
    type: "policy",
    category: "Third Party Risk",
    lastUpdated: "2024-01-08",
    size: "156 KB",
    questionsAnswered: 28,
    tags: ["Vendor Management", "Third Party", "Risk"]
  },
  {
    id: 6,
    title: "Previous Questionnaire - Enterprise Corp",
    type: "questionnaire",
    category: "Historical",
    lastUpdated: "2023-11-30",
    size: "1.8 MB",
    questionsAnswered: 247,
    tags: ["Historical", "Reference", "Completed"]
  }
]

const categories = ["All", "Security Governance", "Data Protection", "Compliance", "Security Operations", "Third Party Risk", "Historical"]

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const totalQuestionsAnswered = documents.reduce((acc, doc) => acc + doc.questionsAnswered, 0)

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
              <p className="text-gray-600 mt-1">
                Manage documents that power AI-generated answers
              </p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">{totalQuestionsAnswered}</div>
              <div className="text-sm text-gray-600">Questions Answerable</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">KB Coverage Rate</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">2 days ago</div>
              <div className="text-sm text-gray-600">Last Updated</div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Bulk Upload
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Organize Files
                </button>
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
                  placeholder="Search documents by title or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{doc.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="capitalize">{doc.type}</span>
                          <span>•</span>
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Updated {doc.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {doc.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold text-primary-600">{doc.questionsAnswered}</div>
                        <div className="text-xs text-gray-500">questions covered</div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Document to Knowledge Base</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g., Security Policy 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 50MB</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}