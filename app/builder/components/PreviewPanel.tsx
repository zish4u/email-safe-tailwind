"use client";
import React, { memo, useState, useCallback, useEffect } from 'react';
import { TemplateComponent, PreviewMode, CANVAS_SIZES } from '../types';
import { generateEmailHtml } from '../utils/htmlGenerator';

interface PreviewPanelProps {
    components: TemplateComponent[];
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Preview Panel with HTML output and live preview
 */
export const PreviewPanel = memo(function PreviewPanel({
    components,
    isOpen,
    onClose,
}: PreviewPanelProps) {
    const [previewHtml, setPreviewHtml] = useState('');
    const [codeHtml, setCodeHtml] = useState('');
    const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [preheaderText, setPreheaderText] = useState('');
    const [copied, setCopied] = useState(false);

    // Generate HTML when components change
    useEffect(() => {
        if (isOpen && components.length > 0) {
            // Generate web-friendly HTML for the preview iframe
            const webHtml = generateEmailHtml(components, {
                preheaderText: preheaderText || undefined,
                mode: 'web'
            });
            setPreviewHtml(webHtml);

            // Generate email-client-safe HTML for the code view and export
            const emailHtml = generateEmailHtml(components, {
                preheaderText: preheaderText || undefined,
                mode: 'email'
            });
            setCodeHtml(emailHtml);
        }
    }, [components, isOpen, preheaderText]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(codeHtml).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [codeHtml]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([codeHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'email-template.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [codeHtml]);

    if (!isOpen) return null;

    const previewWidth = CANVAS_SIZES[previewMode].width;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">📧 Email Preview</h2>

                        {/* Tabs */}
                        <div className="flex bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'preview'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                👁️ Preview
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'code'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                💻 HTML Code
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Device toggle */}
                        <div className="flex bg-gray-800 rounded-lg p-1">
                            {(['desktop', 'mobile'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setPreviewMode(mode)}
                                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${previewMode === mode
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {mode === 'desktop' ? '🖥️' : '📲'}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex h-[calc(90vh-140px)]">
                    {/* Main Preview/Code Area */}
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'preview' ? (
                            <div className="h-full overflow-auto bg-gray-800 p-6">
                                <div
                                    className="mx-auto bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
                                    style={{ width: previewWidth }}
                                >
                                    <iframe
                                        srcDoc={previewHtml}
                                        title="Email Preview"
                                        className="w-full border-0"
                                        style={{ height: '600px' }}
                                        sandbox="allow-same-origin"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full overflow-auto bg-gray-950 p-4">
                                <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap break-words">
                                    {codeHtml || 'No HTML generated yet'}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-72 border-l border-gray-700 bg-gray-800/50 p-4 overflow-y-auto">
                        {/* Preheader Text */}
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                📋 Preheader Text
                            </label>
                            <textarea
                                value={preheaderText}
                                onChange={(e) => setPreheaderText(e.target.value)}
                                placeholder="Preview text shown in email clients..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none resize-none"
                                rows={3}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This text appears in email client previews
                            </p>
                        </div>

                        {/* Email Client Compatibility */}
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                ✅ Compatibility
                            </h3>
                            <div className="space-y-2">
                                <CompatibilityItem label="Gmail Web" status="good" />
                                <CompatibilityItem label="Gmail App" status="good" />
                                <CompatibilityItem label="Outlook 365" status="good" />
                                <CompatibilityItem label="Outlook Desktop" status="good" hint="MSO conditionals included" />
                                <CompatibilityItem label="Apple Mail" status="good" />
                                <CompatibilityItem label="Yahoo Mail" status="good" />
                            </div>
                        </div>

                        {/* Export Options */}
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                📤 Export
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={handleCopy}
                                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${copied
                                        ? 'bg-green-600 text-white'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                                        }`}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy HTML'}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    ⬇️ Download HTML
                                </button>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                            <h4 className="text-xs font-semibold text-blue-400 mb-2">💡 Tips</h4>
                            <ul className="text-xs text-blue-300/80 space-y-1">
                                <li>• Test in multiple email clients</li>
                                <li>• Keep images under 100KB</li>
                                <li>• Use web-safe fonts</li>
                                <li>• Include alt text for images</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-700 bg-gray-800/50 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        {codeHtml.length.toLocaleString()} characters • {components.length} components
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Compatibility indicator
const CompatibilityItem = memo(function CompatibilityItem({
    label,
    status,
    hint,
}: { label: string; status: 'good' | 'partial' | 'limited'; hint?: string }) {
    const colors = {
        good: 'text-green-400 bg-green-400/10',
        partial: 'text-yellow-400 bg-yellow-400/10',
        limited: 'text-red-400 bg-red-400/10',
    };
    const icons = { good: '✓', partial: '⚠', limited: '✕' };

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors[status]}`}>
            <span className="text-sm">{icons[status]}</span>
            <span className="text-sm flex-1">{label}</span>
            {hint && <span className="text-xs opacity-60">{hint}</span>}
        </div>
    );
});

export default PreviewPanel;
