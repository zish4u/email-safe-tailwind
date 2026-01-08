/**
 * Style Controls - Reusable Style Input Components
 * 
 * UI controls for editing component styles (spacing, typography, colors, etc.)
 */

'use client';

import React from 'react';
import { HexColorPicker } from 'react-colorful';
import * as Icons from 'lucide-react';
import type { ComponentNode, StyleProperties } from '../types';

interface StyleControlsProps {
    component: ComponentNode;
    updateStyles: (id: string, styles: Partial<StyleProperties>) => void;
}

export default function StyleControls({ component, updateStyles }: StyleControlsProps) {
    const styles = component.styles;

    const handleStyleChange = (key: keyof StyleProperties, value: string) => {
        updateStyles(component.id, { [key]: value });
    };

    return (
        <div className="space-y-6">
            {/* Spacing Section */}
            <Section title="Spacing" icon={Icons.Space}>
                <SpacingControl
                    label="Padding"
                    values={{
                        top: styles.paddingTop || '0px',
                        right: styles.paddingRight || '0px',
                        bottom: styles.paddingBottom || '0px',
                        left: styles.paddingLeft || '0px',
                    }}
                    onChange={(side, value) => {
                        const key = `padding${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof StyleProperties;
                        handleStyleChange(key, value);
                    }}
                />
                <SpacingControl
                    label="Margin"
                    values={{
                        top: styles.marginTop || '0px',
                        right: styles.marginRight || '0px',
                        bottom: styles.marginBottom || '0px',
                        left: styles.marginLeft || '0px',
                    }}
                    onChange={(side, value) => {
                        const key = `margin${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof StyleProperties;
                        handleStyleChange(key, value);
                    }}
                />
            </Section>

            {/* Typography Section */}
            {['text', 'button'].includes(component.type) && (
                <Section title="Typography" icon={Icons.Type}>
                    <div className="space-y-3">
                        <InputField
                            label="Font Family"
                            value={styles.fontFamily || 'Arial, sans-serif'}
                            onChange={(value) => handleStyleChange('fontFamily', value)}
                            placeholder="Arial, sans-serif"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <InputField
                                label="Font Size"
                                value={styles.fontSize || '16px'}
                                onChange={(value) => handleStyleChange('fontSize', value)}
                                placeholder="16px"
                            />
                            <InputField
                                label="Line Height"
                                value={styles.lineHeight || '1.5'}
                                onChange={(value) => handleStyleChange('lineHeight', value)}
                                placeholder="1.5"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Font Weight</label>
                            <select
                                value={styles.fontWeight || '400'}
                                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="300">Light (300)</option>
                                <option value="400">Normal (400)</option>
                                <option value="500">Medium (500)</option>
                                <option value="600">Semibold (600)</option>
                                <option value="700">Bold (700)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Text Align</label>
                            <div className="grid grid-cols-4 gap-1 bg-gray-800/50 p-1 rounded-lg">
                                {['left', 'center', 'right', 'justify'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => handleStyleChange('textAlign', align)}
                                        className={`p-2 rounded transition-all ${styles.textAlign === align
                                                ? 'bg-purple-500 text-white'
                                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                                            }`}
                                        title={align}
                                    >
                                        {align === 'left' && <Icons.AlignLeft className="w-4 h-4" />}
                                        {align === 'center' && <Icons.AlignCenter className="w-4 h-4" />}
                                        {align === 'right' && <Icons.AlignRight className="w-4 h-4" />}
                                        {align === 'justify' && <Icons.AlignJustify className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ColorInput
                            label="Text Color"
                            value={styles.color || '#333333'}
                            onChange={(value) => handleStyleChange('color', value)}
                        />
                    </div>
                </Section>
            )}

            {/* Background Section */}
            <Section title="Background" icon={Icons.Palette}>
                <ColorInput
                    label="Background Color"
                    value={styles.backgroundColor || '#ffffff'}
                    onChange={(value) => handleStyleChange('backgroundColor', value)}
                />
            </Section>

            {/* Border Section */}
            <Section title="Border" icon={Icons.Square}>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <InputField
                            label="Border Width"
                            value={styles.borderWidth || '0px'}
                            onChange={(value) => handleStyleChange('borderWidth', value)}
                            placeholder="0px"
                        />
                        <InputField
                            label="Border Radius"
                            value={styles.borderRadius || '0px'}
                            onChange={(value) => handleStyleChange('borderRadius', value)}
                            placeholder="0px"
                        />
                    </div>
                    <ColorInput
                        label="Border Color"
                        value={styles.borderColor || '#dddddd'}
                        onChange={(value) => handleStyleChange('borderColor', value)}
                    />
                </div>
            </Section>

            {/* Width/Height Section */}
            <Section title="Dimensions" icon={Icons.Maximize}>
                <div className="grid grid-cols-2 gap-3">
                    <InputField
                        label="Width"
                        value={styles.width || 'auto'}
                        onChange={(value) => handleStyleChange('width', value)}
                        placeholder="auto"
                    />
                    <InputField
                        label="Max Width"
                        value={styles.maxWidth || 'none'}
                        onChange={(value) => handleStyleChange('maxWidth', value)}
                        placeholder="none"
                    />
                </div>
            </Section>
        </div>
    );
}

/**
 * Section Component
 */
function Section({
    title,
    icon: Icon,
    children
}: {
    title: string;
    icon: any;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
                <Icon className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-semibold text-gray-300">{title}</h4>
            </div>
            {children}
        </div>
    );
}

/**
 * Input Field Component
 */
function InputField({
    label,
    value,
    onChange,
    placeholder
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                placeholder={placeholder}
            />
        </div>
    );
}

/**
 * Color Input Component with Picker
 */
function ColorInput({
    label,
    value,
    onChange
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    const [showPicker, setShowPicker] = React.useState(false);

    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
            <div className="flex gap-2">
                <div className="relative">
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition-all overflow-hidden"
                        style={{ backgroundColor: value }}
                    />
                    {showPicker && (
                        <div className="absolute top-full mt-2 z-50">
                            <div className="relative">
                                <HexColorPicker color={value} onChange={onChange} />
                                <button
                                    onClick={() => setShowPicker(false)}
                                    className="absolute -right-2 -top-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 hover:bg-gray-700"
                                >
                                    <Icons.X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono focus:outline-none focus:border-purple-500/50"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}

/**
 * Spacing Control Component
 */
function SpacingControl({
    label,
    values,
    onChange,
}: {
    label: string;
    values: { top: string; right: string; bottom: string; left: string };
    onChange: (side: 'top' | 'right' | 'bottom' | 'left', value: string) => void;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="text"
                    value={values.top}
                    onChange={(e) => onChange('top', e.target.value)}
                    className="px-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-purple-500/50"
                    placeholder="Top"
                />
                <input
                    type="text"
                    value={values.bottom}
                    onChange={(e) => onChange('bottom', e.target.value)}
                    className="px-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-purple-500/50"
                    placeholder="Bottom"
                />
                <input
                    type="text"
                    value={values.left}
                    onChange={(e) => onChange('left', e.target.value)}
                    className="px-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-purple-500/50"
                    placeholder="Left"
                />
                <input
                    type="text"
                    value={values.right}
                    onChange={(e) => onChange('right', e.target.value)}
                    className="px-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-purple-500/50"
                    placeholder="Right"
                />
            </div>
        </div>
    );
}
