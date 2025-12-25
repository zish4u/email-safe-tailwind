/**
 * Email-Safe HTML Generator
 * Generates table-based HTML compatible with Gmail, Outlook, and other email clients
 */

import { TemplateComponent, getDefaultComponentSize, CANVAS_SIZES } from '../types';

// Default canvas width for alignment calculations
const DEFAULT_CANVAS_WIDTH = CANVAS_SIZES.desktop.width;

// Build component tree from flat array
function buildComponentTree(flat: TemplateComponent[]): TemplateComponent[] {
    const map = new Map<string, TemplateComponent>();
    flat.forEach(c => map.set(c.id, { ...c, children: [] }));
    map.forEach(node => {
        if (node.parentId && map.has(node.parentId)) {
            map.get(node.parentId)!.children!.push(node);
        }
    });
    return Array.from(map.values()).filter(n => !n.parentId || !map.has(n.parentId));
}

// CSS value helper
function css(value: unknown, fallback: string): string {
    if (typeof value === 'number') return `${value}px`;
    if (typeof value === 'string' && value.trim().length > 0) return value;
    return fallback;
}

// HTML escape helper
function esc(value: unknown): string {
    const s = String(value ?? '');
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Infer alignment from canvas X position
 * - If component is positioned on the left third of canvas -> 'left'
 * - If component is positioned in the center third -> 'center'
 * - If component is positioned on the right third -> 'right'
 */
function getAlignmentFromPosition(component: TemplateComponent): 'left' | 'center' | 'right' {
    const x = component.position?.x || 0;
    const width = component.size?.width || 100;
    const componentCenter = x + width / 2;
    const canvasWidth = DEFAULT_CANVAS_WIDTH;

    // Calculate thirds of the canvas
    const leftThreshold = canvasWidth / 3;
    const rightThreshold = (canvasWidth * 2) / 3;

    if (componentCenter < leftThreshold) {
        return 'left';
    } else if (componentCenter > rightThreshold) {
        return 'right';
    } else {
        return 'center';
    }
}

// Text alignment helper - uses style.textAlign if set, otherwise infers from position
function getComponentAlignment(component: TemplateComponent): 'left' | 'center' | 'right' {
    const style = component.style || {};
    // If textAlign is explicitly set and not default, use it
    if (style.textAlign && style.textAlign !== 'left') {
        return style.textAlign === 'center' || style.textAlign === 'right' ? style.textAlign : 'left';
    }
    // Otherwise, infer from canvas position
    return getAlignmentFromPosition(component);
}

// Simple text alignment helper for backward compatibility
function textAlign(style: { textAlign?: string } | undefined): string {
    const ta = style?.textAlign || 'left';
    return ta === 'center' || ta === 'right' || ta === 'justify' ? ta : 'left';
}

// Group components into rows based on Y position
function groupComponentsIntoRows(components: TemplateComponent[]): TemplateComponent[][] {
    if (components.length === 0) return [];

    const sorted = [...components].sort((a, b) => {
        const yDiff = (a.position?.y || 0) - (b.position?.y || 0);
        if (Math.abs(yDiff) < 30) {
            return (a.position?.x || 0) - (b.position?.x || 0);
        }
        return yDiff;
    });

    const rows: TemplateComponent[][] = [];
    let currentRow: TemplateComponent[] = [sorted[0]];
    let lastY = sorted[0].position?.y || 0;

    for (let i = 1; i < sorted.length; i++) {
        const comp = sorted[i];
        const compY = comp.position?.y || 0;

        if (Math.abs(compY - lastY) > 50) {
            rows.push(currentRow);
            currentRow = [comp];
            lastY = compY;
        } else {
            currentRow.push(comp);
        }
    }

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
}

// Get social icon URL from platform
function getSocialIconUrl(platform: string, url: string): string {
    const getFallbackDomain = (p: string): string => {
        const pLower = p.trim().toLowerCase();
        const domains: Record<string, string> = {
            x: 'x.com',
            twitter: 'x.com',
            linkedin: 'linkedin.com',
            facebook: 'facebook.com',
            instagram: 'instagram.com',
            youtube: 'youtube.com',
            github: 'github.com',
            tiktok: 'tiktok.com',
        };
        return domains[pLower] || '';
    };

    const getDomainFromUrl = (u: string): string => {
        try {
            return new URL(u).hostname;
        } catch {
            return '';
        }
    };

    const domain = getDomainFromUrl(url) || getFallbackDomain(platform);
    return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : '';
}

// Render a single component to HTML
function renderNode(component: TemplateComponent): string {
    const style = component.style || {};
    const size = component.size || getDefaultComponentSize(component.type);
    const childrenHtml = (component.children || []).map(renderNode).join('');

    switch (component.type) {
        case 'Section':
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="background-color:${style.backgroundColor || '#ffffff'};padding:${css(style.padding, '16px')};border-radius:${css(style.borderRadius, '0')};">
                            ${childrenHtml || esc(component.props.children || '')}
                        </td>
                    </tr>
                </table>
            `;

        case 'Row': {
            const cols = component.children || [];
            const gap = css(style.gap, '8px');
            const colWidth = cols.length > 0 ? `${Math.floor(100 / cols.length)}%` : '100%';
            const colsHtml = cols.map((child, idx) => {
                const rightPad = idx === cols.length - 1 ? '0' : gap;
                return `
                    <td valign="top" width="${colWidth}" style="padding-right:${rightPad};">
                        ${renderNode(child)}
                    </td>
                `;
            }).join('');
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>${colsHtml}</tr>
                </table>
            `;
        }

        case 'Column':
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td valign="top">${childrenHtml || esc(component.props.children || '')}</td>
                    </tr>
                </table>
            `;

        case 'Card': {
            const bg = style.backgroundColor || '#ffffff';
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;border-spacing:0;background-color:${bg};border:${style.border || '1px solid #e5e7eb'};border-radius:${css(style.borderRadius, '8px')};">
                    <tr>
                        <td style="padding:${css(style.padding, '16px')};text-align:${textAlign(style)};">
                            ${childrenHtml || esc(component.props.children || '')}
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'Text': {
            const align = getComponentAlignment(component);
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td align="${align}" style="padding:${css(style.padding, '0')};">
                            <div style="color:${style.textColor || '#111827'};font-size:${style.fontSize || '14px'};font-family:${style.fontFamily || 'Arial, Helvetica, sans-serif'};font-weight:${style.fontWeight || 'normal'};text-align:${align};line-height:${style.lineHeight || '1.5'};">
                                ${component.props.children || ''}
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'Button': {
            const align = getComponentAlignment(component);
            const href = String(component.props?.href || '#');
            const label = component.props?.children || 'Click Here';
            const bg = style.backgroundColor || '#3b82f6';
            const fg = style.textColor || '#ffffff';
            const pad = css(style.padding, '12px 24px');
            const radius = css(style.borderRadius, '6px');

            // Outlook-compatible button using VML
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td align="${align}" style="padding:${css(style.margin, '8px 0')};">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:40px;v-text-anchor:middle;width:150px;" arcsize="15%" stroke="f" fillcolor="${bg}">
                                <w:anchorlock/>
                                <center style="color:${fg};font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${label}</center>
                            </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <a href="${href}" target="_blank" style="display:inline-block;background-color:${bg};color:${fg};padding:${pad};text-decoration:none;font-family:${style.fontFamily || 'Arial, Helvetica, sans-serif'};font-size:${style.fontSize || '14px'};font-weight:${style.fontWeight || '600'};border-radius:${radius};mso-hide:all;">
                                ${label}
                            </a>
                            <!--<![endif]-->
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'Image': {
            const src = String(component.props?.src || '');
            const alt = esc(component.props?.alt || '');
            const maxW = size.width ? `${size.width}px` : '600px';
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:${css(style.margin, '8px 0')};">
                            <img src="${src}" alt="${alt}" width="${size.width || 'auto'}" style="display:block;width:100%;max-width:${maxW};height:auto;border:0;outline:none;text-decoration:none;border-radius:${css(style.borderRadius, '0')};" />
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'SocialLinks': {
            const links = Array.isArray(component.props?.links) ? component.props.links : [];
            const align = component.props?.align || style.textAlign || 'center';
            const tableAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
            const iconSize = component.props?.size === 'lg' ? 32 : component.props?.size === 'sm' ? 20 : 24;

            const linkHtml = links.map((link: { platform?: string; url?: string; icon?: string }, idx: number) => {
                const platform = String(link?.platform || 'Link');
                const url = String(link?.url || '#');
                const icon = link?.icon || getSocialIconUrl(platform, url);
                const pr = idx === links.length - 1 ? '0' : '8px';

                if (icon) {
                    return `
                        <td style="padding-right:${pr};">
                            <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                <img src="${icon}" alt="${platform}" width="${iconSize}" height="${iconSize}" style="display:block;border-radius:50%;border:0;outline:none;" />
                            </a>
                        </td>
                    `;
                }

                return `
                    <td style="padding-right:${pr};font-family:Arial,sans-serif;font-size:12px;">
                        <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:${style.textColor || '#2563eb'};text-decoration:none;">
                            ${platform}
                        </a>
                    </td>
                `;
            }).join('');

            return `
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${tableAlign}" style="border-collapse:collapse;">
                    <tr>${linkHtml}</tr>
                </table>
            `;
        }

        case 'Header': {
            const title = String(component.props?.title || '');
            const subtitle = String(component.props?.subtitle || '');
            const logo = String(component.props?.logo || '');
            const bg = style.backgroundColor || '#1e293b';
            const fg = style.textColor || '#ffffff';

            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:${bg};">
                    <tr>
                        <td style="padding:${css(style.padding, '24px')};text-align:${textAlign(style)};">
                            ${logo ? `<div style="margin-bottom:12px;"><img src="${logo}" alt="" style="display:inline-block;max-width:150px;height:auto;border:0;" /></div>` : ''}
                            ${title ? `<div style="font-size:24px;font-weight:700;color:${fg};font-family:${style.fontFamily || 'Arial, Helvetica, sans-serif'};margin-bottom:4px;">${esc(title)}</div>` : ''}
                            ${subtitle ? `<div style="font-size:14px;color:${fg};opacity:0.85;font-family:${style.fontFamily || 'Arial, Helvetica, sans-serif'};">${esc(subtitle)}</div>` : ''}
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'Footer': {
            const company = String(component.props?.company || '');
            const address = String(component.props?.address || '');
            const unsubscribeLink = String(component.props?.unsubscribeLink || '');
            const bg = style.backgroundColor || '#1e293b';
            const fg = style.textColor || '#94a3b8';
            const year = new Date().getFullYear();

            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:${bg};">
                    <tr>
                        <td style="padding:${css(style.padding, '24px')};text-align:${textAlign(style)};font-family:${style.fontFamily || 'Arial, Helvetica, sans-serif'};font-size:${style.fontSize || '12px'};color:${fg};">
                            ${company ? `<div style="font-weight:600;font-size:14px;margin-bottom:8px;color:${fg};">${esc(company)}</div>` : ''}
                            ${address ? `<div style="font-size:12px;opacity:0.85;margin-bottom:12px;">${esc(address)}</div>` : ''}
                            ${unsubscribeLink ? `<div style="font-size:11px;margin-bottom:8px;"><a href="${unsubscribeLink}" style="color:${fg};text-decoration:underline;">Unsubscribe</a> | <a href="${unsubscribeLink}" style="color:${fg};text-decoration:underline;">Manage Preferences</a></div>` : ''}
                            <div style="font-size:11px;opacity:0.6;padding-top:12px;border-top:1px solid ${fg}30;">&copy; ${year} ${esc(company || 'Company')}. All rights reserved.</div>
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'Divider': {
            const color = style.backgroundColor || '#e5e7eb';
            const thickness = component.props?.thickness || '1px';
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:${css(style.margin, '16px 0')};">
                            <div style="height:${thickness};background-color:${color};line-height:1px;font-size:1px;">&nbsp;</div>
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'Spacer': {
            const height = component.props?.height || component.size?.height || 20;
            return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="height:${typeof height === 'number' ? height + 'px' : height};line-height:1px;font-size:1px;">&nbsp;</td>
                    </tr>
                </table>
            `;
        }

        case 'Logo': {
            const src = String(component.props?.src || '');
            const alt = esc(component.props?.alt || 'Logo');
            const link = component.props?.link;
            const imgHtml = `<img src="${src}" alt="${alt}" style="display:block;max-width:${size.width}px;height:auto;border:0;" />`;

            return link
                ? `<a href="${link}" target="_blank" style="display:inline-block;text-decoration:none;">${imgHtml}</a>`
                : imgHtml;
        }

        default:
            return `<div style="padding:8px;border:1px dashed #ccc;">Unsupported: ${esc(component.type)}</div>`;
    }
}

// Render root-level components with side-by-side layout support
function renderRootComponents(rootComponents: TemplateComponent[]): string {
    if (rootComponents.length === 0) return '';

    const rows = groupComponentsIntoRows(rootComponents);

    return rows.map(row => {
        if (row.length === 1) {
            return renderNode(row[0]);
        }

        const colWidth = `${Math.floor(100 / row.length)}%`;
        const colsHtml = row.map((comp, idx) => {
            const rightPad = idx === row.length - 1 ? '0' : '16px';
            return `
                <td valign="top" width="${colWidth}" style="padding-right:${rightPad};">
                    ${renderNode(comp)}
                </td>
            `;
        }).join('');

        return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                <tr>${colsHtml}</tr>
            </table>
        `;
    }).join('');
}

export interface GenerateHtmlOptions {
    preheaderText?: string;
    backgroundColor?: string;
    contentWidth?: number;
}

/**
 * Generate email-safe HTML from components
 */
export function generateEmailHtml(
    components: TemplateComponent[],
    options: GenerateHtmlOptions = {}
): string {
    const {
        preheaderText = '',
        backgroundColor = '#f3f4f6',
        contentWidth = 600,
    } = options;

    const tree = buildComponentTree(components);
    const contentHtml = renderRootComponents(tree);

    // Preheader text (hidden preview text in email clients)
    const preheaderHtml = preheaderText
        ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(preheaderText)}</div>`
        : '';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>Email</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
        
        /* Responsive styles */
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
            .center-on-narrow { text-align: center !important; display: block !important; margin: 0 auto !important; float: none !important; }
            .stack-column-center { text-align: center !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:${backgroundColor};word-spacing:normal;">
    ${preheaderHtml}
    
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${backgroundColor};">
    <tr>
    <td>
    <![endif]-->
    
    <div style="background-color:${backgroundColor};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
                <td align="center" style="padding:20px 10px;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${contentWidth}">
                    <tr>
                    <td>
                    <![endif]-->
                    
                    <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" border="0" width="${contentWidth}" style="width:100%;max-width:${contentWidth}px;border-collapse:collapse;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding:0;">
                                ${contentHtml}
                            </td>
                        </tr>
                    </table>
                    
                    <!--[if mso | IE]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </table>
    </div>
    
    <!--[if mso | IE]>
    </td>
    </tr>
    </table>
    <![endif]-->
</body>
</html>`;
}

export default generateEmailHtml;
