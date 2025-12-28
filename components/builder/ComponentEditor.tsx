import React from 'react';
import * as EmailComponents from '../email-components';
import { TemplateComponent } from '../../app/builder/types';

interface ComponentEditorProps {
    component: TemplateComponent;
    onUpdate: (props: Record<string, unknown>) => void;
    onClose: () => void;
}

export const ComponentEditor: React.FC<ComponentEditorProps> = ({ component, onUpdate, onClose }) => {
    const [localProps, setLocalProps] = React.useState(component.props);

    const handlePropChange = (propName: string, value: unknown) => {
        const newProps = { ...localProps, [propName]: value };
        setLocalProps(newProps);
        onUpdate(newProps);
    };

    const renderAdvancedPropEditor = (propName: string, propValue: unknown) => {
        const stringValue = String(propValue || '');
        const isBoolean = typeof propValue === 'boolean';
        const isArray = Array.isArray(propValue);

        // Color picker with preset options
        if (propName.includes('color') || propName.includes('Color')) {
            const colorPresets = [
                '#000000', '#ffffff', '#2563eb', '#dc2626', '#16a34a',
                '#ca8a04', '#9333ea', '#db2777', '#6b7280', '#f8fafc'
            ];

            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={stringValue.startsWith('#') ? stringValue : '#000000'}
                            onChange={(e) => handlePropChange(propName, e.target.value)}
                            className="w-12 h-12 border border-gray-600 rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            value={stringValue}
                            onChange={(e) => handlePropChange(propName, e.target.value)}
                            className="flex-1 bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                            placeholder="#000000"
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                        {colorPresets.map(color => (
                            <button
                                key={color}
                                onClick={() => handlePropChange(propName, color)}
                                className="w-8 h-8 rounded border-2 border-gray-600 hover:border-blue-500 transition-colors"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        // Size selectors with custom input
        if (propName === 'size' || propName === 'padding' || propName === 'spacing' || propName === 'thickness') {
            const sizeOptions = {
                size: ['xs', 'sm', 'md', 'lg', 'xl'],
                padding: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
                spacing: ['xs', 'sm', 'md', 'lg', 'xl'],
                thickness: ['thin', 'medium', 'thick']
            };

            const options = sizeOptions[propName as keyof typeof sizeOptions] || [];

            return (
                <div className="space-y-2">
                    <select
                        value={options.includes(stringValue) ? stringValue : 'custom'}
                        onChange={(e) => handlePropChange(propName, e.target.value === 'custom' ? propValue : e.target.value)}
                        className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                    >
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                        <option value="custom">Custom</option>
                    </select>
                    {!options.includes(stringValue) && (
                        <input
                            type="text"
                            value={stringValue}
                            onChange={(e) => handlePropChange(propName, e.target.value)}
                            className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                            placeholder="Enter custom value"
                        />
                    )}
                </div>
            );
        }

        // Alignment and positioning
        if (propName === 'align' || propName === 'textAlign') {
            const alignOptions = ['left', 'center', 'right', 'justify'];
            return (
                <div className="grid grid-cols-4 gap-2">
                    {alignOptions.map(align => (
                        <button
                            key={align}
                            onClick={() => handlePropChange(propName, align)}
                            className={`px-3 py-2 rounded text-sm capitalize ${stringValue === align
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {align}
                        </button>
                    ))}
                </div>
            );
        }

        // Typography controls
        if (propName === 'variant' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'span'].includes(stringValue)) {
            const textVariants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'span'];
            return (
                <select
                    value={stringValue}
                    onChange={(e) => handlePropChange(propName, e.target.value)}
                    className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                >
                    {textVariants.map(variant => (
                        <option key={variant} value={variant}>{variant.toUpperCase()}</option>
                    ))}
                </select>
            );
        }

        // Font weight
        if (propName === 'fontWeight') {
            const fontWeights = [
                { value: '100', label: 'Thin' },
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semibold' },
                { value: '700', label: 'Bold' },
                { value: '900', label: 'Black' }
            ];

            return (
                <select
                    value={stringValue}
                    onChange={(e) => handlePropChange(propName, e.target.value)}
                    className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                >
                    {fontWeights.map(weight => (
                        <option key={weight.value} value={weight.value}>{weight.label}</option>
                    ))}
                </select>
            );
        }

        // Dimensions (width, height)
        if (propName === 'width' || propName === 'height') {
            const dimensionPresets = ['auto', '100%', '50%', '25%', '200px', '300px', '400px', '600px'];

            return (
                <div className="space-y-2">
                    <select
                        value={dimensionPresets.includes(stringValue) ? stringValue : 'custom'}
                        onChange={(e) => handlePropChange(propName, e.target.value === 'custom' ? propValue : e.target.value)}
                        className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                    >
                        {dimensionPresets.map(preset => (
                            <option key={preset} value={preset}>{preset}</option>
                        ))}
                        <option value="custom">Custom</option>
                    </select>
                    {!dimensionPresets.includes(stringValue) && (
                        <input
                            type="text"
                            value={stringValue}
                            onChange={(e) => handlePropChange(propName, e.target.value)}
                            className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                            placeholder="Enter dimensions (px, %, rem, etc.)"
                        />
                    )}
                </div>
            );
        }

        // URLs (for images, links)
        if (propName === 'src' || propName === 'href' || propName === 'link') {
            return (
                <div className="space-y-2">
                    <input
                        type="url"
                        value={stringValue}
                        onChange={(e) => handlePropChange(propName, e.target.value)}
                        className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
                        placeholder="https://example.com/image.jpg"
                    />
                    {propName === 'src' && (
                        <div className="text-xs text-gray-400">
                            Enter image URL or use placeholder: https://via.placeholder.com/300x200
                        </div>
                    )}
                </div>
            );
        }

        // Boolean switches with labels
        if (typeof propValue === 'boolean') {
            return (
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={propValue}
                        onChange={(e) => handlePropChange(propName, e.target.checked)}
                        className="w-5 h-5 rounded text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">
                        {propValue ? 'Enabled' : 'Disabled'}
                    </span>
                </label>
            );
        }

        // Array editors (for links, social links, etc.)
        if (Array.isArray(propValue)) {
            return (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {propValue.map((item, index) => (
                        <div key={index} className="bg-gray-700 p-3 rounded space-y-2">
                            {typeof item === 'object' ? (
                                <div className="space-y-2">
                                    {Object.entries(item).map(([key, val]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-16 capitalize">{key}:</span>
                                            <input
                                                type={key === 'url' ? 'url' : 'text'}
                                                value={String(val)}
                                                onChange={(e) => {
                                                    const newArray = [...propValue];
                                                    newArray[index] = { ...item, [key]: e.target.value };
                                                    handlePropChange(propName, newArray);
                                                }}
                                                className="flex-1 bg-gray-600 text-gray-100 px-2 py-1 rounded text-xs"
                                                placeholder={key === 'url' ? 'https://...' : key}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={String(item)}
                                    onChange={(e) => {
                                        const newArray = [...propValue];
                                        newArray[index] = e.target.value;
                                        handlePropChange(propName, newArray);
                                    }}
                                    className="w-full bg-gray-600 text-gray-100 px-2 py-1 rounded text-xs"
                                />
                            )}
                            <button
                                onClick={() => {
                                    const newArray = propValue.filter((_, i) => i !== index);
                                    handlePropChange(propName, newArray);
                                }}
                                className="text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const newItem = propName === 'links'
                                ? { platform: 'facebook', url: 'https://facebook.com' }
                                : '';
                            handlePropChange(propName, [...propValue, newItem]);
                        }}
                        className="bg-gray-600 hover:bg-gray-500 text-xs px-3 py-2 rounded w-full"
                    >
                        Add Item
                    </button>
                </div>
            );
        }

        // Text content with rich text preview
        if (propName === 'children' && typeof propValue === 'string') {
            return (
                <div className="space-y-2">
                    <textarea
                        value={stringValue}
                        onChange={(e) => handlePropChange(propName, e.target.value)}
                        className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm h-32 resize-none"
                        placeholder="Enter content..."
                    />
                    <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded">
                        Preview: <span dangerouslySetInnerHTML={{ __html: stringValue.substring(0, 100) }} />
                        {stringValue.length > 100 && '...'}
                    </div>
                </div>
            );
        }

        // Default text input
        return (
            <input
                type="text"
                value={String(propValue)}
                onChange={(e) => handlePropChange(propName, e.target.value)}
                className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded text-sm"
            />
        );
    };

    const getComponentSpecificProps = () => {
        const allProps = { ...localProps };

        // Don't show these in the editor
        delete allProps.children;
        delete allProps.className;
        delete allProps.style;
        delete allProps.id;

        // Component-specific property organization
        const organizedProps: Record<string, Record<string, any>> = {
            'Content': {},
            'Appearance': {},
            'Layout': {},
            'Behavior': {},
            'Advanced': {}
        };

        Object.entries(allProps).forEach(([key, value]) => {
            if (key === 'children' || key === 'title' || key === 'subtitle' || key === 'alt') {
                organizedProps['Content'][key] = value;
            } else if (key.includes('color') || key.includes('Color') || key === 'variant' || key === 'fontWeight') {
                organizedProps['Appearance'][key] = value;
            } else if (key.includes('align') || key.includes('padding') || key.includes('margin') || key.includes('width') || key.includes('height')) {
                organizedProps['Layout'][key] = value;
            } else if (key === 'href' || key === 'target' || key === 'link' || key === 'onClick') {
                organizedProps['Behavior'][key] = value;
            } else {
                organizedProps['Advanced'][key] = value;
            }
        });

        return organizedProps;
    };

    const organizedProps = getComponentSpecificProps();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <div>
                        <h3 className="text-xl font-semibold text-white">Edit {component.type} Component</h3>
                        <p className="text-sm text-gray-400 mt-1">Customize appearance, content, and behavior</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-6">
                        {Object.entries(organizedProps).map(([category, props]) => (
                            Object.keys(props).length > 0 && (
                                <div key={category}>
                                    <h4 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
                                        {category}
                                    </h4>
                                    <div className="space-y-4">
                                        {Object.entries(props).map(([propName, propValue]) => (
                                            <div key={propName}>
                                                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                                                    {propName.replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                                {renderAdvancedPropEditor(propName, propValue)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}

                        {/* Content editor for components that accept children */}
                        {'children' in localProps && (
                            <div>
                                <h4 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-700">
                                    Content
                                </h4>
                                {renderAdvancedPropEditor('children', localProps.children)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
