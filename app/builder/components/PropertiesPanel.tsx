"use client";
import React, { memo } from 'react';
import { TemplateComponent } from '../types';

interface PropertiesPanelProps {
    component: TemplateComponent | null;
    onUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    onOpenEditor: (component: TemplateComponent) => void;
}

/**
 * Properties Panel for editing selected component
 */
export const PropertiesPanel = memo(function PropertiesPanel({
    component,
    onUpdate,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onOpenEditor,
}: PropertiesPanelProps) {
    if (!component) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 h-full">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-5xl mb-3 opacity-30">📋</div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">No Selection</h3>
                    <p className="text-xs text-gray-500">
                        Click a component to edit properties
                    </p>
                </div>
            </div>
        );
    }

    const updatePosition = (field: 'x' | 'y', value: number) => {
        onUpdate(component.id, {
            position: { ...component.position, [field]: value } as { x: number; y: number },
        });
    };

    const updateSize = (field: 'width' | 'height', value: number) => {
        onUpdate(component.id, {
            size: { ...component.size, [field]: value } as { width: number; height: number },
        });
    };

    const updateStyle = (field: string, value: string | number) => {
        onUpdate(component.id, {
            style: { ...component.style, [field]: value },
        });
    };

    const updateProps = (field: string, value: unknown) => {
        onUpdate(component.id, {
            props: { ...component.props, [field]: value },
        });
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <span className="text-xl">⚙️</span>
                <span>Properties</span>
            </h2>

            {/* Component Info */}
            <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{component.type}</span>
                    <span className="text-xs text-gray-400 bg-gray-600/50 px-1.5 py-0.5 rounded">
                        {component.id.slice(0, 8)}
                    </span>
                </div>
                {component.nestLevel !== undefined && component.nestLevel > 0 && (
                    <div className="text-xs text-blue-400">Nested Level: {component.nestLevel}</div>
                )}
            </div>

            {/* Position & Size */}
            <Section title="📐 Position & Size">
                <div className="grid grid-cols-2 gap-2">
                    <NumberInput label="X" value={component.position?.x || 0} onChange={(v) => updatePosition('x', v)} />
                    <NumberInput label="Y" value={component.position?.y || 0} onChange={(v) => updatePosition('y', v)} />
                    <NumberInput label="Width" value={component.size?.width || 150} onChange={(v) => updateSize('width', v)} min={40} />
                    <NumberInput label="Height" value={component.size?.height || 100} onChange={(v) => updateSize('height', v)} min={20} />
                </div>
            </Section>

            {/* Style */}
            <Section title="🎨 Style">
                <div className="space-y-3">
                    <ColorInput
                        label="Background"
                        value={component.style?.backgroundColor || '#ffffff'}
                        onChange={(v) => updateStyle('backgroundColor', v)}
                    />
                    <ColorInput
                        label="Text Color"
                        value={component.style?.textColor || '#000000'}
                        onChange={(v) => updateStyle('textColor', v)}
                    />
                    <SelectInput
                        label="Font Size"
                        value={component.style?.fontSize || '14px'}
                        options={['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']}
                        onChange={(v) => updateStyle('fontSize', v)}
                    />
                    <SelectInput
                        label="Font Weight"
                        value={component.style?.fontWeight || 'normal'}
                        options={['normal', 'medium', 'semibold', 'bold']}
                        onChange={(v) => updateStyle('fontWeight', v)}
                    />
                    <SelectInput
                        label="Text Align"
                        value={component.style?.textAlign || 'center'}
                        options={['left', 'center', 'right']}
                        onChange={(v) => updateStyle('textAlign', v)}
                    />
                    <TextInput
                        label="Padding"
                        value={component.style?.padding || '0'}
                        onChange={(v) => updateStyle('padding', v)}
                        placeholder="e.g., 8px or 8px 16px"
                    />
                    <TextInput
                        label="Border Radius"
                        value={component.style?.borderRadius || '0'}
                        onChange={(v) => updateStyle('borderRadius', v)}
                        placeholder="e.g., 8px"
                    />
                    <TextInput
                        label="Border"
                        value={component.style?.border || 'none'}
                        onChange={(v) => updateStyle('border', v)}
                        placeholder="e.g., 1px solid #ccc"
                    />
                </div>
            </Section>

            {/* Component-specific props */}
            {['Text', 'Button', 'Card'].includes(component.type) && (
                <Section title="📝 Content">
                    <TextAreaInput
                        label="Text"
                        value={(component.props.children as string) || ''}
                        onChange={(v) => updateProps('children', v)}
                        placeholder="Enter content..."
                    />
                </Section>
            )}

            {component.type === 'Button' && (
                <Section title="🔗 Link">
                    <TextInput
                        label="URL"
                        value={(component.props.href as string) || '#'}
                        onChange={(v) => updateProps('href', v)}
                        placeholder="https://..."
                    />
                </Section>
            )}

            {component.type === 'Image' && (
                <Section title="🖼️ Image">
                    <TextInput
                        label="Source URL"
                        value={(component.props.src as string) || ''}
                        onChange={(v) => updateProps('src', v)}
                        placeholder="https://..."
                    />
                    <TextInput
                        label="Alt Text"
                        value={(component.props.alt as string) || ''}
                        onChange={(v) => updateProps('alt', v)}
                        placeholder="Image description"
                    />
                </Section>
            )}

            {component.type === 'Header' && (
                <Section title="📄 Header">
                    <TextInput
                        label="Title"
                        value={(component.props.title as string) || ''}
                        onChange={(v) => updateProps('title', v)}
                    />
                    <TextInput
                        label="Subtitle"
                        value={(component.props.subtitle as string) || ''}
                        onChange={(v) => updateProps('subtitle', v)}
                    />
                    <TextInput
                        label="Logo URL"
                        value={(component.props.logo as string) || ''}
                        onChange={(v) => updateProps('logo', v)}
                        placeholder="https://..."
                    />
                </Section>
            )}

            {component.type === 'Footer' && (
                <Section title="📌 Footer">
                    <TextInput
                        label="Company"
                        value={(component.props.company as string) || ''}
                        onChange={(v) => updateProps('company', v)}
                    />
                    <TextInput
                        label="Address"
                        value={(component.props.address as string) || ''}
                        onChange={(v) => updateProps('address', v)}
                    />
                    <TextInput
                        label="Unsubscribe URL"
                        value={(component.props.unsubscribeLink as string) || ''}
                        onChange={(v) => updateProps('unsubscribeLink', v)}
                        placeholder="https://..."
                    />
                </Section>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-2">
                <button
                    onClick={() => onOpenEditor(component)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Advanced Editor
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => onDuplicate(component.id)}
                        className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        title="Duplicate"
                    >
                        📋 Copy
                    </button>
                    <button
                        onClick={() => onMoveUp(component.id)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        title="Move Up"
                    >
                        ↑
                    </button>
                    <button
                        onClick={() => onMoveDown(component.id)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        title="Move Down"
                    >
                        ↓
                    </button>
                </div>
                <button
                    onClick={() => onDelete(component.id)}
                    className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm font-medium transition-colors"
                >
                    🗑️ Delete Component
                </button>
            </div>
        </div>
    );
});

// Section wrapper
const Section = memo(function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
});

// Input components
const NumberInput = memo(function NumberInput({
    label,
    value,
    onChange,
    min,
}: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
    return (
        <div>
            <label className="text-xs text-gray-400">{label}</label>
            <input
                type="number"
                value={value}
                min={min}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none"
            />
        </div>
    );
});

const TextInput = memo(function TextInput({
    label,
    value,
    onChange,
    placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <label className="text-xs text-gray-400">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none"
            />
        </div>
    );
});

const TextAreaInput = memo(function TextAreaInput({
    label,
    value,
    onChange,
    placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <label className="text-xs text-gray-400">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none resize-none"
            />
        </div>
    );
});

const ColorInput = memo(function ColorInput({
    label,
    value,
    onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-600"
            />
            <div className="flex-1">
                <label className="text-xs text-gray-400">{label}</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white focus:border-blue-500 focus:outline-none"
                />
            </div>
        </div>
    );
});

const SelectInput = memo(function SelectInput({
    label,
    value,
    options,
    onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
    return (
        <div>
            <label className="text-xs text-gray-400">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
});

export default PropertiesPanel;
