/**
 * HTML/JSON Exporters
 * 
 * Functions to export email templates to email-safe HTML and JSON.
 */

import type { ComponentNode, StyleProperties, ExportOptions } from '../types';

/**
 * Convert style object to inline CSS string
 */
function stylesToInlineCSS(styles: StyleProperties): string {
  return Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${value}`;
    })
    .join('; ');
}

/**
 * Generate HTML for a single component
 */
function componentToHTML(component: ComponentNode): string {
  const inlineStyles = stylesToInlineCSS(component.styles);
  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  switch (component.type) {
    case 'text': {
      const tag = component.props.tag || 'p';
      const content = component.props.content || '';
      return `<${tag}${styleAttr}>${content}</${tag}>`;
    }

    case 'image': {
      const src = component.props.src || '';
      const alt = component.props.alt || '';
      const href = component.props.href;

      const imgTag = `<img src="${src}" alt="${alt}"${styleAttr} style="${inlineStyles}; max-width: 100%; height: auto; display: block;" />`;

      if (href) {
        return `<a href="${href}" target="_blank">${imgTag}</a>`;
      }
      return imgTag;
    }

    case 'button': {
      const text = component.props.text || 'Button';
      const href = component.props.href || '#';
      const align = component.styles.textAlign || 'center'; // Get alignment from styles

      return `
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
            <td align="${align}">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td${styleAttr}>
                    <a href="${href}" target="_blank" style="color: ${component.styles.color || '#ffffff'}; text-decoration: none; display: inline-block;">
                      ${text}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    }

    case 'spacer': {
      const height = component.props.height || '20px';
      return `<div style="height: ${height}; line-height: ${height}; font-size: 1px;">&nbsp;</div>`;
    }

    case 'divider': {
      const thickness = component.props.thickness || '1px';
      const borderStyle = component.props.style || 'solid';
      const borderColor = component.styles.borderColor || '#dddddd';
      return `<hr style="border: none; border-top: ${thickness} ${borderStyle} ${borderColor}; ${inlineStyles}" />`;
    }

    case 'section': {
      const hasColumns = component.children?.some(child => child.type === 'column');

      if (hasColumns) {
        // If section contains columns, wrap them in a single table row for horizontal layout
        const columnsHTML = component.children
          ? component.children.map(componentToHTML).join('\n')
          : '';

        return `
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"${styleAttr}>
          <tr>
            ${columnsHTML || '<td><p style="color: #999;">Empty section</p></td>'}
          </tr>
        </table>
      `;
      } else {
        // Regular section with vertically stacked content
        const childrenHTML = component.children
          ? component.children.map(componentToHTML).join('\n')
          : '';

        return `
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"${styleAttr}>
          <tr>
            <td>
              ${childrenHTML || '<p style="color: #999;">Empty section</p>'}
            </td>
          </tr>
        </table>
      `;
      }
    }

    case 'column': {
      const width = component.props.width || '50%';
      const childrenHTML = component.children
        ? component.children.map(componentToHTML).join('\n')
        : '';

      return `
        <td width="${width}"${styleAttr}>
          ${childrenHTML}
        </td>
      `;
    }

    case 'html':
      return component.props.html || '';

    case 'custom-code':
      return component.props.code || '';

    default:
      return `<!-- Unknown component type: ${component.type} -->`;
  }
}

/**
 * Export component tree to email-safe HTML
 */
export function exportToHTML(
  components: ComponentNode[],
  options: ExportOptions = {}
): string {
  const { minifyHTML = false, includeComments = true } = options;

  const bodyContent = components.map(componentToHTML).join('\n');

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Template</title>
  <style type="text/css">
    /* Email Client Reset Styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; }
    @media only screen and (max-width: 600px) {
      table[class="container"] { width: 100% !important; }
      img { height: auto !important; max-width: 100% !important; width: auto !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  ${includeComments ? '<!-- Email Template Generated by Email Builder -->' : ''}
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff;">
          <tr>
            <td>
              ${bodyContent}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  if (minifyHTML) {
    return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><');
  }

  return html;
}

/**
 * Export component tree to JSON
 */
export function exportToJSON(components: ComponentNode[]): string {
  return JSON.stringify(components, null, 2);
}

/**
 * Import component tree from JSON
 */
export function importFromJSON(json: string): ComponentNode[] {
  try {
    const components = JSON.parse(json);
    return components;
  } catch (error) {
    console.error('Failed to import JSON:', error);
    return [];
  }
}
