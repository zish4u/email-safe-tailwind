/**
 * Email Template Builder - Main Page
 * 
 * Professional email template builder with drag-and-drop functionality.
 */

'use client';

import React from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import ComponentLibrary from './components/ComponentLibrary';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import Toolbar from './components/Toolbar';
import { useBuilderStore } from './store';
import { useDragAndDrop } from './hooks/useDragAndDrop';

export default function TemplateBuilderPage() {
    const showComponentLibrary = useBuilderStore((state) => state.showComponentLibrary);
    const showPropertiesPanel = useBuilderStore((state) => state.showPropertiesPanel);
    const showLayersPanel = useBuilderStore((state) => state.showLayersPanel);

    const { handleDragStart, handleDragEnd } = useDragAndDrop();

    // Configure sensors for drag interactions
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Minimum distance to activate drag
            },
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-screen flex flex-col bg-[#0f0f1e] text-gray-100 overflow-hidden">
                {/* Top Navigation/Header */}
                <header className="h-16 bg-[#1a1a2e] border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 3v18" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                Email Template Builder
                            </h1>
                            <p className="text-xs text-gray-400">Create stunning email templates</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                            Templates
                        </button>
                        <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                            Settings
                        </button>
                        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20">
                            Save Template
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel - Component Library */}
                    {showComponentLibrary && (
                        <aside className="w-64 bg-[#1a1a2e] border-r border-gray-800 shrink-0 overflow-hidden">
                            <ComponentLibrary />
                        </aside>
                    )}

                    {/* Center Panel - Canvas Area */}
                    <main className="flex-1 flex flex-col overflow-hidden">
                        <Toolbar />
                        <div className="flex-1 overflow-auto">
                            <Canvas />
                        </div>
                        {showLayersPanel && <LayersPanel />}
                    </main>

                    {/* Right Panel - Properties */}
                    {showPropertiesPanel && (
                        <aside className="w-80 bg-[#1a1a2e] border-l border-gray-800 shrink-0 overflow-hidden">
                            <PropertiesPanel />
                        </aside>
                    )}
                </div>
            </div>
        </DndContext>
    );
}
