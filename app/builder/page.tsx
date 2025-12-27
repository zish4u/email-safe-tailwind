"use client";
import React, { useState, useCallback, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
    pointerWithin
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { restrictToCanvas } from './modifiers/restrictToCanvas';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Navigation } from '@/components/Navigation';
import { ComponentEditor } from '@/components/builder/ComponentEditor';

// Local modules
import { TemplateComponent, PreviewMode, CANVAS_SIZES, ZOOM_LEVELS, DEFAULT_ZOOM } from './types';
import { useTemplateBuilder, useCanvasInteractions } from './hooks';
import { ComponentLibrary, BuilderCanvas, PropertiesPanel, PreviewPanel } from './components';

/**
 * Enhanced Email Template Builder
 * A drag-and-drop email template builder with Gmail/Outlook compatibility
 */
export default function EnhancedTemplateBuilder() {
    // Template state management
    const {
        components,
        selectedComponent,
        setSelectedComponent,
        addComponent,
        updateComponent,
        deleteComponent,
        updateComponentPosition,
        setComponentParent,
        duplicateComponent,
        moveComponentUp,
        moveComponentDown,
        saveTemplate,
        loadTemplate,
        deleteTemplate,
        startNewTemplate,
        createSampleTemplate,
        reorderComponent,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useTemplateBuilder();

    // UI state
    const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
    const [canvasZoom, setCanvasZoom] = useState(DEFAULT_ZOOM);
    const [showGrid, setShowGrid] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [editingComponent, setEditingComponent] = useState<TemplateComponent | null>(null);
    const [inlineEditing, setInlineEditing] = useState<string | null>(null);
    const [activeComponent, setActiveComponent] = useState<TemplateComponent | null>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // Canvas interactions
    const {
        isDragging,
        isResizing,
        dragGuides,
        canvasRef,
        handleResizeMouseDown,
        handleCanvasMouseMove,
        handleCanvasMouseUp,
    } = useCanvasInteractions({
        components,
        selectedComponent,
        setSelectedComponent,
        updateComponentPosition,
        previewMode,
        snapToGrid,
        canvasZoom,
    });

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 3 },
        })
    );

    // Flash action message
    const flashMessage = useCallback((message: string) => {
        setActionMessage(message);
        setTimeout(() => setActionMessage(null), 1500);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Delete selected component
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponent && !inlineEditing) {
                e.preventDefault();
                deleteComponent(selectedComponent);
                flashMessage('Deleted');
            }
            // Undo
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                undo();
                flashMessage('Undo');
            }
            // Redo
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                redo();
                flashMessage('Redo');
            }
            // Escape to deselect
            if (e.key === 'Escape') {
                setSelectedComponent(null);
                setInlineEditing(null);
            }
            // Duplicate
            if (e.ctrlKey && e.key === 'd' && selectedComponent) {
                e.preventDefault();
                duplicateComponent(selectedComponent);
                flashMessage('Duplicated');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedComponent, inlineEditing, deleteComponent, undo, redo, duplicateComponent, setSelectedComponent, flashMessage]);

    // Handle drag start
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const component = components.find(c => c.id === active.id);
        if (component) {
            setActiveComponent(component);
        }
    }, [components]);

    // Handle drag end
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveComponent(null);

        if (!over) return;
        if (active.id === over.id) return;

        const activeComp = components.find(c => c.id === active.id);
        const overComp = components.find(c => c.id === over.id);

        if (!activeComp || !overComp) return;

        // Define container types
        const containerTypes = ['Section', 'Row', 'Column', 'Card'];
        const isOverAContainer = containerTypes.includes(overComp.type);

        // Special handling for Spacer and Divider: they can be dropped into any container type
        if (['Spacer', 'Divider'].includes(activeComp.type) && isOverAContainer) {
            setComponentParent(active.id as string, over.id as string);
            return;
        }

        // 1. If dropping over a container, nest it
        if (['Section', 'Row', 'Column'].includes(overComp.type)) {
            // Avoid self-nesting or invalid nesting if needed
            setComponentParent(active.id as string, over.id as string);
            return;
        }

        // 2. If dropping over a non-container (e.g. Text, Button), nest into its parent (Reordering/Sibling)
        if (overComp.parentId) {
            // Check if we are reordering in the same parent
            if (activeComp.parentId === overComp.parentId) {
                reorderComponent(active.id as string, over.id as string);
            } else {
                // Moving from elsewhere into this parent
                setComponentParent(active.id as string, overComp.parentId);
            }
            return;
        }

    }, [components, setComponentParent, reorderComponent]);

    // Handle preview mode change
    const handlePreviewModeChange = useCallback((mode: PreviewMode) => {
        setPreviewMode(mode);
        // Zoom is now independent of preview mode
    }, []);

    // Handle zoom level change
    const handleZoomChange = useCallback((zoom: number) => {
        setCanvasZoom(zoom);
    }, []);

    // Get selected component for properties panel
    const selectedComponentData = selectedComponent
        ? components.find(c => c.id === selectedComponent) || null
        : null;

    return (
        <DndContext
            sensors={sensors}
            modifiers={[restrictToWindowEdges, restrictToCanvas]}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
                {/* Action Message Toast */}
                {actionMessage && (
                    <div className="fixed top-4 right-4 z-[100] bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium animate-fade-in">
                        {actionMessage}
                    </div>
                )}

                <Navigation />

                <div className="p-4 lg:p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                    Email Template Builder
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    Create beautiful, email-safe templates with drag & drop
                                </p>
                            </div>

                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Undo/Redo */}
                                <div className="flex bg-gray-800 rounded-lg p-1">
                                    <button
                                        onClick={() => { undo(); flashMessage('Undo'); }}
                                        disabled={!canUndo}
                                        className="px-2.5 py-1.5 rounded text-sm hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        title="Undo (Ctrl+Z)"
                                    >
                                        ↩
                                    </button>
                                    <button
                                        onClick={() => { redo(); flashMessage('Redo'); }}
                                        disabled={!canRedo}
                                        className="px-2.5 py-1.5 rounded text-sm hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        title="Redo (Ctrl+Y)"
                                    >
                                        ↪
                                    </button>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                                >
                                    👁️ Preview & Export
                                </button>
                                <button
                                    onClick={() => { saveTemplate(); flashMessage('Saved!'); }}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                                >
                                    💾 Save
                                </button>
                                <button
                                    onClick={() => { loadTemplate(); flashMessage('Loaded!'); }}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                                >
                                    📂 Load
                                </button>
                                <button
                                    onClick={createSampleTemplate}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
                                >
                                    ✨ Sample
                                </button>
                                <button
                                    onClick={startNewTemplate}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                                >
                                    📄 New
                                </button>
                            </div>
                        </div>

                        {/* Canvas Controls */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            {/* Preview Mode */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Device:</span>
                                <div className="flex bg-gray-700 rounded-lg p-0.5">
                                    {(['desktop', 'mobile'] as const).map((mode: any) => (
                                        <button
                                            key={mode}
                                            onClick={() => handlePreviewModeChange(mode)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${previewMode === mode
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:text-white'
                                                }`}
                                        >
                                            {mode === 'desktop' ? '🖥️ Desktop' : mode === 'tablet' ? '📱 Tablet' : '📲 Mobile'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Toggles */}
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showGrid}
                                    onChange={(e) => setShowGrid(e.target.checked)}
                                    className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-300">Grid</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={snapToGrid}
                                    onChange={(e) => setSnapToGrid(e.target.checked)}
                                    className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-300">Snap</span>
                            </label>

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Zoom:</span>
                                <div className="flex items-center bg-gray-700 rounded-lg p-0.5">
                                    <button
                                        onClick={() => handleZoomChange(Math.max(0.5, canvasZoom - 0.25))}
                                        disabled={canvasZoom <= 0.5}
                                        className="px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        title="Zoom Out"
                                    >
                                        −
                                    </button>
                                    <select
                                        value={canvasZoom}
                                        onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                                        className="bg-transparent text-xs text-gray-300 px-1 py-0.5 focus:outline-none"
                                    >
                                        {ZOOM_LEVELS.map((level) => (
                                            <option key={level} value={level} className="bg-gray-700">
                                                {Math.round(level * 100)}%
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleZoomChange(Math.min(2, canvasZoom + 0.25))}
                                        disabled={canvasZoom >= 2}
                                        className="px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        title="Zoom In"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Canvas size indicator */}
                            <div className="text-xs text-gray-500 ml-auto">
                                {CANVAS_SIZES[previewMode].width} × {CANVAS_SIZES[previewMode].height}px
                                {canvasZoom !== 1 && ` (${Math.round(canvasZoom * 100)}%)`}
                            </div>
                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                        {/* Component Library */}
                        <div className="lg:col-span-2">
                            <ComponentLibrary onDragStart={() => { }} />
                        </div>

                        {/* Canvas */}
                        <div className="lg:col-span-7">
                            <BuilderCanvas
                                components={components}
                                selectedComponent={selectedComponent}
                                previewMode={previewMode}
                                canvasZoom={canvasZoom}
                                showGrid={showGrid}
                                snapToGrid={snapToGrid}
                                isDragging={isDragging}
                                isResizing={isResizing}
                                dragGuides={dragGuides}
                                canvasRef={canvasRef}
                                inlineEditing={inlineEditing}
                                onSelectComponent={setSelectedComponent}
                                onDeleteComponent={deleteComponent}
                                onDuplicateComponent={duplicateComponent}
                                onUpdateComponent={updateComponent}
                                onAddComponent={addComponent}
                                onResizeMouseDown={handleResizeMouseDown}
                                onCanvasMouseMove={handleCanvasMouseMove}
                                onCanvasMouseUp={handleCanvasMouseUp}
                                onSetInlineEditing={setInlineEditing}
                                onOpenEditor={setEditingComponent}
                            />

                            {/* Component Tree (Mobile/Compact) */}
                            <div className="mt-4 lg:hidden bg-gray-800/50 rounded-xl border border-gray-700/50 p-3">
                                <h3 className="text-sm font-medium text-gray-300 mb-2">
                                    Components ({components.length})
                                </h3>
                                <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                    <div className="flex flex-wrap gap-1">
                                        {components.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setSelectedComponent(c.id)}
                                                className={`px-2 py-1 rounded text-xs ${selectedComponent === c.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                            >
                                                {c.type}
                                            </button>
                                        ))}
                                    </div>
                                </SortableContext>
                            </div>
                        </div>

                        {/* Properties Panel */}
                        <div className="lg:col-span-3">
                            <PropertiesPanel
                                component={selectedComponentData}
                                onUpdate={updateComponent}
                                onDelete={deleteComponent}
                                onDuplicate={duplicateComponent}
                                onMoveUp={moveComponentUp}
                                onMoveDown={moveComponentDown}
                                onOpenEditor={setEditingComponent}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Panel Modal */}
                <PreviewPanel
                    components={components}
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                />

                {/* Component Editor Modal */}
                {editingComponent && (
                    <ComponentEditor
                        component={editingComponent}
                        onUpdate={(updates) => updateComponent(editingComponent.id, updates)}
                        onClose={() => setEditingComponent(null)}
                    />
                )}

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeComponent && (
                        <div
                            className="bg-blue-500/30 border-2 border-blue-500 rounded-lg p-3 opacity-90 shadow-xl"
                            style={{
                                width: activeComponent.size?.width || 150,
                                height: activeComponent.size?.height || 100,
                            }}
                        >
                            <div className="text-center text-blue-400 text-sm font-medium">
                                {activeComponent.type}
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
