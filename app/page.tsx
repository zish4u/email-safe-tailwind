"use client"
import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';

export default function TailwindEmailConverter() {
  const [inputHtml, setInputHtml] = useState('<div class="bg-blue-600 p-8 text-white font-bold text-center">Hello Email!</div>');
  const [outputHtml, setOutputHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [ghostTableEnabled, setGhostTableEnabled] = useState(true);

  const getPreviewWidth = () => {
    switch (previewSize) {
      case 'desktop': return 'max-w-4xl';
      case 'tablet': return 'max-w-2xl';
      case 'mobile': return 'max-w-sm';
      default: return 'max-w-4xl';
    }
  };

  const getPreviewContainerWidth = () => {
    switch (previewSize) {
      case 'desktop': return '100%';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  const addGhostTables = (html: string) => {
    if (!ghostTableEnabled) return html;

    // Convert rem units to px (1rem = 16px)
    const remToPx = (value: string) => {
      const remMatch = value.match(/(\d+\.?\d*)rem/);
      if (remMatch) {
        const pxValue = parseFloat(remMatch[1]) * 16;
        return value.replace(remMatch[0], `${pxValue}px`);
      }
      return value;
    };

    // Extract background color from original HTML for table cell
    const getBackgroundColor = (content: string) => {
      const bgRegex = /style="[^"]*background-color:\s*([^;]+)/i;
      const match = content.match(bgRegex);
      return match ? match[1].trim() : '#ffffff';
    };

    // Process HTML to preserve original styling for modern clients
    const processForModernClients = (content: string) => {
      // Find divs with padding and background styles and convert rem to px
      const styleRegex = /<([^>]+)\s+style="([^"]*)"(?:[^>]*)>/gi;
      return content.replace(styleRegex, (match: string, beforeTag: string, styleContent: string) => {
        // Convert rem to px but preserve all other styles
        const processedStyle = styleContent.replace(/padding:\s*([^;]+)/gi, (paddingMatch: string, paddingValue: string) => {
          const pxPadding = remToPx(paddingValue.trim());
          return `padding: ${pxPadding}`;
        });

        return `<${beforeTag} style="${processedStyle}">`;
      });
    };

    // Process HTML specifically for Outlook (with padding: 0)
    const processForOutlook = (content: string) => {
      // Find divs with padding styles and remove padding for Outlook only
      const styleRegex = /<([^>]+)\s+style="([^"]*)"(?:[^>]*)>/gi;
      return content.replace(styleRegex, (match: string, beforeTag: string, styleContent: string) => {
        // Remove padding from style for Outlook compatibility
        const processedStyle = styleContent
          .replace(/padding:\s*[^;]+;?/gi, '')
          .replace(/background-color:\s*[^;]+;?/gi, '')
          .trim();

        // Add padding: 0 for Outlook (mismatched padding approach)
        let finalStyle = processedStyle;
        if (finalStyle && !finalStyle.endsWith(';')) {
          finalStyle += ';';
        }
        finalStyle += 'padding: 0; mso-padding-alt: 0;';

        return `<${beforeTag} style="${finalStyle}">`;
      });
    };

    const backgroundColor = getBackgroundColor(html);

    // Create two versions: one for Outlook, one for modern clients
    const modernHtml = processForModernClients(html);
    const outlookHtml = processForOutlook(html);

    // Wrap with conditional comments for different email clients
    return `
      <!--[if mso]>
      <table role="presentation" width="600" align="center" style="width:600px; border-collapse: collapse;">
        <tr>
          <td style="padding: 32px; background-color: ${backgroundColor}; text-align: center; vertical-align: middle;">
            ${outlookHtml}
          </td>
        </tr>
      </table>
      <![endif]-->
      
      <!--[if !mso]><!-->
      ${modernHtml}
      <!--<![endif]-->
    `;
  };

  const handleConvert = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: JSON.stringify({ html: inputHtml }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      const processedHtml = addGhostTables(data.result);
      setOutputHtml(processedHtml);
      setShowPreview(true);
    } catch (error) {
      console.error("Conversion failed", error);
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      <div className="p-6 flex flex-col">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Tailwind → Email Inliner
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={!outputHtml}
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleConvert}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Converting...' : 'Inline Styles'}
            </button>
          </div>
        </header>

        <main className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* INPUT SECTION */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400 font-mono">Input (Tailwind HTML)</label>
                <button
                  onClick={() => copyToClipboard(inputHtml)}
                  className="bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <textarea
                className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[400px]"
                value={inputHtml}
                onChange={(e) => setInputHtml(e.target.value)}
              />
            </div>

            {/* OUTPUT SECTION */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400 font-mono">Output (Email-Ready HTML)</label>
                <button
                  onClick={() => copyToClipboard(outputHtml)}
                  disabled={!outputHtml}
                  className="bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <div className="relative flex-1">
                <textarea
                  readOnly
                  className="w-full h-full p-4 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm text-emerald-400 outline-none resize-none min-h-[400px]"
                  value={outputHtml}
                  placeholder="Your email-safe code will appear here..."
                />
              </div>
            </div>
          </div>

          {/* GHOST TABLE CONTROLS */}
          <div className="mb-4 flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-300">Ghost Table Automator (Outlook Killer)</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGhostTableEnabled(!ghostTableEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ghostTableEnabled ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ghostTableEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
                <span className="text-xs text-gray-400">
                  {ghostTableEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Automatically wraps content in Outlook-compatible tables to fix rendering issues
            </div>
          </div>

          {/* EMAIL PREVIEW SECTION */}
          {showPreview && outputHtml && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400 font-mono">Email Preview</label>
                <div className="flex gap-2">
                  {/* Responsive Size Controls */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewSize('desktop')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${previewSize === 'desktop'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewSize('tablet')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${previewSize === 'tablet'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Tablet
                    </button>
                    <button
                      onClick={() => setPreviewSize('mobile')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${previewSize === 'mobile'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Mobile
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const previewWindow = window.open('', '_blank');
                      if (previewWindow) {
                        previewWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>Email Preview</title>
                          <style>
                            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                            .email-container { max-width: 600px; margin: 0 auto; }
                          </style>
                        </head>
                        <body>
                          <div class="email-container">
                            ${outputHtml}
                          </div>
                        </body>
                        </html>
                      `);
                        previewWindow.document.close();
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-xs px-3 py-1 rounded"
                  >
                    Open in New Window
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-700">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-2">Email Client Preview</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {previewSize === 'desktop' && '1200px+'}
                      {previewSize === 'tablet' && '768px'}
                      {previewSize === 'mobile' && '375px'}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 overflow-x-auto">
                  <div
                    className="mx-auto bg-white shadow-sm border border-gray-200 rounded transition-all duration-300"
                    style={{ width: getPreviewContainerWidth() }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: outputHtml }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}