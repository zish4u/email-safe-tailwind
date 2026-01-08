/**
 * Toolbar - Canvas Controls
 * 
 * Top toolbar with undo/redo, preview modes, zoom controls, and export options.
 */

'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { useBuilderStore } from '../store';
import type { PreviewMode, ZoomLevel } from '../types';

export default function Toolbar() {
    const canUndo = useBuilderStore((state) => state.canUndo());
    const canRedo = useBuilderStore((state) => state.canRedo());
    const undo = useBuilderStore((state) => state.undo);
    const redo = useBuilderStore((state) => state.redo);

    const canvasSettings = useBuilderStore((state) => state.canvasSettings);
    const setZoom = useBuilderStore((state) => state.setZoom);
    const setPreviewMode = useBuilderStore((state) => state.setPreviewMode);
    const toggleGrid = useBuilderStore((state) => state.toggleGrid);
    const exportToJSON = useBuilderStore((state) => state.exportToJSON);
    const exportToHTML = useBuilderStore((state) => state.exportToHTML);

    const zoomLevels: ZoomLevel[] = [50, 75, 100, 150, 200];
    const previewModes: { mode: PreviewMode; icon: any; label: string }[] = [
        { mode: 'desktop', icon: Icons.Monitor, label: 'Desktop' },
        { mode: 'tablet', icon: Icons.Tablet, label: 'Tablet' },
        { mode: 'mobile', icon: Icons.Smartphone, label: 'Mobile' },
    ];

    const handleExportJSON = () => {
        const json = exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-template-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportHTML = () => {
        const html = exportToHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-template-${Date.now()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-14 bg-[#1a1a2e] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
            {/* Left Section - Undo/Redo */}
            <div className="flex items-center gap-2">
                <button
                    onClick={undo}
                    disabled={!canUndo}
                    className={`p-2 rounded-lg transition-all ${canUndo
                            ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                            : 'text-gray-600 cursor-not-allowed'
                        }`}
                    title="Undo (Ctrl+Z)"
                >
                    <Icons.Undo2 className="w-4 h-4" />
                </button>
                <button
                    onClick={redo}
                    disabled={!canRedo}
                    className={`p-2 rounded-lg transition-all ${canRedo
                            ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                            : 'text-gray-600 cursor-not-allowed'
                        }`}
                    title="Redo (Ctrl+Y)"
                >
                    <Icons.Redo2 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-700 mx-2" />

                {/* Grid Toggle */}
                <button
                    onClick={toggleGrid}
                    className={`p-2 rounded-lg transition-all ${canvasSettings.showGrid
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                        }`}
                    title="Toggle Grid"
                >
                    <Icons.Grid3x3 className="w-4 h-4" />
                </button>
            </div>

            {/* Center Section - Preview Modes */}
            <div className="flex items-center gap-1 bg-gray-800/50 p-1 rounded-lg">
                {previewModes.map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => setPreviewMode(mode)}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-all ${canvasSettings.previewMode === mode
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                            }`}
                        title={label}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{label}</span>
                    </button>
                ))}
            </div>

            {/* Right Section - Zoom & Export */}
            <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            const currentIndex = zoomLevels.indexOf(canvasSettings.zoom);
                            if (currentIndex > 0) setZoom(zoomLevels[currentIndex - 1]);
                        }}
                        disabled={canvasSettings.zoom === zoomLevels[0]}
                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Zoom Out"
                    >
                        <Icons.ZoomOut className="w-4 h-4" />
                    </button>

                    <select
                        value={canvasSettings.zoom}
                        onChange={(e) => setZoom(Number(e.target.value) as ZoomLevel)}
                        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-purple-500/50"
                    >
                        {zoomLevels.map((zoom) => (
                            <option key={zoom} value={zoom}>
                                {zoom}%
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            const currentIndex = zoomLevels.indexOf(canvasSettings.zoom);
                            if (currentIndex < zoomLevels.length - 1) setZoom(zoomLevels[currentIndex + 1]);
                        }}
                        disabled={canvasSettings.zoom === zoomLevels[zoomLevels.length - 1]}
                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Zoom In"
                    >
                        <Icons.ZoomIn className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-700 mx-2" />

                {/* Export Options */}
                <div className="relative group">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20">
                        <Icons.Download className="w-4 h-4" />
                        Export
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <button
                            onClick={handleExportHTML}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 rounded-t-lg"
                        >
                            <Icons.Code className="w-4 h-4" />
                            Export as HTML
                        </button>
                        <button
                            onClick={handleExportJSON}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 rounded-b-lg"
                        >
                            <Icons.FileJson className="w-4 h-4" />
                            Export as JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
