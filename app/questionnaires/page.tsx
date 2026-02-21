'use client'

import { useState } from 'react'
import { Shield, ArrowLeft, Search, Filter, FileText, Clock, CheckCircle, AlertCircle, Download, MoreVertical, Calendar } from 'lucide-react'
import Link from 'next/link'

// Mock data for questionnaires
const mockQuestionnaires = [
  {
    id: 1,
    company: "Enterprise Corp",
    title: "Security Assessment Q4 2024",
    questions: 247,
    status: "completed",
    confidence: 94,
    completedDate: "2024-01-15",
    timeSpent: "2h 15m",
    owner: "Sarah Chen",
    type: "Security Assessment"
  },
  {
    id: 2,
    company: "TechGiant Inc",
    title: "Vendor Security Review",
    questions: 189,
    status: "in_progress",
    confidence: 87,
    completedDate: null,
    timeSpent: "1h 45m",
    owner: "Mike Johnson",
    type: "Vendor Review"
  },
  {
    id: 3,
    company: "FinanceCo",
    title: "Data Security Questionnaire",
    questions: 312,
    status: "processing",
    confidence: null,
    completedDate: null,
    timeSpent: "15m",
    owner: "Emily Davis",
    type: "Data Security"
  },
  {
    id: 4,
    company: "HealthSys",
    title: "HIPAA Security Assessment",
    questions: 156,
    status: "completed",
    confidence: 96,
    completedDate: "2024-01-10",
    timeSpent: "3h 20m",
    owner: "Sarah Chen",
    type: "Compliance"
  },
  {
    id: 5,
    company: "RetailMax",
    title: "PCI DSS Questionnaire",
    questions: 278,
    status: "completed",
    confidence: 91,
    completedDate: "2024-01-08",
    timeSpent: "2h 50m",
    owner: "Mike Johnson",
    type: "Compliance"
  },
  {
    id: 6,
    company: "CloudFirst Solutions",
    title: "Cloud Security Assessment",
    questions: 134,
    status: "needs_review",
    confidence: 72,
    completedDate: null,
    timeSpent: "45m",
    owner: "Emily Davis",
    type: "Security Assessment"
  }
]

const statusFilters = [
  { label: "All", value: "all", count: 6 },
  { label: "Completed", value: "completed", count: 3 },
  { label: "In Progress", value: "in_progress", count: 2 },
  { label: "Processing", value: "processing", count: 1 },
  { label: "Needs Review", value: "needs_review", count: 1 }
]

export default function QuestionnairesPage() {
  const [questionnaires] = useState(mockQuestionnaires)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredQuestionnaires = questionnaires.filter(q => {
    const matchesSearch = q.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Completed
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            In Progress
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            Processing
          </span>
        )
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            Needs Review
          </span>
        )
      default:
        return null
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Questionnaires</h1>
          <p className="text-gray-600">
            Manage and track all your security questionnaires
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, title, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {statusFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    statusFilter === filter.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questionnaires List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Questionnaire</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Questions</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Confidence</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Owner</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestionnaires.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{q.company}</h4>
                          <p className="text-sm text-gray-500">{q.title}</p>
                          {q.completedDate && (
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Completed {q.completedDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{q.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{q.questions}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(q.status)}
                    </td>
                    <td className="px-6 py-4">
                      {q.confidence ? (
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            q.confidence >= 90 ? 'bg-green-500' :
                            q.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm font-medium text-gray-900">{q.confidence}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{q.owner}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {q.status === 'in_progress' || q.status === 'needs_review' ? (
                          <Link 
                            href={`/review/${q.id}`}
                            className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition"
                          >
                            {q.status === 'needs_review' ? 'Review' : 'Continue'}
                          </Link>
                        ) : (
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQuestionnaires.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No questionnaires found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {filteredQuestionnaires.length} of {questionnaires.length} questionnaires
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}