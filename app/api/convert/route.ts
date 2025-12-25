import { NextRequest, NextResponse } from 'next/server';

// Helper function to calculate pixel widths for Outlook
function getPixelWidth(className: string, totalWidth = 600): number {
    const widthMap: { [key: string]: number } = {
        'w-full': 1,
        'w-1/2': 1 / 2,
        'w-1/3': 1 / 3,
        'w-2/3': 2 / 3,
        'w-1/4': 1 / 4,
        'w-3/4': 3 / 4,
        'w-1/5': 1 / 5,
        'w-2/5': 2 / 5,
        'w-3/5': 3 / 5,
        'w-4/5': 4 / 5,
        'w-1/6': 1 / 6,
        'w-5/6': 5 / 6,
    };

    // Find which class exists in the element
    const match = Object.keys(widthMap).find(key => className.includes(key));

    // Return pixel value (rounded to avoid floating point issues in Outlook)
    return match ? Math.floor(totalWidth * widthMap[match]) : totalWidth;
}

// Simple CSS inlining function
function inlineStyles(html: string, options: { css: string; removeStyleTags?: boolean }) {
    const { css, removeStyleTags = true } = options;

    // Create a simple CSS parser and inliner
    const cssRules: { [selector: string]: string } = {};

    // Parse CSS rules and handle escaped selectors
    const ruleMatches = css.matchAll(/([^{]+)\s*{([^}]*)}/g);
    for (const match of ruleMatches) {
        let selector = match[1].trim();
        const properties = match[2].trim();

        // Handle escaped selectors (e.g., .hover\:bg-blue-500:hover)
        selector = selector.replace(/\\:/g, ':');

        cssRules[selector] = properties;
    }

    // Parse HTML and collect elements with their classes
    const elementRegex = /<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*class="([^"]*)"[^>]*)>/g;
    const elements: Array<{
        tag: string;
        fullMatch: string;
        attributes: string;
        classes: string[];
        existingStyle: string;
    }> = [];

    // Find all elements with classes
    let elementMatch;
    while ((elementMatch = elementRegex.exec(html)) !== null) {
        const fullMatch = elementMatch[0];
        const tag = elementMatch[1];
        const attributes = elementMatch[2];
        const classesStr = elementMatch[3];

        // Extract existing style attribute
        const styleMatch = attributes.match(/style="([^"]*)"/);
        const existingStyle = styleMatch ? styleMatch[1] : '';

        // Parse classes (handle multiple classes)
        const classes = classesStr.split(/\s+/).filter(cls => cls.length > 0);

        elements.push({
            tag,
            fullMatch,
            attributes,
            classes,
            existingStyle
        });
    }

    let processedHtml = html;

    // Process each element
    for (const element of elements) {
        const mergedStyles: string[] = [];

        // Add existing styles first (lower priority)
        if (element.existingStyle) {
            mergedStyles.push(element.existingStyle);
        }

        // Add styles from CSS rules (higher priority)
        for (const className of element.classes) {
            const classSelector = `.${className}`;
            if (cssRules[classSelector]) {
                mergedStyles.push(cssRules[classSelector]);
            }
        }

        // Merge and clean up styles with conflict resolution
        if (mergedStyles.length > 0) {
            // Parse all CSS properties and handle conflicts
            const propertyMap: { [property: string]: string } = {};

            for (const styleStr of mergedStyles) {
                // Split by semicolon and process each property
                const properties = styleStr.split(';').map(prop => prop.trim()).filter(prop => prop.length > 0);

                for (const prop of properties) {
                    const colonIndex = prop.indexOf(':');
                    if (colonIndex > 0) {
                        const property = prop.substring(0, colonIndex).trim();
                        const value = prop.substring(colonIndex + 1).trim();

                        // Handle property conflicts with priority rules
                        // Later styles (CSS classes) override earlier styles (existing styles)
                        // For width/height properties, prioritize percentage over rem values for layout
                        if (property === 'width' || property === 'height') {
                            const existingValue = propertyMap[property];
                            if (!existingValue || (value.includes('%') && !existingValue.includes('%'))) {
                                propertyMap[property] = value;
                            }
                        } else {
                            // For other properties, later values override earlier ones
                            propertyMap[property] = value;
                        }
                    }
                }
            }

            // Rebuild the CSS string from the property map
            const finalStyles = Object.entries(propertyMap)
                .map(([prop, value]) => `${prop}: ${value}`)
                .join('; ');

            // Clean up any remaining syntax issues
            let combinedStyles = finalStyles
                .replace(/;\s*;/g, ';')  // Remove double semicolons
                .replace(/;\s*$/, '')      // Remove trailing semicolon
                .replace(/\s+/g, ' ')     // Normalize spaces
                .trim();

            // Create new attributes with single style attribute
            let newAttributes = element.attributes;

            // Remove existing style attributes
            newAttributes = newAttributes.replace(/style="[^"]*"/g, '');

            // Remove extra spaces left from removed style attributes
            newAttributes = newAttributes.replace(/\s+/g, ' ').trim();

            // Add the new merged style attribute
            if (newAttributes && !newAttributes.endsWith(' ')) {
                newAttributes += ' ';
            }
            newAttributes += `style="${combinedStyles}"`;

            // Replace the element in the HTML
            const newElement = `<${element.tag} ${newAttributes}>`;
            processedHtml = processedHtml.replace(element.fullMatch, newElement);
        }
    }

    // Remove style tags if requested
    if (removeStyleTags) {
        processedHtml = processedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    }

    processedHtml = fixOutlookTableStructure(processedHtml);

    return processedHtml;
}

// Fix Outlook table structure for proper column layout
function fixOutlookTableStructure(html: string): string {
    // Find [if mso] conditional comment blocks
    const msoRegex = /<!--\[if mso[^>]*>[\s\S]*?<!\[endif\]-->/gi;

    return html.replace(msoRegex, (msoBlock) => {
        // Find flex containers within MSO blocks and replace them entirely
        const flexRegex = /<div[^>]*class="([^"]*flex[^"]*)"[^>]*>([\s\S]*?)<\/div>/gi;

        return msoBlock.replace(flexRegex, (flexMatch) => {
            const flexClasses = flexMatch[1];
            const flexContent = flexMatch[2];

            // Extract all child divs with width classes
            const childDivRegex = /<div[^>]*class="([^"]*\b(w-\d+\/\d+|w-full)\b[^"]*)"[^>]*>([\s\S]*?)<\/div>/gi;
            const childDivs = [...flexContent.matchAll(childDivRegex)];

            if (childDivs.length > 1) {
                // Create proper table structure to replace the flex container
                let tableContent = '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr>';

                for (const childDiv of childDivs) {
                    const fullDivMatch = childDiv[0];
                    const classes = childDiv[1];
                    const divContent = childDiv[2];

                    // Use the getPixelWidth helper for accurate pixel calculation
                    const pixelWidth = getPixelWidth(classes);

                    // Extract inline styles from the div and remove flex-related properties
                    const styleMatch = fullDivMatch.match(/style="([^"]*)"/);
                    let styles = styleMatch ? styleMatch[1] : '';

                    // Remove flex-related properties that Outlook doesn't understand
                    styles = styles
                        .replace(/display:\s*flex;?\s*/gi, '')
                        .replace(/flex-direction:\s*[^;]+;?\s*/gi, '')
                        .replace(/justify-content:\s*[^;]+;?\s*/gi, '')
                        .replace(/align-items:\s*[^;]+;?\s*/gi, '')
                        .replace(/flex:\s*[^;]+;?\s*/gi, '')
                        .replace(/;\s*;/g, ';')
                        .replace(/;\s*$/, '')
                        .trim();

                    // Create td element with pixel width and cleaned styles
                    const tdElement = `<td width="${pixelWidth}" valign="top" style="width: ${pixelWidth}px; ${styles}">${divContent}</td>`;
                    tableContent += tdElement;
                }

                tableContent += '</tr></table>';
                return tableContent;
            }

            // If no multiple columns found, return original flex content
            return flexMatch;
        });
    });
}



export async function POST(request: NextRequest) {
    try {
        const { html } = await request.json();

        if (!html) {
            return NextResponse.json({ error: 'HTML is required' }, { status: 400 });
        }

        // Use comprehensive hardcoded Tailwind CSS (reliable approach)
        const tailwindCSS = `
                /* Background Colors */
                .bg-blue-600 { background-color: #2563eb; }
                .bg-blue-300 { background-color: #93c5fd; }
                .bg-red-100 { background-color: #fee2e2; }
                .bg-red-600 { background-color: #dc2626; }
                .bg-green-100 { background-color: #dcfce7; }
                .bg-green-600 { background-color: #16a34a; }
                .bg-yellow-100 { background-color: #fef3c7; }
                .bg-yellow-600 { background-color: #ca8a04; }
                .bg-purple-100 { background-color: #f3e8ff; }
                .bg-purple-600 { background-color: #9333ea; }
                .bg-pink-100 { background-color: #fdf2f8; }
                .bg-pink-600 { background-color: #db2777; }
                .bg-gray-50 { background-color: #f9fafb; }
                .bg-gray-100 { background-color: #f3f4f6; }
                .bg-gray-200 { background-color: #e5e7eb; }
                .bg-gray-300 { background-color: #d1d5db; }
                .bg-gray-400 { background-color: #9ca3af; }
                .bg-gray-500 { background-color: #6b7280; }
                .bg-gray-600 { background-color: #4b5563; }
                .bg-gray-700 { background-color: #374151; }
                .bg-gray-800 { background-color: #1f2937; }
                .bg-gray-900 { background-color: #111827; }
                .bg-white { background-color: #ffffff; }

                /* Text Colors */
                .text-white { color: #ffffff; }
                .text-black { color: #000000; }
                .text-blue-600 { color: #2563eb; }
                .text-blue-100 { color: #dbeafe; }
                .text-blue-300 { color: #93c5fd; }
                .text-blue-400 { color: #60a5fa; }
                .text-blue-500 { color: #3b82f6; }
                .text-red-600 { color: #dc2626; }
                .text-red-100 { color: #fee2e2; }
                .text-red-300 { color: #fca5a5; }
                .text-red-400 { color: #f87171; }
                .text-red-500 { color: #ef4444; }
                .text-green-600 { color: #16a34a; }
                .text-green-100 { color: #dcfce7; }
                .text-green-300 { color: #86efac; }
                .text-green-400 { color: #4ade80; }
                .text-green-500 { color: #22c55e; }
                .text-yellow-600 { color: #ca8a04; }
                .text-yellow-100 { color: #fef3c7; }
                .text-yellow-300 { color: #fde047; }
                .text-yellow-400 { color: #facc15; }
                .text-yellow-500 { color: #eab308; }
                .text-purple-600 { color: #9333ea; }
                .text-purple-100 { color: #f3e8ff; }
                .text-purple-300 { color: #d8b4fe; }
                .text-purple-400 { color: #c084fc; }
                .text-purple-500 { color: #a855f7; }
                .text-pink-600 { color: #db2777; }
                .text-pink-100 { color: #fdf2f8; }
                .text-pink-300 { color: #f9a8d4; }
                .text-pink-400 { color: #f472b6; }
                .text-pink-500 { color: #ec4899; }
                .text-gray-50 { color: #f9fafb; }
                .text-gray-100 { color: #f3f4f6; }
                .text-gray-200 { color: #e5e7eb; }
                .text-gray-300 { color: #d1d5db; }
                .text-gray-400 { color: #9ca3af; }
                .text-gray-500 { color: #6b7280; }
                .text-gray-600 { color: #4b5563; }
                .text-gray-700 { color: #374151; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-900 { color: #111827; }
                .text-emerald-400 { color: #34d399; }
                .text-emerald-600 { color: #10b981; }
                .text-indigo-400 { color: #818cf8; }
                .text-indigo-600 { color: #4f46e5; }

                /* Font Weight */
                .font-thin { font-weight: 100; }
                .font-extralight { font-weight: 200; }
                .font-light { font-weight: 300; }
                .font-normal { font-weight: 400; }
                .font-medium { font-weight: 500; }
                .font-semibold { font-weight: 600; }
                .font-bold { font-weight: 700; }
                .font-extrabold { font-weight: 800; }
                .font-black { font-weight: 900; }

                /* Font Sizes */
                .text-xs { font-size: 0.75rem; line-height: 1rem; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .text-base { font-size: 1rem; line-height: 1.5rem; }
                .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                .text-5xl { font-size: 3rem; line-height: 1; }
                .text-6xl { font-size: 3.75rem; line-height: 1; }

                /* Spacing - Padding */
                .p-0 { padding: 0; }
                .p-1 { padding: 0.25rem; }
                .p-2 { padding: 0.5rem; }
                .p-3 { padding: 0.75rem; }
                .p-4 { padding: 1rem; }
                .p-5 { padding: 1.25rem; }
                .p-6 { padding: 1.5rem; }
                .p-7 { padding: 1.75rem; }
                .p-8 { padding: 2rem; }
                .p-10 { padding: 2.5rem; }
                .p-12 { padding: 3rem; }
                .p-16 { padding: 4rem; }
                .p-20 { padding: 5rem; }
                .p-24 { padding: 6rem; }

                .px-0 { padding-left: 0; padding-right: 0; }
                .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
                .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
                .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                .px-8 { padding-left: 2rem; padding-right: 2rem; }
                .px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
                .px-12 { padding-left: 3rem; padding-right: 3rem; }
                .px-16 { padding-left: 4rem; padding-right: 4rem; }
                .px-20 { padding-left: 5rem; padding-right: 5rem; }

                .py-0 { padding-top: 0; padding-bottom: 0; }
                .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
                .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
                .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
                .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
                .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
                .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
                .py-20 { padding-top: 5rem; padding-bottom: 5rem; }

                /* Spacing - Margin */
                .m-0 { margin: 0; }
                .m-1 { margin: 0.25rem; }
                .m-2 { margin: 0.5rem; }
                .m-3 { margin: 0.75rem; }
                .m-4 { margin: 1rem; }
                .m-5 { margin: 1.25rem; }
                .m-6 { margin: 1.5rem; }
                .m-8 { margin: 2rem; }
                .m-10 { margin: 2.5rem; }
                .m-12 { margin: 3rem; }
                .m-16 { margin: 4rem; }
                .m-20 { margin: 5rem; }
                .m-auto { margin: auto; }

                .mx-0 { margin-left: 0; margin-right: 0; }
                .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
                .mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
                .mx-3 { margin-left: 0.75rem; margin-right: 0.75rem; }
                .mx-4 { margin-left: 1rem; margin-right: 1rem; }
                .mx-5 { margin-left: 1.25rem; margin-right: 1.25rem; }
                .mx-6 { margin-left: 1.5rem; margin-right: 1.5rem; }
                .mx-8 { margin-left: 2rem; margin-right: 2rem; }
                .mx-10 { margin-left: 2.5rem; margin-right: 2.5rem; }
                .mx-12 { margin-left: 3rem; margin-right: 3rem; }
                .mx-16 { margin-left: 4rem; margin-right: 4rem; }
                .mx-20 { margin-left: 5rem; margin-right: 5rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }

                .my-0 { margin-top: 0; margin-bottom: 0; }
                .my-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
                .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
                .my-3 { margin-top: 0.75rem; margin-bottom: 0.75rem; }
                .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
                .my-5 { margin-top: 1.25rem; margin-bottom: 1.25rem; }
                .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
                .my-8 { margin-top: 2rem; margin-bottom: 2rem; }
                .my-10 { margin-top: 2.5rem; margin-bottom: 2.5rem; }
                .my-12 { margin-top: 3rem; margin-bottom: 3rem; }
                .my-16 { margin-top: 4rem; margin-bottom: 4rem; }
                .my-20 { margin-top: 5rem; margin-bottom: 5rem; }
                .my-auto { margin-top: auto; margin-bottom: auto; }

                .mt-0 { margin-top: 0; }
                .mt-1 { margin-top: 0.25rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-3 { margin-top: 0.75rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-5 { margin-top: 1.25rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mt-8 { margin-top: 2rem; }
                .mt-10 { margin-top: 2.5rem; }
                .mt-12 { margin-top: 3rem; }
                .mt-16 { margin-top: 4rem; }
                .mt-20 { margin-top: 5rem; }
                .mt-auto { margin-top: auto; }

                .mr-0 { margin-right: 0; }
                .mr-1 { margin-right: 0.25rem; }
                .mr-2 { margin-right: 0.5rem; }
                .mr-3 { margin-right: 0.75rem; }
                .mr-4 { margin-right: 1rem; }
                .mr-5 { margin-right: 1.25rem; }
                .mr-6 { margin-right: 1.5rem; }
                .mr-8 { margin-right: 2rem; }
                .mr-10 { margin-right: 2.5rem; }
                .mr-12 { margin-right: 3rem; }
                .mr-16 { margin-right: 4rem; }
                .mr-20 { margin-right: 5rem; }
                .mr-auto { margin-right: auto; }

                .mb-0 { margin-bottom: 0; }
                .mb-1 { margin-bottom: 0.25rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-5 { margin-bottom: 1.25rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-10 { margin-bottom: 2.5rem; }
                .mb-12 { margin-bottom: 3rem; }
                .mb-16 { margin-bottom: 4rem; }
                .mb-20 { margin-bottom: 5rem; }
                .mb-auto { margin-bottom: auto; }

                .ml-0 { margin-left: 0; }
                .ml-1 { margin-left: 0.25rem; }
                .ml-2 { margin-left: 0.5rem; }
                .ml-3 { margin-left: 0.75rem; }
                .ml-4 { margin-left: 1rem; }
                .ml-5 { margin-left: 1.25rem; }
                .ml-6 { margin-left: 1.5rem; }
                .ml-8 { margin-left: 2rem; }
                .ml-10 { margin-left: 2.5rem; }
                .ml-12 { margin-left: 3rem; }
                .ml-16 { margin-left: 4rem; }
                .ml-20 { margin-left: 5rem; }
                .ml-auto { margin-left: auto; }

                /* Display */
                .block { display: block; }
                .inline-block { display: inline-block; }
                .inline { display: inline; }
                .flex { display: flex; }
                .inline-flex { display: inline-flex; }
                .grid { display: grid; }
                .inline-grid { display: inline-grid; }
                .hidden { display: none; }

                /* Flexbox */
                .flex-row { flex-direction: row; }
                .flex-row-reverse { flex-direction: row-reverse; }
                .flex-col { flex-direction: column; }
                .flex-col-reverse { flex-direction: column-reverse; }
                .flex-wrap { flex-wrap: wrap; }
                .flex-wrap-reverse { flex-wrap: wrap-reverse; }
                .flex-nowrap { flex-wrap: nowrap; }

                .items-start { align-items: flex-start; }
                .items-end { align-items: flex-end; }
                .items-center { align-items: center; }
                .items-baseline { align-items: baseline; }
                .items-stretch { align-items: stretch; }

                .justify-start { justify-content: flex-start; }
                .justify-end { justify-content: flex-end; }
                .justify-center { justify-content: center; }
                .justify-between { justify-content: space-between; }
                .justify-around { justify-content: space-around; }
                .justify-evenly { justify-content: space-evenly; }

                .flex-1 { flex: 1 1 0%; }
                .flex-auto { flex: 1 1 auto; }
                .flex-initial { flex: 0 1 auto; }
                .flex-none { flex: none; }

                /* Grid */
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
                .grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
                .grid-cols-7 { grid-template-columns: repeat(7, minmax(0, 1fr)); }
                .grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)); }
                .grid-cols-9 { grid-template-columns: repeat(9, minmax(0, 1fr)); }
                .grid-cols-10 { grid-template-columns: repeat(10, minmax(0, 1fr)); }
                .grid-cols-11 { grid-template-columns: repeat(11, minmax(0, 1fr)); }
                .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
                .grid-cols-none { grid-template-columns: none; }

                /* Width */
                .w-0 { width: 0px; }
                .w-1 { width: 0.25rem; }
                .w-2 { width: 0.5rem; }
                .w-3 { width: 0.75rem; }
                .w-4 { width: 1rem; }
                .w-5 { width: 1.25rem; }
                .w-6 { width: 1.5rem; }
                .w-7 { width: 1.75rem; }
                .w-8 { width: 2rem; }
                .w-10 { width: 2.5rem; }
                .w-12 { width: 3rem; }
                .w-16 { width: 4rem; }
                .w-20 { width: 5rem; }
                .w-24 { width: 6rem; }
                .w-32 { width: 8rem; }
                .w-40 { width: 10rem; }
                .w-48 { width: 12rem; }
                .w-56 { width: 14rem; }
                .w-64 { width: 16rem; }
                .w-72 { width: 18rem; }
                .w-80 { width: 20rem; }
                .w-96 { width: 24rem; }
                .w-auto { width: auto; }
                .w-full { width: 100%; }
                .w-screen { width: 100vw; }
                .w-min { width: min-content; }
                .w-max { width: max-content; }
                .w-fit { width: fit-content; }

                /* Special Widths */
                .w-1\\/2 { width: 50%; }
                .w-1\\/3 { width: 33.333333%; }
                .w-2\\/3 { width: 66.666667%; }
                .w-1\\/4 { width: 25%; }
                .w-3\\/4 { width: 75%; }
                .w-1\\/5 { width: 20%; }
                .w-2\\/5 { width: 40%; }
                .w-3\\/5 { width: 60%; }
                .w-4\\/5 { width: 80%; }
                .w-1\\/6 { width: 16.666667%; }
                .w-5\\/6 { width: 83.333333%; }

                /* Height */
                .h-0 { height: 0px; }
                .h-1 { height: 0.25rem; }
                .h-2 { height: 0.5rem; }
                .h-3 { height: 0.75rem; }
                .h-4 { height: 1rem; }
                .h-5 { height: 1.25rem; }
                .h-6 { height: 1.5rem; }
                .h-7 { height: 1.75rem; }
                .h-8 { height: 2rem; }
                .h-10 { height: 2.5rem; }
                .h-12 { height: 3rem; }
                .h-16 { height: 4rem; }
                .h-20 { height: 5rem; }
                .h-24 { height: 6rem; }
                .h-32 { height: 8rem; }
                .h-40 { height: 10rem; }
                .h-48 { height: 12rem; }
                .h-56 { height: 14rem; }
                .h-64 { height: 16rem; }
                .h-auto { height: auto; }
                .h-full { height: 100%; }
                .h-screen { height: 100vh; }
                .h-min { height: min-content; }
                .h-max { height: max-content; }
                .h-fit { height: fit-content; }

                /* Min/Max Height */
                .min-h-0 { min-height: 0px; }
                .min-h-full { min-height: 100%; }
                .min-h-screen { min-height: 100vh; }
                .min-h-min { min-height: min-content; }
                .min-h-max { min-height: max-content; }
                .min-h-fit { min-height: fit-content; }

                /* Position */
                .static { position: static; }
                .fixed { position: fixed; }
                .absolute { position: absolute; }
                .relative { position: relative; }
                .sticky { position: sticky; }

                /* Top/Right/Bottom/Left */
                .inset-0 { top: 0px; right: 0px; bottom: 0px; left: 0px; }
                .inset-x-0 { right: 0px; left: 0px; }
                .inset-y-0 { top: 0px; bottom: 0px; }
                .top-0 { top: 0px; }
                .top-1 { top: 0.25rem; }
                .top-2 { top: 0.5rem; }
                .top-3 { top: 0.75rem; }
                .top-4 { top: 1rem; }
                .top-5 { top: 1.25rem; }
                .top-6 { top: 1.5rem; }
                .top-8 { top: 2rem; }
                .top-10 { top: 2.5rem; }
                .top-12 { top: 3rem; }
                .top-16 { top: 4rem; }
                .top-20 { top: 5rem; }
                .top-auto { top: auto; }

                .right-0 { right: 0px; }
                .right-1 { right: 0.25rem; }
                .right-2 { right: 0.5rem; }
                .right-3 { right: 0.75rem; }
                .right-4 { right: 1rem; }
                .right-5 { right: 1.25rem; }
                .right-6 { right: 1.5rem; }
                .right-8 { right: 2rem; }
                .right-10 { right: 2.5rem; }
                .right-12 { right: 3rem; }
                .right-16 { right: 4rem; }
                .right-20 { right: 5rem; }
                .right-auto { right: auto; }

                .bottom-0 { bottom: 0px; }
                .bottom-1 { bottom: 0.25rem; }
                .bottom-2 { bottom: 0.5rem; }
                .bottom-3 { bottom: 0.75rem; }
                .bottom-4 { bottom: 1rem; }
                .bottom-5 { bottom: 1.25rem; }
                .bottom-6 { bottom: 1.5rem; }
                .bottom-8 { bottom: 2rem; }
                .bottom-10 { bottom: 2.5rem; }
                .bottom-12 { bottom: 3rem; }
                .bottom-16 { bottom: 4rem; }
                .bottom-20 { bottom: 5rem; }
                .bottom-auto { bottom: auto; }

                .left-0 { left: 0px; }
                .left-1 { left: 0.25rem; }
                .left-2 { left: 0.5rem; }
                .left-3 { left: 0.75rem; }
                .left-4 { left: 1rem; }
                .left-5 { left: 1.25rem; }
                .left-6 { left: 1.5rem; }
                .left-8 { left: 2rem; }
                .left-10 { left: 2.5rem; }
                .left-12 { left: 3rem; }
                .left-16 { left: 4rem; }
                .left-20 { left: 5rem; }
                .left-auto { left: auto; }

                /* Border Radius */
                .rounded-none { border-radius: 0px; }
                .rounded-sm { border-radius: 0.125rem; }
                .rounded { border-radius: 0.25rem; }
                .rounded-md { border-radius: 0.375rem; }
                .rounded-lg { border-radius: 0.5rem; }
                .rounded-xl { border-radius: 0.75rem; }
                .rounded-2xl { border-radius: 1rem; }
                .rounded-3xl { border-radius: 1.5rem; }
                .rounded-full { border-radius: 9999px; }

                /* Border Width */
                .border-0 { border-width: 0px; }
                .border { border-width: 1px; }
                .border-2 { border-width: 2px; }
                .border-4 { border-width: 4px; }
                .border-8 { border-width: 8px; }

                /* Border Color */
                .border-transparent { border-color: transparent; }
                .border-current { border-color: currentColor; }
                .border-white { border-color: #ffffff; }
                .border-black { border-color: #000000; }
                .border-gray-50 { border-color: #f9fafb; }
                .border-gray-100 { border-color: #f3f4f6; }
                .border-gray-200 { border-color: #e5e7eb; }
                .border-gray-300 { border-color: #d1d5db; }
                .border-gray-400 { border-color: #9ca3af; }
                .border-gray-500 { border-color: #6b7280; }
                .border-gray-600 { border-color: #4b5563; }
                .border-gray-700 { border-color: #374151; }
                .border-gray-800 { border-color: #1f2937; }
                .border-gray-900 { border-color: #111827; }

                /* Text Align */
                .text-left { text-align: left; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-justify { text-align: justify; }

                /* Font Family */
                .font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
                .font-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
                .font-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; }

                /* Gap */
                .gap-0 { gap: 0px; }
                .gap-1 { gap: 0.25rem; }
                .gap-2 { gap: 0.5rem; }
                .gap-3 { gap: 0.75rem; }
                .gap-4 { gap: 1rem; }
                .gap-5 { gap: 1.25rem; }
                .gap-6 { gap: 1.5rem; }
                .gap-8 { gap: 2rem; }
                .gap-10 { gap: 2.5rem; }
                .gap-12 { gap: 3rem; }
                .gap-16 { gap: 4rem; }
                .gap-20 { gap: 5rem; }

                /* Transitions */
                .transition-none { transition-property: none; }
                .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-shadow { transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

                /* Outline */
                .outline-none { outline: 2px solid transparent; outline-offset: 2px; }

                /* Resize */
                .resize-none { resize: none; }
                .resize-y { resize: vertical; }
                .resize-x { resize: horizontal; }
                .resize { resize: both; }

                /* Hover States */
                .hover\\:bg-blue-500:hover { background-color: #3b82f6; }
                .hover\\:bg-blue-600:hover { background-color: #2563eb; }
                .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
                .hover\\:bg-gray-500:hover { background-color: #6b7280; }
                .hover\\:bg-gray-600:hover { background-color: #4b5563; }
                .hover\\:bg-gray-700:hover { background-color: #374151; }
                .hover\\:bg-red-500:hover { background-color: #ef4444; }
                .hover\\:bg-red-600:hover { background-color: #dc2626; }
                .hover\\:bg-green-500:hover { background-color: #22c55e; }
                .hover\\:bg-green-600:hover { background-color: #16a34a; }
                .hover\\:bg-yellow-500:hover { background-color: #eab308; }
                .hover\\:bg-yellow-600:hover { background-color: #ca8a04; }

                /* Focus States */
                .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
                .focus\\:ring-0:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
                .focus\\:ring-1:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
                .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
                .focus\\:ring-4:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
                .focus\\:ring-8:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(8px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
                .focus\\:ring-blue-500:focus { --tw-ring-color: #3b82f6; }
                .focus\\:ring-blue-600:focus { --tw-ring-color: #2563eb; }
                .focus\\:ring-red-500:focus { --tw-ring-color: #ef4444; }
                .focus\\:ring-red-600:focus { --tw-ring-color: #dc2626; }
                .focus\\:ring-green-500:focus { --tw-ring-color: #22c55e; }
                .focus\\:ring-green-600:focus { --tw-ring-color: #16a34a; }

                /* Disabled States */
                .disabled\\:opacity-50:disabled { opacity: 0.5; }
                .disabled\\:opacity-75:disabled { opacity: 0.75; }
                .disabled\\:cursor-not-allowed:disabled { cursor: not-allowed; }

                /* Placeholder States */
                .placeholder\\:text-gray-400::placeholder { color: #9ca3af; }
                .placeholder\\:text-gray-500::placeholder { color: #6b7280; }
                .placeholder\\:text-emerald-400::placeholder { color: #34d399; }

                /* Media Queries */
                @media (min-width: 640px) {
                    .sm\\:block { display: block; }
                    .sm\\:inline-block { display: inline-block; }
                    .sm\\:inline { display: inline; }
                    .sm\\:flex { display: flex; }
                    .sm\\:grid { display: grid; }
                    .sm\\:hidden { display: none; }
                    .sm\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                    .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .sm\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }

                @media (min-width: 768px) {
                    .md\\:block { display: block; }
                    .md\\:inline-block { display: inline-block; }
                    .md\\:inline { display: inline; }
                    .md\\:flex { display: flex; }
                    .md\\:grid { display: grid; }
                    .md\\:hidden { display: none; }
                    .md\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                    .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }

                @media (min-width: 1024px) {
                    .lg\\:block { display: block; }
                    .lg\\:inline-block { display: inline-block; }
                    .lg\\:inline { display: inline; }
                    .lg\\:flex { display: flex; }
                    .lg\\:grid { display: grid; }
                    .lg\\:hidden { display: none; }
                    .lg\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                    .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }

@media (min-width: 1280px) {
    .xl\:block { display: block; }
    .xl\:inline-block { display: inline-block; }
    .xl\:inline { display: inline; }
    .xl\:flex { display: flex; }
    .xl\:grid { display: grid; }
}

`;

        // Inline styles with the comprehensive Tailwind CSS
        const emailSafeHtml = inlineStyles(html, {
            css: tailwindCSS,
            removeStyleTags: true,
        });

        return NextResponse.json({ result: emailSafeHtml });
    } catch (error) {
        console.error('Conversion error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}