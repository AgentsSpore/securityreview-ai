# SecurityReview AI

Auto-complete enterprise security questionnaires in minutes, not days. SecurityReview AI helps B2B SaaS sales engineers and security teams accelerate enterprise deals by automatically generating answers to repetitive security questionnaires.

## Features

- **📄 Document Upload**: Support for PDF and DOCX security questionnaires
- **🤖 AI-Powered Answers**: Auto-generate responses from your knowledge base and past questionnaires
- **📊 Confidence Scoring**: See confidence levels with source citations for every answer
- **✅ Review & Approve**: Streamlined workflow for security team review and approval
- **📚 Knowledge Base**: Centralized repository of security documentation
- **📈 Progress Tracking**: Monitor completion status and overall confidence scores

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React useState/useCallback

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
app/
├── page.tsx                 # Dashboard/Homepage
├── upload/page.tsx          # Document upload interface
├── review/[id]/page.tsx     # Question review & approval
├── knowledge-base/page.tsx  # Knowledge base management
├── questionnaires/page.tsx  # All questionnaires list
├── layout.tsx               # Root layout
└── globals.css              # Global styles
```

## How It Works

1. **Upload**: Drag & drop or select PDF/DOCX security questionnaires
2. **AI Processing**: System extracts questions and generates answers from knowledge base
3. **Review**: See confidence scores, sources, and AI notes for each answer
4. **Approve**: Review, edit if needed, and approve individual answers
5. **Export**: Download completed questionnaire in original format

## Demo Data

The MVP includes mock data to demonstrate functionality:
- 8 sample security questions with AI-generated answers
- 6 documents in the knowledge base
- 6 sample questionnaires in various states
- Real-time confidence scoring and status tracking

## Key Features Implemented

### Dashboard
- Upload CTA with drag-and-drop interface
- Recent questionnaires with status indicators
- Quick stats and progress overview
- Navigation to all major features

### Upload Interface
- Drag-and-drop file upload
- PDF and DOCX support
- Upload progress simulation
- Multi-file upload capability

### Review Workflow
- Expandable question cards
- Confidence scoring with visual indicators
- Source citations and knowledge base references
- AI notes for low-confidence answers
- Edit and approve actions
- Category filtering and search

### Knowledge Base
- Document management interface
- Category organization
- Search and filter capabilities
- Document upload modal
- Coverage statistics

### Questionnaires List
- Full questionnaire history
- Status filtering (All, Completed, In Progress, etc.)
- Search by company, title, or type
- Progress tracking and owner assignment

## Future Enhancements

- Real AI integration (OpenAI/Claude API)
- Actual PDF/DOCX parsing and generation
- User authentication and team collaboration
- Integration with CRM systems (Salesforce, HubSpot)
- Automated follow-up questions
- Custom answer templates
- Bulk operations and approvals
- API for programmatic access

## License

MIT

## Support

For questions or support, contact the SecurityReview AI team.
