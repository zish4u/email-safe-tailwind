// =====================================================
// Advanced Email Builder - Comprehensive Styling Controls
// =====================================================

import React, { useState } from 'react';
import {
    EmailComponent,
    ModuleComponent,
    GridComponent,
    GridItemComponent,
    GroupComponent,
    TextElement,
    ImageElement,
    ButtonElement,
    DividerElement,
    SpacerElement,
    EMAIL_SAFE_FONTS
} from '../advanced-types';

// ==================== UTILITY COMPONENTS ====================

interface InputControlProps {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: 'text' | 'number' | 'color' | 'select';
    options?: readonly string[];
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
}

const InputControl: React.FC<InputControlProps> = ({
    label,
    value,
    onChange,
    type = 'text',
    options,
    min,
    max,
    step,
    placeholder
}) => {
    const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className="mb-3">
            <label htmlFor={inputId} className="block text-xs font-medium text-gray-300 mb-1">
                {label}
            </label>
            {type === 'select' ? (
                <select
                    id={inputId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {options?.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : type === 'color' ? (
                <div className="flex items-center gap-2">
                    <input
                        id={inputId}
                        type="color"
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-8 w-16 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            ) : (
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value)}
                    min={min}
                    max={max}
                    step={step}
                    placeholder={placeholder}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            )}
        </div>
    );
};

interface SpacingControlProps {
    label: string;
    spacing: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
        horizontal?: number;
        vertical?: number;
        all?: number;
    } | undefined;
    onChange: (spacing: any) => void;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ label, spacing, onChange }) => {
    const [mode, setMode] = useState<'all' | 'individual' | 'xy'>('all');

    const handleAllChange = (value: number) => {
        onChange({ all: value });
    };

    const handleIndividualChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
        onChange({
            ...spacing,
            [side]: value,
            all: undefined,
            horizontal: undefined,
            vertical: undefined,
        });
    };

    const handleXYChange = (axis: 'horizontal' | 'vertical', value: number) => {
        onChange({
            ...spacing,
            [axis]: value,
            all: undefined,
            top: axis === 'vertical' ? value : spacing?.top,
            bottom: axis === 'vertical' ? value : spacing?.bottom,
            left: axis === 'horizontal' ? value : spacing?.left,
            right: axis === 'horizontal' ? value : spacing?.right,
        });
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-300">{label}</label>
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-gray-300"
                >
                    <option value="all">All</option>
                    <option value="xy">Horizontal/Vertical</option>
                    <option value="individual">Individual</option>
                </select>
            </div>

            {mode === 'all' && (
                <InputControl
                    label="All Sides"
                    value={spacing?.all || 0}
                    onChange={(value) => handleAllChange(value as number)}
                    type="number"
                    min={0}
                    step={1}
                />
            )}

            {mode === 'xy' && (
                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Horizontal"
                        value={spacing?.horizontal || 0}
                        onChange={(value) => handleXYChange('horizontal', value as number)}
                        type="number"
                        min={0}
                        step={1}
                    />
                    <InputControl
                        label="Vertical"
                        value={spacing?.vertical || 0}
                        onChange={(value) => handleXYChange('vertical', value as number)}
                        type="number"
                        min={0}
                        step={1}
                    />
                </div>
            )}

            {mode === 'individual' && (
                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Top"
                        value={spacing?.top || 0}
                        onChange={(value) => handleIndividualChange('top', value as number)}
                        type="number"
                        min={0}
                        step={1}
                    />
                    <InputControl
                        label="Right"
                        value={spacing?.right || 0}
                        onChange={(value) => handleIndividualChange('right', value as number)}
                        type="number"
                        min={0}
                        step={1}
                    />
                    <InputControl
                        label="Bottom"
                        value={spacing?.bottom || 0}
                        onChange={(value) => handleIndividualChange('bottom', value as number)}
                        type="number"
                        min={0}
                        step={1}
                    />
                    <InputControl
                        label="Left"
                        value={spacing?.left || 0}
                        onChange={(value) => handleIndividualChange('left', value as number)}
                        type="number"
                        min={0}
                        step={1}
                    />
                </div>
            )}
        </div>
    );
};

interface BorderControlProps {
    border: {
        width?: number;
        color?: string;
        style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge';
        side?: 'top' | 'right' | 'bottom' | 'left' | 'all';
    } | undefined;
    onChange: (border: any) => void;
}

const BorderControl: React.FC<BorderControlProps> = ({ border, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-xs font-medium text-gray-300 mb-2">Border</label>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <InputControl
                    label="Width"
                    value={border?.width || 0}
                    onChange={(value) => onChange({ ...border, width: value as number })}
                    type="number"
                    min={0}
                    step={1}
                />
                <InputControl
                    label="Style"
                    value={border?.style || 'solid'}
                    onChange={(value) => onChange({ ...border, style: value as any })}
                    type="select"
                    options={['solid', 'dashed', 'dotted', 'double']}
                />
            </div>

            <InputControl
                label="Color"
                value={border?.color || '#000000'}
                onChange={(value) => onChange({ ...border, color: value as string })}
                type="color"
            />

            <InputControl
                label="Side"
                value={border?.side || 'all'}
                onChange={(value) => onChange({ ...border, side: value as any })}
                type="select"
                options={['all', 'top', 'right', 'bottom', 'left']}
            />
        </div>
    );
};

interface BoxShadowControlProps {
    shadow: {
        x?: number;
        y?: number;
        blur?: number;
        spread?: number;
        color?: string;
        inset?: boolean;
    } | undefined;
    onChange: (shadow: any) => void;
}

const BoxShadowControl: React.FC<BoxShadowControlProps> = ({ shadow, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-xs font-medium text-gray-300 mb-2">Box Shadow</label>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <InputControl
                    label="X Offset"
                    value={shadow?.x || 0}
                    onChange={(value) => onChange({ ...shadow, x: value as number })}
                    type="number"
                    step={1}
                />
                <InputControl
                    label="Y Offset"
                    value={shadow?.y || 0}
                    onChange={(value) => onChange({ ...shadow, y: value as number })}
                    type="number"
                    step={1}
                />
                <InputControl
                    label="Blur"
                    value={shadow?.blur || 0}
                    onChange={(value) => onChange({ ...shadow, blur: value as number })}
                    type="number"
                    min={0}
                    step={1}
                />
                <InputControl
                    label="Spread"
                    value={shadow?.spread || 0}
                    onChange={(value) => onChange({ ...shadow, spread: value as number })}
                    type="number"
                    step={1}
                />
            </div>

            <div className="mb-2">
                <InputControl
                    label="Color"
                    value={shadow?.color || '#000000'}
                    onChange={(value) => onChange({ ...shadow, color: value as string })}
                    type="color"
                />
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                    type="checkbox"
                    checked={shadow?.inset || false}
                    onChange={(e) => onChange({ ...shadow, inset: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span>Inset Shadow</span>
            </label>
        </div>
    );
};

// ==================== COMPONENT-SPECIFIC CONTROLS ====================

interface ModuleStyleControlsProps {
    component: ModuleComponent;
    onChange: (updates: Partial<ModuleComponent>) => void;
}

export const ModuleStyleControls: React.FC<ModuleStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (props: Partial<ModuleComponent['props']>) => {
        onChange({ props: { ...component.props, ...props } });
    };

    return (
        <div className="space-y-4">
            {/* Layout Controls */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Layout</h4>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer mb-2">
                    <input
                        type="checkbox"
                        checked={component.props.fullWidth || false}
                        onChange={(e) => updateProps({ fullWidth: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Full Width</span>
                </label>

                <InputControl
                    label="Max Width (px)"
                    value={component.props.maxWidth || 600}
                    onChange={(value) => updateProps({ maxWidth: value as number })}
                    type="number"
                    min={300}
                    max={1200}
                    step={10}
                />

                <InputControl
                    label="Alignment"
                    value={component.props.align || 'left'}
                    onChange={(value) => updateProps({ align: value as any })}
                    type="select"
                    options={['left', 'center', 'right']}
                />
            </div>

            {/* Spacing */}
            <SpacingControl
                label="Padding"
                spacing={component.props.padding}
                onChange={(padding) => updateProps({ padding })}
            />

            <SpacingControl
                label="Margin"
                spacing={component.props.margin}
                onChange={(margin) => updateProps({ margin })}
            />

            {/* Colors & Background */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Colors & Background</h4>

                <InputControl
                    label="Background Color"
                    value={component.props.backgroundColor || '#ffffff'}
                    onChange={(value) => updateProps({ backgroundColor: value as string })}
                    type="color"
                />
            </div>

            {/* Border & Effects */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Border & Effects</h4>

                <InputControl
                    label="Border Radius"
                    value={component.props.borderRadius || '0px'}
                    onChange={(value) => updateProps({ borderRadius: value as string })}
                    placeholder="e.g., 4px or 50%"
                />

                <BorderControl
                    border={component.props.border}
                    onChange={(border) => updateProps({ border })}
                />

                <BoxShadowControl
                    shadow={component.props.boxShadow}
                    onChange={(boxShadow) => updateProps({ boxShadow })}
                />
            </div>
        </div>
    );
};

interface GridStyleControlsProps {
    component: GridComponent;
    onChange: (updates: Partial<GridComponent>) => void;
}

export const GridStyleControls: React.FC<GridStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (props: Partial<GridComponent['props']>) => {
        onChange({ props: { ...component.props, ...props } });
    };

    return (
        <div className="space-y-4">
            {/* Grid Layout */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Grid Layout</h4>

                <InputControl
                    label="Columns"
                    value={component.props.columns || 2}
                    onChange={(value) => updateProps({ columns: value as number })}
                    type="number"
                    min={1}
                    max={6}
                    step={1}
                />

                <InputControl
                    label="Column Spacing (px)"
                    value={component.props.columnSpacing || 20}
                    onChange={(value) => updateProps({ columnSpacing: value as number })}
                    type="number"
                    min={0}
                    step={1}
                />

                <InputControl
                    label="Row Spacing (px)"
                    value={component.props.rowSpacing || 0}
                    onChange={(value) => updateProps({ rowSpacing: value as number })}
                    type="number"
                    min={0}
                    step={1}
                />

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer mb-2">
                    <input
                        type="checkbox"
                        checked={component.props.equalHeight || false}
                        onChange={(e) => updateProps({ equalHeight: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Equal Height Columns</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer mb-2">
                    <input
                        type="checkbox"
                        checked={component.props.collapseOnMobile || false}
                        onChange={(e) => updateProps({ collapseOnMobile: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Collapse on Mobile</span>
                </label>

                {component.props.collapseOnMobile && (
                    <InputControl
                        label="Mobile Direction"
                        value={component.props.mobileDirection || 'vertical'}
                        onChange={(value) => updateProps({ mobileDirection: value as any })}
                        type="select"
                        options={['vertical', 'horizontal']}
                    />
                )}
            </div>

            {/* Spacing */}
            <SpacingControl
                label="Padding"
                spacing={component.props.padding}
                onChange={(padding) => updateProps({ padding })}
            />

            <SpacingControl
                label="Margin"
                spacing={component.props.margin}
                onChange={(margin) => updateProps({ margin })}
            />

            {/* Colors & Background */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Colors & Background</h4>

                <InputControl
                    label="Background Color"
                    value={component.props.backgroundColor || 'transparent'}
                    onChange={(value) => updateProps({ backgroundColor: value as string })}
                    type="color"
                />
            </div>

            {/* Border & Effects */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Border & Effects</h4>

                <InputControl
                    label="Border Radius"
                    value={component.props.borderRadius || '0px'}
                    onChange={(value) => updateProps({ borderRadius: value as string })}
                    placeholder="e.g., 4px or 50%"
                />

                <BorderControl
                    border={component.props.border}
                    onChange={(border) => updateProps({ border })}
                />

                <BoxShadowControl
                    shadow={component.props.boxShadow}
                    onChange={(boxShadow) => updateProps({ boxShadow })}
                />
            </div>
        </div>
    );
};

interface TextStyleControlsProps {
    component: TextElement;
    onChange: (updates: Partial<TextElement>) => void;
}

export const TextStyleControls: React.FC<TextStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (props: Partial<TextElement['props']>) => {
        onChange({ props: { ...component.props, ...props } });
    };

    return (
        <div className="space-y-4">
            {/* Content */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Content</h4>

                <InputControl
                    label="Text Content"
                    value={component.props.content || ''}
                    onChange={(value) => updateProps({ content: value as string })}
                    type="text"
                    placeholder="Enter your text here"
                />

                <InputControl
                    label="Placeholder"
                    value={component.props.placeholder || ''}
                    onChange={(value) => updateProps({ placeholder: value as string })}
                    type="text"
                    placeholder="Placeholder text"
                />
            </div>

            {/* Typography */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Typography</h4>

                <InputControl
                    label="Font Family"
                    value={component.props.fontFamily || 'Arial, sans-serif'}
                    onChange={(value) => updateProps({ fontFamily: value as string })}
                    type="select"
                    options={EMAIL_SAFE_FONTS}
                />

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Font Size"
                        value={component.props.fontSize || 14}
                        onChange={(value) => updateProps({ fontSize: value as number })}
                        type="number"
                        min={8}
                        max={72}
                        step={1}
                    />

                    <InputControl
                        label="Font Weight"
                        value={component.props.fontWeight || 'normal'}
                        onChange={(value) => updateProps({ fontWeight: value as string })}
                        type="select"
                        options={['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Line Height"
                        value={component.props.lineHeight || 1.5}
                        onChange={(value) => updateProps({ lineHeight: value as number })}
                        type="number"
                        min={1}
                        max={3}
                        step={0.1}
                    />

                    <InputControl
                        label="Letter Spacing"
                        value={component.props.letterSpacing || 0}
                        onChange={(value) => updateProps({ letterSpacing: value as number })}
                        type="number"
                        min={-2}
                        max={10}
                        step={0.1}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Text Align"
                        value={component.props.textAlign || 'left'}
                        onChange={(value) => updateProps({ textAlign: value as any })}
                        type="select"
                        options={['left', 'center', 'right', 'justify']}
                    />

                    <InputControl
                        label="Text Transform"
                        value={component.props.textTransform || 'none'}
                        onChange={(value) => updateProps({ textTransform: value as any })}
                        type="select"
                        options={['none', 'uppercase', 'lowercase', 'capitalize']}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Text Decoration"
                        value={component.props.textDecoration || 'none'}
                        onChange={(value) => updateProps({ textDecoration: value as any })}
                        type="select"
                        options={['none', 'underline', 'line-through']}
                    />

                    <InputControl
                        label="Font Style"
                        value={component.props.fontStyle || 'normal'}
                        onChange={(value) => updateProps({ fontStyle: value as any })}
                        type="select"
                        options={['normal', 'italic']}
                    />
                </div>

                <InputControl
                    label="Text Color"
                    value={component.props.color || '#333333'}
                    onChange={(value) => updateProps({ color: value as string })}
                    type="color"
                />

                <InputControl
                    label="Text Shadow"
                    value={component.props.textShadow || ''}
                    onChange={(value) => updateProps({ textShadow: value as string })}
                    type="text"
                    placeholder="e.g., 2px 2px 4px rgba(0,0,0,0.1)"
                />
            </div>

            {/* Layout & Spacing */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Layout & Spacing</h4>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Width"
                        value={component.props.width || 'auto'}
                        onChange={(value) => updateProps({ width: value as string })}
                        type="text"
                        placeholder="e.g., 100px, 50%, auto"
                    />

                    <InputControl
                        label="Height"
                        value={component.props.height || 'auto'}
                        onChange={(value) => updateProps({ height: value as string })}
                        type="text"
                        placeholder="e.g., 100px, auto"
                    />
                </div>

                <SpacingControl
                    label="Padding"
                    spacing={component.props.padding}
                    onChange={(padding) => updateProps({ padding })}
                />

                <SpacingControl
                    label="Margin"
                    spacing={component.props.margin}
                    onChange={(margin) => updateProps({ margin })}
                />
            </div>

            {/* Background & Border */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Background & Border</h4>

                <InputControl
                    label="Background Color"
                    value={component.props.backgroundColor || 'transparent'}
                    onChange={(value) => updateProps({ backgroundColor: value as string })}
                    type="color"
                />

                <InputControl
                    label="Border Radius"
                    value={component.props.borderRadius || '0px'}
                    onChange={(value) => updateProps({ borderRadius: value as string })}
                    placeholder="e.g., 4px or 50%"
                />

                <BorderControl
                    border={component.props.border}
                    onChange={(border) => updateProps({ border })}
                />

                <BoxShadowControl
                    shadow={component.props.boxShadow}
                    onChange={(boxShadow) => updateProps({ boxShadow })}
                />
            </div>
        </div>
    );
};

interface ButtonStyleControlsProps {
    component: ButtonElement;
    onChange: (updates: Partial<ButtonElement>) => void;
}

export const ButtonStyleControls: React.FC<ButtonStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (props: Partial<ButtonElement['props']>) => {
        onChange({ props: { ...component.props, ...props } });
    };

    return (
        <div className="space-y-4">
            {/* Content */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Content</h4>

                <InputControl
                    label="Button Text"
                    value={component.props.text || ''}
                    onChange={(value) => updateProps({ text: value as string })}
                    type="text"
                    placeholder="Click me"
                />
            </div>

            {/* Button Styling */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Button Styling</h4>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Background Color"
                        value={component.props.backgroundColor || '#007bff'}
                        onChange={(value) => updateProps({ backgroundColor: value as string })}
                        type="color"
                    />

                    <InputControl
                        label="Hover Background"
                        value={component.props.hoverBackgroundColor || '#0056b3'}
                        onChange={(value) => updateProps({ hoverBackgroundColor: value as string })}
                        type="color"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Text Color"
                        value={component.props.textColor || '#ffffff'}
                        onChange={(value) => updateProps({ textColor: value as string })}
                        type="color"
                    />

                    <InputControl
                        label="Hover Text Color"
                        value={component.props.hoverTextColor || '#ffffff'}
                        onChange={(value) => updateProps({ hoverTextColor: value as string })}
                        type="color"
                    />
                </div>

                <InputControl
                    label="Border Radius"
                    value={component.props.borderRadius || '4px'}
                    onChange={(value) => updateProps({ borderRadius: value as string })}
                    placeholder="e.g., 4px or 50%"
                />

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Border Width"
                        value={component.props.borderWidth || 0}
                        onChange={(value) => updateProps({ borderWidth: value as number })}
                        type="number"
                        min={0}
                        step={1}
                    />

                    <InputControl
                        label="Border Style"
                        value={component.props.borderStyle || 'solid'}
                        onChange={(value) => updateProps({ borderStyle: value as any })}
                        type="select"
                        options={['solid', 'dashed', 'dotted']}
                    />
                </div>

                <InputControl
                    label="Border Color"
                    value={component.props.borderColor || 'transparent'}
                    onChange={(value) => updateProps({ borderColor: value as string })}
                    type="color"
                />
            </div>

            {/* Button Dimensions */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Button Dimensions</h4>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Width"
                        value={component.props.width || 'auto'}
                        onChange={(value) => updateProps({ width: value as string })}
                        type="text"
                        placeholder="auto, 100px, 50%"
                    />

                    <InputControl
                        label="Height"
                        value={component.props.height || 'auto'}
                        onChange={(value: any) => updateProps({ height: value === 'auto' ? 'auto' : (parseInt(value) || 'auto') as number | 'auto' })}
                        type="text"
                        placeholder="auto, 40px"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Padding X"
                        value={component.props.paddingX || 20}
                        onChange={(value) => updateProps({ paddingX: value as number })}
                        type="number"
                        min={0}
                        step={1}
                    />

                    <InputControl
                        label="Padding Y"
                        value={component.props.paddingY || 12}
                        onChange={(value) => updateProps({ paddingY: value as number })}
                        type="number"
                        min={0}
                        step={1}
                    />
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={component.props.fullWidth || false}
                        onChange={(e) => updateProps({ fullWidth: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Full Width</span>
                </label>
            </div>

            {/* Typography */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Typography</h4>

                <InputControl
                    label="Font Family"
                    value={component.props.fontFamily || 'Arial, sans-serif'}
                    onChange={(value) => updateProps({ fontFamily: value as string })}
                    type="select"
                    options={EMAIL_SAFE_FONTS}
                />

                <div className="grid grid-cols-2 gap-2">
                    <InputControl
                        label="Font Size"
                        value={component.props.fontSize || 14}
                        onChange={(value) => updateProps({ fontSize: value as number })}
                        type="number"
                        min={8}
                        max={72}
                        step={1}
                    />

                    <InputControl
                        label="Font Weight"
                        value={component.props.fontWeight || 'normal'}
                        onChange={(value) => updateProps({ fontWeight: value as string })}
                        type="select"
                        options={['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']}
                    />
                </div>

                <InputControl
                    label="Text Transform"
                    value={component.props.textTransform || 'none'}
                    onChange={(value) => updateProps({ textTransform: value as any })}
                    type="select"
                    options={['none', 'uppercase', 'lowercase', 'capitalize']}
                />
            </div>

            {/* Button Behavior */}
            <div>
                <h4 className="text-sm font-medium text-gray-200 mb-3">Button Behavior</h4>

                <InputControl
                    label="Link URL"
                    value={component.props.link || ''}
                    onChange={(value) => updateProps({ link: value as string })}
                    type="text"
                    placeholder="https://example.com"
                />

                <InputControl
                    label="Link Target"
                    value={component.props.linkTarget || '_blank'}
                    onChange={(value) => updateProps({ linkTarget: value as any })}
                    type="select"
                    options={['_blank', '_self']}
                />

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={component.props.disabled || false}
                        onChange={(e) => updateProps({ disabled: e.target.checked })}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Disabled</span>
                </label>
            </div>
        </div>
    );
};

// ==================== GRID ITEM STYLE CONTROLS ====================

interface GridItemStyleControlsProps {
    component: GridItemComponent;
    onChange: (updates: Partial<GridItemComponent>) => void;
}

export const GridItemStyleControls: React.FC<GridItemStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (newProps: Partial<GridItemComponent['props']>) => {
        onChange({ props: { ...component.props, ...newProps } });
    };

    return (
        <div className="space-y-4">
            <div className="border-b border-gray-700 pb-2">
                <h3 className="text-sm font-medium text-white">Grid Item Settings</h3>
            </div>

            <InputControl
                label="Column Index"
                value={component.columnIndex}
                onChange={(value) => onChange({ columnIndex: Number(value) })}
                type="number"
                min={0}
            />

            <InputControl
                label="Width"
                value={component.props.width || ''}
                onChange={(value) => updateProps({ width: value })}
                placeholder="e.g., 100, 50%"
            />

            <InputControl
                label="Vertical Align"
                value={component.props.verticalAlign || 'top'}
                onChange={(value) => updateProps({ verticalAlign: value as any })}
                type="select"
                options={['top', 'middle', 'bottom']}
            />
        </div>
    );
};

// ==================== GROUP STYLE CONTROLS ====================

interface GroupStyleControlsProps {
    component: GroupComponent;
    onChange: (updates: Partial<GroupComponent>) => void;
}

export const GroupStyleControls: React.FC<GroupStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (newProps: Partial<GroupComponent['props']>) => {
        onChange({ props: { ...component.props, ...newProps } });
    };

    return (
        <div className="space-y-4">
            <div className="border-b border-gray-700 pb-2">
                <h3 className="text-sm font-medium text-white">Group Settings</h3>
            </div>

            <InputControl
                label="Display Name"
                value={component.props.displayName || ''}
                onChange={(value) => updateProps({ displayName: String(value) })}
                placeholder="Group name"
            />

            <InputControl
                label="Direction"
                value={component.props.direction || 'vertical'}
                onChange={(value) => updateProps({ direction: value as any })}
                type="select"
                options={['vertical', 'horizontal']}
            />

            <InputControl
                label="Spacing"
                value={component.props.spacing || 0}
                onChange={(value) => updateProps({ spacing: Number(value) })}
                type="number"
            />
        </div>
    );
};

// ==================== IMAGE STYLE CONTROLS ====================

interface ImageStyleControlsProps {
    component: ImageElement;
    onChange: (updates: Partial<ImageElement>) => void;
}

export const ImageStyleControls: React.FC<ImageStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (newProps: Partial<ImageElement['props']>) => {
        onChange({ props: { ...component.props, ...newProps } });
    };

    return (
        <div className="space-y-4">
            <div className="border-b border-gray-700 pb-2">
                <h3 className="text-sm font-medium text-white">Image Settings</h3>
            </div>

            <InputControl
                label="Image Source"
                value={component.props.src}
                onChange={(value) => updateProps({ src: String(value) })}
                placeholder="https://example.com/image.jpg"
            />

            <InputControl
                label="Alt Text"
                value={component.props.alt}
                onChange={(value) => updateProps({ alt: String(value) })}
                placeholder="Image description"
            />

            <InputControl
                label="Width"
                value={component.props.width || ''}
                onChange={(value) => updateProps({ width: value })}
                placeholder="e.g., 100, 100%, auto"
            />

            <InputControl
                label="Height"
                value={component.props.height || ''}
                onChange={(value) => updateProps({ height: value })}
                placeholder="e.g., 100, 100%, auto"
            />
        </div>
    );
};

// ==================== DIVIDER STYLE CONTROLS ====================

interface DividerStyleControlsProps {
    component: DividerElement;
    onChange: (updates: Partial<DividerElement>) => void;
}

export const DividerStyleControls: React.FC<DividerStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (newProps: Partial<DividerElement['props']>) => {
        onChange({ props: { ...component.props, ...newProps } });
    };

    return (
        <div className="space-y-4">
            <div className="border-b border-gray-700 pb-2">
                <h3 className="text-sm font-medium text-white">Divider Settings</h3>
            </div>

            <InputControl
                label="Height"
                value={component.props.height || 1}
                onChange={(value) => updateProps({ height: Number(value) })}
                type="number"
                min={1}
            />

            <InputControl
                label="Color"
                value={component.props.color || '#e0e0e0'}
                onChange={(value) => updateProps({ color: String(value) })}
                type="color"
            />

            <InputControl
                label="Style"
                value={component.props.style || 'solid'}
                onChange={(value) => updateProps({ style: value as any })}
                type="select"
                options={['solid', 'dashed', 'dotted', 'double']}
            />
        </div>
    );
};

// ==================== SPACER STYLE CONTROLS ====================

interface SpacerStyleControlsProps {
    component: SpacerElement;
    onChange: (updates: Partial<SpacerElement>) => void;
}

export const SpacerStyleControls: React.FC<SpacerStyleControlsProps> = ({ component, onChange }) => {
    const updateProps = (newProps: Partial<SpacerElement['props']>) => {
        onChange({ props: { ...component.props, ...newProps } });
    };

    return (
        <div className="space-y-4">
            <div className="border-b border-gray-700 pb-2">
                <h3 className="text-sm font-medium text-white">Spacer Settings</h3>
            </div>

            <InputControl
                label="Height"
                value={component.props.height}
                onChange={(value) => updateProps({ height: Number(value) })}
                type="number"
                min={1}
            />

            <InputControl
                label="Width"
                value={component.props.width || ''}
                onChange={(value) => updateProps({ width: value })}
                placeholder="e.g., 100, 100%, auto"
            />

            <InputControl
                label="Show in Editor"
                value={component.props.showInEditor ? 'true' : 'false'}
                onChange={(value) => updateProps({ showInEditor: value === 'true' })}
                type="select"
                options={['true', 'false']}
            />

            <InputControl
                label="Editor Color"
                value={component.props.editorColor || '#f0f0f0'}
                onChange={(value) => updateProps({ editorColor: String(value) })}
                type="color"
            />
        </div>
    );
};

// ==================== MAIN STYLE CONTROLS COMPONENT ====================

interface AdvancedStyleControlsProps {
    component: EmailComponent;
    onChange: (updates: Partial<EmailComponent>) => void;
}

export const AdvancedStyleControls: React.FC<AdvancedStyleControlsProps> = ({ component, onChange }) => {
    switch (component.type) {
        case 'Module':
            return <ModuleStyleControls component={component as ModuleComponent} onChange={onChange} />;
        case 'Grid':
            return <GridStyleControls component={component as GridComponent} onChange={onChange} />;
        case 'GridItem':
            return <GridItemStyleControls component={component as GridItemComponent} onChange={onChange} />;
        case 'Group':
            return <GroupStyleControls component={component as GroupComponent} onChange={onChange} />;
        case 'Text':
            return <TextStyleControls component={component as TextElement} onChange={onChange} />;
        case 'Image':
            return <ImageStyleControls component={component as ImageElement} onChange={onChange} />;
        case 'Button':
            return <ButtonStyleControls component={component as ButtonElement} onChange={onChange} />;
        case 'Divider':
            return <DividerStyleControls component={component as DividerElement} onChange={onChange} />;
        case 'Spacer':
            return <SpacerStyleControls component={component as SpacerElement} onChange={onChange} />;
        default:
            // Handle unknown or future component types
            const unknownComponent = component as any;
            return (
                <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">No styling controls available for {unknownComponent?.type || 'Unknown'}</p>
                </div>
            );
    }
};
