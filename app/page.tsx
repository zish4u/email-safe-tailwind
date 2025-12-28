"use client"
import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';

// Copy Button Component
const CopyButton: React.FC<{ text: string; label: string; disabled?: boolean }> = ({ text, label, disabled = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (disabled) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={disabled}
      className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted/80"
      aria-label={copied ? 'Copied!' : label}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default function TailwindEmailConverter() {
  const [inputHtml, setInputHtml] = useState('<div class="bg-blue-600 p-8 text-white font-bold text-center">Hello Email!</div>');
  const [outputHtml, setOutputHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [ghostTableEnabled, setGhostTableEnabled] = useState(true);
  const [conversionError, setConversionError] = useState<string | null>(null);

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
    setConversionError(null);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: JSON.stringify({ html: inputHtml }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.statusText}`);
      }

      const data = await response.json();
      const processedHtml = addGhostTables(data.result);
      setOutputHtml(processedHtml);
      setShowPreview(true);
    } catch (error) {
      console.error("Conversion failed", error);
      setConversionError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="p-6 flex flex-col">
        <header className="mb-6 flex justify-between items-center animate-slide-in">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Tailwind → Email Inliner
            </h1>
            <p className="text-muted-foreground mt-2">Convert Tailwind CSS to email-safe HTML with Outlook compatibility</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={!outputHtml}
              className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted/80"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleConvert}
              disabled={loading || !inputHtml.trim()}
              className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Converting...
                </span>
              ) : 'Inline Styles'}
            </button>
          </div>
        </header>

        {conversionError && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 animate-slide-in">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Conversion Error</span>
            </div>
            <p className="mt-1 text-sm">{conversionError}</p>
          </div>
        )}

        <main className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* INPUT SECTION */}
            <div className="flex flex-col animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-muted-foreground font-mono">Input (Tailwind HTML)</label>
                <CopyButton text={inputHtml} label="Copy Input" />
              </div>
              <textarea
                className="flex-1 p-4 bg-muted border border-border rounded-lg font-mono text-sm focus:ring-2 focus:ring-ring outline-none resize-none min-h-[400px] transition-all duration-200"
                value={inputHtml}
                onChange={(e) => setInputHtml(e.target.value)}
                placeholder="Enter your Tailwind CSS HTML here..."
                aria-label="Input HTML code"
              />
            </div>

            {/* OUTPUT SECTION */}
            <div className="flex flex-col animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-muted-foreground font-mono">Output (Email-Ready HTML)</label>
                <CopyButton text={outputHtml} label="Copy Output" disabled={!outputHtml} />
              </div>
              <div className="relative flex-1">
                <textarea
                  readOnly
                  className="w-full h-full p-4 bg-background border border-border rounded-lg font-mono text-sm text-emerald-400 outline-none resize-none min-h-[400px] transition-all duration-200"
                  value={outputHtml}
                  placeholder="Your email-safe code will appear here..."
                  aria-label="Output HTML code"
                />
                {outputHtml && (
                  <div className="absolute top-2 right-2 text-xs text-emerald-400 font-mono">
                    {outputHtml.length} chars
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GHOST TABLE CONTROLS */}
          <div className="mb-6 flex items-center justify-between bg-muted border border-border rounded-lg p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Ghost Table Automator</label>
                <p className="text-xs text-muted-foreground mt-1">Automatically wraps content for Outlook compatibility</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGhostTableEnabled(!ghostTableEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ghostTableEnabled ? 'bg-accent' : 'bg-muted-foreground'
                    }`}
                  role="switch"
                  aria-checked={ghostTableEnabled}
                  aria-label="Toggle ghost tables"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ghostTableEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
                <span className="text-sm text-muted-foreground min-w-[60px]">
                  {ghostTableEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* EMAIL PREVIEW SECTION */}
          {showPreview && outputHtml && (
            <div className="flex flex-col animate-slide-in">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground font-mono">Email Preview</label>
                  <p className="text-xs text-muted-foreground mt-1">See how your email looks across different devices</p>
                </div>
                <div className="flex gap-3">
                  {/* Responsive Size Controls */}
                  <div className="flex bg-muted border border-border rounded-lg p-1">
                    {(['desktop', 'tablet', 'mobile'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setPreviewSize(size)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${previewSize === size
                            ? 'bg-accent text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        aria-label={`Preview as ${size}`}
                        aria-pressed={previewSize === size}
                      >
                        {size}
                      </button>
                    ))}
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
                            body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
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
                    className="px-3 py-1.5 rounded text-xs font-medium transition-all bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                    aria-label="Open preview in new window"
                  >
                    Open in New Window
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden border border-border shadow-lg">
                <div className="bg-muted px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" aria-hidden="true"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true"></div>
                      </div>
                      <span className="ml-2 font-medium">Email Client Preview</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded">
                      {previewSize === 'desktop' && '1200px+'}
                      {previewSize === 'tablet' && '768px'}
                      {previewSize === 'mobile' && '375px'}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 overflow-x-auto">
                  <div
                    className="mx-auto bg-white shadow-sm border border-gray-200 rounded-lg transition-all duration-300"
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