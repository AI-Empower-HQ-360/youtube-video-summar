/**
 * @label File Download Utility
 * @description Utilities for downloading content in various formats
 */

// ============================================
// TYPES
// ============================================

export type DownloadFormat = 'txt' | 'md' | 'json' | 'pdf' | 'html' | 'csv';

export interface DownloadOptions {
  filename?: string;
  format: DownloadFormat;
  content: string | object;
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
    [key: string]: unknown;
  };
}

export interface SummaryData {
  summary?: string;
  keyPoints?: string[];
  themes?: string[];
  qaPairs?: Array<{ question: string; answer: string }>;
  recommendations?: string[];
  [key: string]: unknown;
}

// ============================================
// CORE DOWNLOAD FUNCTION
// ============================================

/**
 * Download content as a file
 */
export function downloadFile(options: DownloadOptions): void {
  const { filename, format, content, metadata } = options;
  
  // Generate filename with timestamp if not provided
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `${metadata?.title || 'download'}_${timestamp}`;
  const finalFilename = filename || defaultFilename;
  
  let blob: Blob;
  let extension: string;
  
  switch (format) {
    case 'txt':
      blob = createTextFile(content, metadata);
      extension = 'txt';
      break;
      
    case 'md':
      blob = createMarkdownFile(content, metadata);
      extension = 'md';
      break;
      
    case 'json':
      blob = createJSONFile(content, metadata);
      extension = 'json';
      break;
      
    case 'html':
      blob = createHTMLFile(content, metadata);
      extension = 'html';
      break;
      
    case 'csv':
      blob = createCSVFile(content, metadata);
      extension = 'csv';
      break;
      
    case 'pdf':
      // PDF generation requires a library, show info message
      console.warn('PDF generation requires additional library. Use HTML export and print to PDF.');
      blob = createHTMLFile(content, metadata);
      extension = 'html';
      break;
      
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
  
  // Create download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${finalFilename}.${extension}`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ============================================
// FORMAT CREATORS
// ============================================

/**
 * Create plain text file
 */
function createTextFile(content: string | object, metadata?: Record<string, unknown>): Blob {
  let text = '';
  
  // Add metadata header
  if (metadata) {
    if (metadata.title) text += `Title: ${metadata.title}\n`;
    if (metadata.author) text += `Author: ${metadata.author}\n`;
    if (metadata.date) text += `Date: ${metadata.date}\n`;
    if (metadata.url) text += `Source: ${metadata.url}\n`;
    text += '\n' + '='.repeat(60) + '\n\n';
  }
  
  // Add content
  if (typeof content === 'string') {
    text += content;
  } else {
    text += JSON.stringify(content, null, 2);
  }
  
  return new Blob([text], { type: 'text/plain;charset=utf-8' });
}

/**
 * Create Markdown file
 */
function createMarkdownFile(content: string | object, metadata?: Record<string, unknown>): Blob {
  let markdown = '';
  
  // Add metadata header
  if (metadata?.title) {
    markdown += `# ${metadata.title}\n\n`;
  }
  
  if (metadata) {
    if (metadata.author) markdown += `**Author:** ${metadata.author}  \n`;
    if (metadata.date) markdown += `**Date:** ${metadata.date}  \n`;
    if (metadata.url) markdown += `**Source:** [${metadata.url}](${metadata.url})  \n`;
    if (metadata.detectedLanguage) markdown += `**Language:** ${metadata.detectedLanguage.toUpperCase()}  \n`;
    markdown += '\n---\n\n';
  }
  
  // Add content
  if (typeof content === 'string') {
    markdown += content;
  } else if (typeof content === 'object') {
    // Format object as markdown
    const obj = content as SummaryData;
    
    if (obj.summary) {
      markdown += `## Summary\n\n${obj.summary}\n\n`;
    }
    
    if (obj.keyPoints && Array.isArray(obj.keyPoints)) {
      markdown += `## Key Points\n\n`;
      obj.keyPoints.forEach((point: string) => {
        markdown += `- ${point}\n`;
      });
      markdown += '\n';
    }
    
    if (obj.themes && Array.isArray(obj.themes)) {
      markdown += `## Themes\n\n`;
      obj.themes.forEach((theme: string) => {
        markdown += `- ${theme}\n`;
      });
      markdown += '\n';
    }
    
    if (obj.qaPairs && Array.isArray(obj.qaPairs)) {
      markdown += `## Q&A\n\n`;
      obj.qaPairs.forEach((qa: { question: string; answer: string }, i: number) => {
        markdown += `### ${i + 1}. ${qa.question}\n\n${qa.answer}\n\n`;
      });
    }
    
    if (obj.recommendations && Array.isArray(obj.recommendations)) {
      markdown += `## Recommendations\n\n`;
      obj.recommendations.forEach((rec: string, i: number) => {
        markdown += `${i + 1}. ${rec}\n`;
      });
      markdown += '\n';
    }
  }
  
  return new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
}

/**
 * Create JSON file
 */
function createJSONFile(content: string | object, metadata?: Record<string, unknown>): Blob {
  const data = {
    metadata: metadata || {},
    content: typeof content === 'string' ? { text: content } : content,
    exportedAt: new Date().toISOString()
  };
  
  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json;charset=utf-8' });
}

/**
 * Create HTML file
 */
function createHTMLFile(content: string | object, metadata?: Record<string, unknown>): Blob {
  const title = metadata?.title || 'Document';
  const date = metadata?.date || new Date().toLocaleDateString();
  
  let bodyContent = '';
  
  if (typeof content === 'string') {
    bodyContent = `<div class="content">${content.replace(/\n/g, '<br>')}</div>`;
  } else {
    const obj = content as SummaryData;
    
    if (obj.summary) {
      bodyContent += `<section class="summary">
        <h2>Summary</h2>
        <p>${obj.summary}</p>
      </section>`;
    }
    
    if (obj.keyPoints && Array.isArray(obj.keyPoints)) {
      bodyContent += `<section class="key-points">
        <h2>Key Points</h2>
        <ul>
          ${obj.keyPoints.map((point: string) => `<li>${point}</li>`).join('\n          ')}
        </ul>
      </section>`;
    }
    
    if (obj.themes && Array.isArray(obj.themes)) {
      bodyContent += `<section class="themes">
        <h2>Themes</h2>
        <ul>
          ${obj.themes.map((theme: string) => `<li>${theme}</li>`).join('\n          ')}
        </ul>
      </section>`;
    }
    
    if (obj.qaPairs && Array.isArray(obj.qaPairs)) {
      bodyContent += `<section class="qa">
        <h2>Questions & Answers</h2>
        ${obj.qaPairs.map((qa: { question: string; answer: string }, i: number) => `
          <div class="qa-item">
            <h3>${i + 1}. ${qa.question}</h3>
            <p>${qa.answer}</p>
          </div>
        `).join('\n        ')}
      </section>`;
    }
    
    if (obj.recommendations && Array.isArray(obj.recommendations)) {
      bodyContent += `<section class="recommendations">
        <h2>Recommendations</h2>
        <ol>
          ${obj.recommendations.map((rec: string) => `<li>${rec}</li>`).join('\n          ')}
        </ol>
      </section>`;
    }
  }
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }
    
    header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    
    h1 {
      font-size: 2.5rem;
      color: #1e293b;
      margin-bottom: 10px;
    }
    
    .metadata {
      color: #64748b;
      font-size: 0.9rem;
    }
    
    section {
      margin-bottom: 40px;
    }
    
    h2 {
      font-size: 1.8rem;
      color: #1e293b;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    h3 {
      font-size: 1.3rem;
      color: #334155;
      margin-bottom: 10px;
    }
    
    p {
      margin-bottom: 15px;
      color: #475569;
    }
    
    ul, ol {
      margin-left: 30px;
      margin-bottom: 20px;
    }
    
    li {
      margin-bottom: 10px;
      color: #475569;
    }
    
    .qa-item {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #3b82f6;
    }
    
    footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #94a3b8;
      font-size: 0.85rem;
    }
    
    @media print {
      body {
        max-width: 100%;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>${title}</h1>
    <div class="metadata">
      ${metadata?.author ? `<div>Author: ${metadata.author}</div>` : ''}
      <div>Generated: ${date}</div>
      ${metadata?.url ? `<div>Source: <a href="${metadata.url}">${metadata.url}</a></div>` : ''}
    </div>
  </header>
  
  <main>
    ${bodyContent}
  </main>
  
  <footer>
    <p>Generated by VidNote AI YouTube Video Summarizer</p>
    <p>https://ai-empower-hq-360.github.io/youtube-video-summar/</p>
  </footer>
</body>
</html>`;
  
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

/**
 * Create CSV file
 */
function createCSVFile(content: string | object, _metadata?: Record<string, unknown>): Blob {
  let csv = '';
  
  if (typeof content === 'object' && !Array.isArray(content)) {
    const obj = content as Record<string, unknown>;
    
    // Header
    csv += 'Section,Content\n';
    
    // Add rows
    if (obj.summary) {
      csv += `"Summary","${escapeCsv(obj.summary)}"\n`;
    }
    
    if (obj.keyPoints && Array.isArray(obj.keyPoints)) {
      obj.keyPoints.forEach((point: string, i: number) => {
        csv += `"Key Point ${i + 1}","${escapeCsv(point)}"\n`;
      });
    }
    
    if (obj.themes && Array.isArray(obj.themes)) {
      obj.themes.forEach((theme: string, i: number) => {
        csv += `"Theme ${i + 1}","${escapeCsv(theme)}"\n`;
      });
    }
    
    if (obj.qaPairs && Array.isArray(obj.qaPairs)) {
      obj.qaPairs.forEach((qa: { question: string; answer: string }, i: number) => {
        csv += `"Question ${i + 1}","${escapeCsv(qa.question)}"\n`;
        csv += `"Answer ${i + 1}","${escapeCsv(qa.answer)}"\n`;
      });
    }
  } else if (Array.isArray(content)) {
    // Handle array of objects
    const array = content as Record<string, unknown>[];
    if (array.length > 0) {
      // Get headers from first object
      const headers = Object.keys(array[0]);
      csv += headers.map(h => `"${h}"`).join(',') + '\n';
      
      // Add rows
      array.forEach(row => {
        csv += headers.map(h => `"${escapeCsv(String(row[h] || ''))}"`).join(',') + '\n';
      });
    }
  } else {
    // Simple text content
    csv += 'Content\n';
    csv += `"${escapeCsv(String(content))}"\n`;
  }
  
  return new Blob([csv], { type: 'text/csv;charset=utf-8' });
}

/**
 * Escape CSV values
 */
function escapeCsv(value: string): string {
  return value.replace(/"/g, '""').replace(/\n/g, ' ');
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Download summary as text
 */
export function downloadSummaryAsText(summary: string, metadata?: Record<string, unknown>): void {
  downloadFile({
    format: 'txt',
    content: summary,
    metadata
  });
}

/**
 * Download summary as Markdown
 */
export function downloadSummaryAsMarkdown(data: string | SummaryData, metadata?: Record<string, unknown>): void {
  downloadFile({
    format: 'md',
    content: data,
    metadata
  });
}

/**
 * Download summary as JSON
 */
export function downloadSummaryAsJSON(data: unknown, metadata?: Record<string, unknown>): void {
  downloadFile({
    format: 'json',
    content: data,
    metadata
  });
}

/**
 * Download summary as HTML
 */
export function downloadSummaryAsHTML(data: string | SummaryData, metadata?: Record<string, unknown>): void {
  downloadFile({
    format: 'html',
    content: data,
    metadata
  });
}

/**
 * Download summary as CSV
 */
export function downloadSummaryAsCSV(data: string | SummaryData, metadata?: Record<string, unknown>): void {
  downloadFile({
    format: 'csv',
    content: data,
    metadata
  });
}

// ============================================
// COPY TO CLIPBOARD
// ============================================

/**
 * Copy content to clipboard
 */
export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

// ============================================
// EXPORTS
// ============================================

export default {
  downloadFile,
  downloadSummaryAsText,
  downloadSummaryAsMarkdown,
  downloadSummaryAsJSON,
  downloadSummaryAsHTML,
  downloadSummaryAsCSV,
  copyToClipboard
};
