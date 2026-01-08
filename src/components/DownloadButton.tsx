/**
 * @label Download Button Component
 * @description Button component for downloading summaries in various formats
 */

import { useState } from 'react';
import { Download, FileText, Code, FileJson, FileCode, Table, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  downloadSummaryAsText,
  downloadSummaryAsMarkdown,
  downloadSummaryAsJSON,
  downloadSummaryAsHTML,
  downloadSummaryAsCSV,
  copyToClipboard,
  type DownloadFormat
} from '../lib/file-download';

interface DownloadButtonProps {
  data: any;
  metadata?: {
    title?: string;
    author?: string;
    date?: string;
    url?: string;
    detectedLanguage?: string;
    [key: string]: any;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function DownloadButton({
  data,
  metadata,
  variant = 'default',
  size = 'default',
  showLabel = true,
  className = ''
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = (format: DownloadFormat) => {
    switch (format) {
      case 'txt':
        downloadSummaryAsText(typeof data === 'string' ? data : data.summary, metadata);
        break;
      case 'md':
        downloadSummaryAsMarkdown(data, metadata);
        break;
      case 'json':
        downloadSummaryAsJSON(data, metadata);
        break;
      case 'html':
        downloadSummaryAsHTML(data, metadata);
        break;
      case 'csv':
        downloadSummaryAsCSV(data, metadata);
        break;
    }
    setIsOpen(false);
  };

  const handleCopy = async () => {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        <Download className="w-4 h-4" />
        {showLabel && <span className="ml-2">Download</span>}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2 space-y-1">
              {/* Text */}
              <button
                onClick={() => handleDownload('txt')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FileText className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Plain Text</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">.txt</div>
                </div>
              </button>

              {/* Markdown */}
              <button
                onClick={() => handleDownload('md')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Code className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Markdown</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">.md</div>
                </div>
              </button>

              {/* HTML */}
              <button
                onClick={() => handleDownload('html')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FileCode className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">HTML</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">.html (Print to PDF)</div>
                </div>
              </button>

              {/* JSON */}
              <button
                onClick={() => handleDownload('json')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FileJson className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">JSON</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">.json</div>
                </div>
              </button>

              {/* CSV */}
              <button
                onClick={() => handleDownload('csv')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Table className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">CSV</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">.csv</div>
                </div>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

              {/* Copy to Clipboard */}
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <div className="flex-1 text-left">
                  <div className="font-medium">
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
