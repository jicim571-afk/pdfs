// tools.ts
import {
  FileText,
  Scissors,
  Link2,
  BarChart2,
  Printer,
  FileText as FileToWord,
  FilePlus,
  RefreshCw,
  Crop,
  Hash,
  Type,
  Brain,
  Droplet,
  Edit2,
  Unlock,
  Lock,
  RotateCw,
  BookOpen,
  File,
  FileSearch,
  MessageCircle,
  Folder,
  Repeat,
  PenTool,
  Cloud
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface Tool {
  name: string;
  route: string;
  icon: LucideIcon;
  description: string;
  longDescription: string;
  blogContent?: string;
  category: string;
}

export const tools: Tool[] = [
  {
    name: "JPG to PDF",
    route: "/jpg-to-pdf",
    icon: FileText,
    description: "Convert JPG images into a single PDF file.",
    longDescription:
      "Quickly merge multiple JPG images into one high-quality PDF. Ideal for creating printable documents or combining scans — supports ordering and basic compression.",
    category: "Image",
  },
  {
    name: "PDF Splitter",
    route: "/pdf-splitter",
    icon: Scissors,
    description: "Split PDF into individual pages.",
    longDescription:
      "Split multi-page PDF files into separate documents. Choose specific pages or extract ranges to get only the pages you need quickly and reliably.",
    category: "PDF",
  },
  {
    name: "Merge PDF",
    route: "/pdf-merge",
    icon: Link2,
    description: "Combine multiple PDFs into one.",
    longDescription:
      "Combine several PDF files into a single, organized document. Maintain original quality, reorder files before merging, and download instantly — no account required.",
    category: "PDF",
  },
  {
    name: "Compress PDF",
    route: "/pdf-compress",
    icon: BarChart2,
    description: "Reduce PDF file size.",
    longDescription:
      "Reduce large PDF file sizes for faster sharing and emailing. Choose compression levels to balance quality and size while preserving text readability.",
    category: "PDF",
  },
  {
    name: "PDF to JPG",
    route: "/pdf-to-jpg",
    icon: Printer,
    description: "Convert PDF pages into JPG images.",
    longDescription:
      "Extract pages from PDFs as high-quality JPG images. Useful for snapshots, sharing individual pages, or preparing images for presentations and web use.",
    category: "PDF",
  },
  {
    name: "PDF to Word",
    route: "/pdf-to-word",
    icon: FileToWord,
    description: "Convert PDF documents to Word format.",
    longDescription:
      "Convert PDFs to editable Word documents (.docx) while preserving layout and formatting as much as possible — ideal for content editing and collaboration.",
    category: "Document",
  },
  {
    name: "Word to PDF",
    route: "/word-to-pdf",
    icon: FilePlus,
    description: "Convert Word documents to PDF.",
    longDescription:
      "Turn Word files into universally viewable PDFs quickly. Preserve fonts and layout so documents display consistently across devices and platforms.",
    category: "Document",
  },
  {
    name: "Image Converter",
    route: "/image-converter",
    icon: RefreshCw,
    description: "Convert images between formats (JPG, PNG, etc).",
    longDescription:
      "Convert images between popular formats with options for quality and transparency. Great for preparing assets for web, print, or sharing.",
    category: "Image",
  },
  {
    name: "Image Resizer",
    route: "/image-resizer",
    icon: Crop,
    description: "Resize images to custom dimensions.",
    longDescription:
      "Resize images to exact pixel dimensions or scale proportionally. Useful for thumbnails, social posts, or optimizing images for web pages.",
    category: "Image",
  },
  {
    name: "Word Counter",
    route: "/word-counter",
    icon: Hash,
    description: "Count words and characters in your text.",
    longDescription:
      "Accurately count words, characters, and lines. Useful for writers, students, and SEO checks — supports paste and file input.",
    category: "Utilities",
  },
  {
    name: "Case Converter",
    route: "/case-converter",
    icon: Type,
    description: "Convert text to UPPERCASE, lowercase, or Capitalized.",
    longDescription:
      "Quickly change text case for formatting, code snippets, or content clean-up. Supports sentence case, title case, and custom rules.",
    category: "Utilities",
  },
  {
    name: "AI Summarizer",
    route: "/ai-summarizer",
    icon: Brain,
    description: "Summarize long text using AI.",
    longDescription:
      "Generate concise summaries of long articles, reports or notes using on-device AI. Save time by extracting key points and action items.",
    category: "Utilities",
  },
  {
    name: "PDF Watermark",
    route: "/pdf-watermark",
    icon: Droplet,
    description: "Add watermark text to your PDF.",
    longDescription:
      "Add visible watermarks or footers to PDFs to protect ownership or mark drafts. Customize position, opacity and text.",
    category: "PDF",
  },
  {
    name: "PDF Signer",
    route: "/pdf-signer",
    icon: Edit2,
    description: "Digitally sign your PDF files.",
    longDescription:
      "Add electronic signatures to PDF documents for approvals and contracts. Support for drawing or uploading signature images.",
    category: "PDF",
  },
  {
    name: "PDF Unlock",
    route: "/pdf-unlock",
    icon: Unlock,
    description: "Remove password from protected PDFs.",
    longDescription:
      "Remove user-level restrictions from PDFs when you have the right to do so. Recover access to printable or editable content quickly.",
    category: "PDF",
  },
  {
    name: "PDF Protect",
    route: "/pdf-protect",
    icon: Lock,
    description: "Add password protection to your PDF.",
    longDescription:
      "Secure your PDF files with password protection and permission controls to prevent unauthorized printing or editing.",
    category: "PDF",
  },
  {
    name: "Rotate PDF",
    route: "/pdf-rotate",
    icon: RotateCw,
    description: "Rotate pages in your PDF file.",
    longDescription:
      "Rotate single or multiple pages within a PDF to correct orientation issues. Apply rotation to selected ranges or entire documents.",
    category: "PDF",
  },
  {
    name: "Organize PDF",
    route: "/pdf-organize",
    icon: BookOpen,
    description: "Reorder or delete PDF pages.",
    longDescription:
      "Reorder, remove or extract pages from PDFs to create custom documents. Drag-and-drop ordering for a simple visual workflow.",
    category: "PDF",
  },
  {
    name: "PDF Reader",
    route: "/pdf-reader",
    icon: File,
    description: "Read and extract text from PDF files.",
    longDescription:
      "View PDFs in-browser and extract selectable text for editing or copying. Supports basic search and navigation features.",
    category: "PDF",
  },
  {
    name: "AI OCR",
    route: "/ai-ocr",
    icon: FileSearch,
    description: "Extract editable text from scanned images and PDFs using AI-powered OCR.",
    longDescription: "Our AI-powered OCR transforms scanned documents into editable text with unprecedented accuracy...",
    blogContent: "ocr-advanced-guide.md",
    category: "AI",
  },
  {
    name: "Chat with PDF",
    route: "/chat-with-pdf",
    icon: MessageCircle,
    description: "Ask questions and get summaries from long PDF documents using AI.",
    longDescription: "Transform the way you interact with PDF documents using our revolutionary Chat with PDF feature...",
    blogContent: "chat-pdf-guide.md",
    category: "AI",
  },
  {
    name: "Batch Processing",
    route: "/batch-processing",
    icon: Folder,
    description: "Apply an action to multiple files at once (compress, convert, watermark).",
    longDescription:
      "Automate repetitive tasks by running batch operations on multiple files: convert formats, compress, watermark, and more in a single job.",
    category: "Productivity",
  },
  {
    name: "Conversion Suite",
    route: "/conversion-suite",
    icon: Repeat,
    description: "Comprehensive conversions: PDF ⇄ Word/Excel/PPT and more.",
    longDescription:
      "A complete conversion toolkit for professionals: export PDFs to Word, Excel, or PowerPoint and convert those formats back to PDF with layout preservation options.",
    category: "Productivity",
  },
  {
    name: "E-Signature",
    route: "/e-signature",
    icon: PenTool,
    description: "Sign documents electronically and verify signatures.",
    longDescription:
      "Add legally-binding electronic signatures to documents, request signatures from others, and verify signed PDFs — streamlined for business workflows.",
    category: "Productivity",
  },
  {
    name: "Cloud Integration",
    route: "/cloud-integration",
    icon: Cloud,
    description: "Import and export files directly from Google Drive and Dropbox.",
    longDescription:
      "Connect your cloud storage to import files directly from Google Drive or Dropbox and export results back to your cloud accounts for a smooth workflow.",
    category: "UX",
  },
];
