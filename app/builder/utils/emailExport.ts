// =====================================================
// Email-Safe HTML Export with Inline CSS
// =====================================================

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
    SpacingProps,
    BorderProps,
    BoxShadowProps,
    BackgroundImageProps
} from '../advanced-types';

// ==================== CSS INLINING UTILITIES ====================

const getSpacingValue = (spacing: SpacingProps | undefined): string => {
    if (!spacing) return '';

    const { top, right, bottom, left, horizontal, vertical, all } = spacing;

    if (all !== undefined) return `${all}px`;

    const t = top ?? vertical ?? 0;
    const r = right ?? horizontal ?? 0;
    const b = bottom ?? vertical ?? 0;
    const l = left ?? horizontal ?? 0;

    return `${t}px ${r}px ${b}px ${l}px`;
};

const getBorderValue = (border: BorderProps | undefined): string => {
    if (!border) return '';

    const { width = 1, color = '#000000', style = 'solid', side = 'all' } = border;
    const borderValue = `${width}px ${style} ${color}`;

    switch (side) {
        case 'top': return `border-top: ${borderValue};`;
        case 'right': return `border-right: ${borderValue};`;
        case 'bottom': return `border-bottom: ${borderValue};`;
        case 'left': return `border-left: ${borderValue};`;
        default: return `border: ${borderValue};`;
    }
};

const getBoxShadowValue = (shadow: BoxShadowProps | undefined): string => {
    if (!shadow) return '';

    const { x = 0, y = 0, blur = 0, spread = 0, color = '#000000', inset = false } = shadow;
    const shadowValue = `${x}px ${y}px ${blur}px ${spread}px ${color}${inset ? ' inset' : ''}`;


    return.trim();
.
    
   .return `box-shadow.
    
   .
    
     .trim();

     .replace  .trim
    .trim
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
    .trim()
   
   ream();
   和BORDER
   rupa
   ­
   最快
­
­
­
­
­
­
­
­
­
,­
­
oler
­
.
­
­
.­
 .­
 .
­
 .­ .";­­­­.­­­ . .­­­­­­­H­­­       
­­­.­­­­­­­­­­­­­­­­­­­­­­­­.­­.
­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­写成
­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­­ // =====================================================
// Email-Safe HTML Export with Inline CSS
// =====================================================

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
    SpacingProps,
    BorderProps,
    BoxShadowProps,
    BackgroundImageProps
} from '../advanced-types';

// ==================== CSS INLINING UTILITIES ====================

const getSpacingValue = (spacing: SpacingProps | undefined): string => {
    if (!spacing) return '';
    
    const { top, right, bottom, left, horizontal, vertical, all } = spacing;
    
    if (all !== undefined) return `${ all } px`;
    
    const t = top ?? vertical ?? 0;
    const r = right ?? horizontal ?? 0;
    const b = bottom ?? vertical ?? 0;
    const l = left ?? horizontal ?? 0;
    
    return `${ t }px ${ r }px ${ b }px ${ l } px`;
};

const getBorderValue = (border: BorderProps | undefined): string => {
    if (!border) return '';
    
    const { width = 1, color = '#000000', style = 'solid', side = 'all' } = border;
    const borderValue = `${ width }px ${ style } ${ color } `;
    
    switch (side) {
        case 'top': return `border - top: ${ borderValue }; `;
        case 'right': return `border - right: ${ borderValue }; `;
        case 'bottom': return `border - bottom: ${ borderValue }; `;
        case 'left': return `border - left: ${ borderValue }; `;
        default: return `border: ${ borderValue }; `;
    }
};

const getBoxShadowValue = (shadow: BoxShadowProps | undefined): string => {
    if (!shadow) return '';
    
    const { x = 0, y = 0, blur = 0, spread = 0, color = '#000000', inset = false } = shadow;
    const shadowValue = `${ x }px ${ y }px ${ blur }px ${ spread }px ${ color }${ inset ? ' inset' : '' } `;
    
    return `box - shadow: ${ shadowValue }; `;
};

const getBackgroundStyle = (bg: BackgroundImageProps | undefined): string => {
    if (!bg) return '';
    
    const { url, position = 'center', repeat = 'no-repeat', size = 'cover', overlay } = bg;
    let styles = `
background - image: url(${ url });
background - position: ${ position };
background - repeat: ${ repeat };
background - size: ${ size };
`;
    
    if (overlay) {
        styles += `
background - color: ${ overlay.color };
background - blend - mode: overlay;
`;
    }
    
    return styles;
};

const getInlineStyles = (styles: string): string => {
    return styles.trim().replace(/\s+/g, ' ');
};

// ==================== EMAIL HTML GENERATORS ====================

const generateModuleHTML = (module: ModuleComponent, children: string = ''): string => {
    const { props } = module;
    
    const containerStyles = [
        props.backgroundColor && `background - color: ${ props.backgroundColor }; `,
        props.maxWidth && `max - width: ${ props.maxWidth } px; `,
        props.align && `text - align: ${ props.align }; `,
    ].filter(Boolean).join(' ');

    const cellStyles = [
        getSpacingValue({ all: 0, ...props.padding }) && `padding: ${ getSpacingValue(props.padding) }; `,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${ getSpacingValue(props.margin) }; `,
        props.borderRadius && `border - radius: ${ props.borderRadius }; `,
        getBorderValue(props.border),
        getBoxShadowValue(props.boxShadow),
        getBackgroundStyle(props.backgroundImage),
    ].filter(Boolean).join(' ');

    return `
    < !--Module: ${ module.id } -->
        <table width="${props.fullWidth ? '100%' : props.maxWidth || 600}" border = "0" cellSpacing = "0" cellPadding = "0" align = "${props.align || 'center'}" style = "${getInlineStyles(containerStyles)}" >
            <tbody>
            <tr>
            <td style="${getInlineStyles(cellStyles)}" >
                ${ children }
</td>
    </tr>
    </tbody>
    </table>
        `;
};

const generateGridHTML = (grid: GridComponent, children: string = ''): string => {
    const { props } = grid;
    const columnWidth = Math.floor(100 / props.columns);
    
    const tableStyles = [
        props.backgroundColor && `background - color: ${ props.backgroundColor }; `,
        getSpacingValue({ all: 0, ...props.padding }) && `padding: ${ getSpacingValue(props.padding) }; `,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${ getSpacingValue(props.margin) }; `,
        props.borderRadius && `border - radius: ${ props.borderRadius }; `,
        getBorderValue(props.border),
        getBoxShadowValue(props.boxShadow),
        getBackgroundStyle(props.backgroundImage),
        'width: 100%;',
    ].filter(Boolean).join(' ');

    // Generate grid items
    const gridItemsHTML = grid.children?.map((item, index) => {
        if (item.type !== 'GridItem') return '';
        return generateGridItemHTML(item as GridItemComponent, columnWidth, props.columnSpacing || 0);
    }).join('\n') || '';

    return `
    < !--Grid: ${ grid.id } -->
        <table width="100%" border = "0" cellSpacing = "${props.columnSpacing || 0}" cellPadding = "0" style = "${getInlineStyles(tableStyles)}" >
            <tbody>
            <tr>
            ${ gridItemsHTML }
</tr>
    </tbody>
    </table>
        `;
};

const generateGridItemHTML = (gridItem: GridItemComponent, columnWidth: number, columnSpacing: number): string => {
    const { props } = gridItem;
    
    const cellStyles = [
        `width: ${ columnWidth }%; `,
        `vertical - align: ${ props.verticalAlign || 'top' }; `,
        `text - align: ${ props.textAlign || 'left' }; `,
        getSpacingValue({ all: 0, ...props.padding }) && `padding: ${ getSpacingValue(props.padding) }; `,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${ getSpacingValue(props.margin) }; `,
        props.backgroundColor && `background - color: ${ props.backgroundColor }; `,
        props.borderRadius && `border - radius: ${ props.borderRadius }; `,
        getBorderValue(props.border),
        getBoxShadowValue(props.boxShadow),
        getBackgroundStyle(props.backgroundImage),
        props.width && `width: ${ typeof props.width === 'number' ? props.width + 'px' : props.width }; `,
        props.minWidth && `min - width: ${ props.minWidth } px; `,
        props.maxWidth && `max - width: ${ props.maxWidth } px; `,
    ].filter(Boolean).join(' ');

    const childrenHTML = gridItem.children?.map(child => generateComponentHTML(child)).join('\n') || '';

    return `
    < !--GridItem: ${ gridItem.id } -->
        <td width="${columnWidth}%" valign = "${props.verticalAlign || 'top'}" align = "${props.textAlign || 'left'}" style = "${getInlineStyles(cellStyles)}" cellpadding = "${columnSpacing}" >
            ${ childrenHTML }
</td>
    `;
};

const generateGroupHTML = (group: GroupComponent, children: string = ''): string => {
    const { props } = group;
    
    const containerStyles = [
        props.backgroundColor && `background - color: ${ props.backgroundColor }; `,
        getSpacingValue({ all: 0, ...props.padding }) && `padding: ${ getSpacingValue(props.padding) }; `,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${ getSpacingValue(props.margin) }; `,
        props.borderRadius && `border - radius: ${ props.borderRadius }; `,
        getBorderValue(props.border),
        getBoxShadowValue(props.boxShadow),
        getBackgroundStyle(props.backgroundImage),
    ].filter(Boolean).join(' ');

    const isHorizontal = props.direction === 'horizontal';
    const spacing = props.spacing || 10;

    // For email compatibility, we'll use tables for layout
    if (isHorizontal) {
        const itemsHTML = group.children?.map((child, index) => {
            const childHTML = generateComponentHTML(child);
            return `
    < td valign = "top" style = "padding: 0 ${index > 0 ? spacing : 0}px 0 0;" >
        ${ childHTML }
</td>
    `;
        }).join('\n') || '';

        return `
    < !--Group: ${ group.id } (Horizontal)-- >
        <table border="0" cellSpacing = "0" cellPadding = "0" style = "${getInlineStyles(containerStyles)}" >
            <tbody>
            <tr>
            ${ itemsHTML }
</tr>
    </tbody>
    </table>
        `;
    } else {
        const itemsHTML = group.children?.map((child, index) => {
            const childHTML = generateComponentHTML(child);
            return `
    < tr >
    <td style="padding: ${index > 0 ? spacing : 0}px 0 0 0;" >
        ${ childHTML }
</td>
    </tr>
        `;
        }).join('\n') || '';

        return `
    < !--Group: ${ group.id } (Vertical)-- >
        <table border="0" cellSpacing = "0" cellPadding = "0" style = "${getInlineStyles(containerStyles)}" >
            <tbody>
            ${ itemsHTML }
</tbody>
    </table>
        `;
    }
};

const generateTextHTML = (text: TextElement): string => {
    const { props } = text;
    
    const styles = [
        props.color && `color: ${ props.color }; `,
        props.fontSize && `font - size: ${ typeof props.fontSize === 'number' ? props.fontSize + 'px' : props.fontSize }; `,
        props.fontFamily && `font - family: ${ props.fontFamily }; `,
        props.fontWeight && `font - weight: ${ props.fontWeight }; `,
        props.lineHeight && `line - height: ${ typeof props.lineHeight === 'number' ? props.lineHeight : props.lineHeight }; `,
        props.letterSpacing && `letter - spacing: ${ typeof props.letterSpacing === 'number' ? props.letterSpacing + 'px' : props.letterSpacing }; `,
        props.textAlign && `text - align: ${ props.textAlign }; `,
        props.textTransform && `text - transform: ${ props.textTransform }; `,
        props.textDecoration && `text - decoration: ${ props.textDecoration }; `,
        props.fontStyle && `font - style: ${ props.fontStyle }; `,
        props.textShadow && `text - shadow: ${ props.textShadow }; `,
        getSpacingValue({ all: 0, ...props.padding }) && `padding: ${ getSpacingValue(props.padding) }; `,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${ getSpacingValue(props.margin) }; `,
        props.backgroundColor && `background - color: ${ props.backgroundColor }; `,
        props.borderRadius && `border - radius: ${ props.borderRadius }; `,
        getBorderValue(props.border),
        getBoxShadowValue(props.boxShadow),
        props.width && `width: ${ typeof props.width === 'number' ? props.width + 'px' : props.width }; `,
        props.minWidth && `min - width: ${ props.minWidth } px; `,
        props.maxWidth && `max - width: ${ props.maxWidth } px; `,
        props.height && `height: ${ typeof props.height === 'number' ? props.height + 'px' : props.height }; `,
        props.minHeight && `min - height: ${ props.minHeight } px; `,
        props.maxHeight && `max - height: ${ props.maxHeight } px; `,
        props.align && `text - align: ${ props.align }; `,
        props.verticalAlign && `vertical - align: ${ props.verticalAlign }; `,
    ].filter(Boolean).join(' ');

    const content = props.content || props.placeholder || 'Your text here';

    return `
    < !--Text: ${ text.id } -->
        <div style="${getInlineStyles(styles)}" >
            ${ content }
</div>
    `;
};

const generateImageHTML = (image: ImageElement): string => {
    const { props } = image;
    
    const containerStyles = [
        getSpacingValue({ all: 0, ...props.padding }) && `padding: ${ getSpacingValue(props.padding) }; `,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${ getSpacingValue(props.margin) }; `,
        props.backgroundColor && `background - color: ${ props.backgroundColor }; `,
        props.borderRadius && `border - radius: ${ props.borderRadius }; `,
        getBorderValue(props.border),
        getBoxShadowValue(props.boxShadow),
        props.width && `width: ${ typeof props.width === 'number' ? props.width + 'px' : props.width }; `,
        props.minWidth && `min - width: ${ props.minWidth } px; `,
        props.maxWidth && `max - width: ${ props.maxWidth } px; `,
        props.height && `height: ${ typeof props.height === 'number' ? props.height + 'px' : props.height }; `,
        props.minHeight && `min - height: ${ props.minHeight } px; `,
        props.maxHeight && `max - height: ${ props.maxHeight } px; `,
        props.align && `text - align: ${ props.align }; `,
        props.verticalAlign && `vertical - align: ${ props.verticalAlign }; `,
    ].filter(Boolean).join(' ');

    const imageStyles = [
        props.width && `width: ${ typeof props.width === 'number' ? props.width + 'px' : props.width }; `,
        props.height && `height: ${ typeof props.height === 'number' ? props.height + 'px' : props.height }; `,
        props.borderRadius && `border - radius: ${ props.borderRadius }; `,
        props.objectFit && `object - fit: ${ props.objectFit }; `,
        'max-width: 100%;',
        'height: auto;',
        'border: 0;',
    ].filter(Boolean).join(' ');

    const imageTag = `< img src = "${props.src}" alt = "${props.alt}" title = "${props.title || ''}" style = "${getInlineStyles(imageStyles)}" /> `;
    
    const finalContent = props.link ? `< a href = "${props.link}" target = "${props.linkTarget || '_blank'}" style = "text-decoration: none;" > ${ imageTag } </a>` : imageTag;

return `
        <!-- Image: ${image.id} -->
        <div style="${getInlineStyles(containerStyles)}">
            ${finalContent}
        </div>
    `;
};

const generateButtonHTML = (button: ButtonElement): string => {
    const { props } = button;

    const buttonStyles = [
        props.backgroundColor && `background-color: ${props.backgroundColor};`,
        props.textColor && `color: ${props.textColor};`,
        getSpacingValue({
            all: 0,
            top: props.paddingY,
            bottom: props.paddingY,
            left: props.paddingX,
            right: props.paddingX
        }) && `padding: ${getSpacingValue({
            all: 0,
            top: props.paddingY,
            bottom: props.paddingY,
            left: props.paddingX,
            right: props.paddingX
        })};`,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${getSpacingValue(props.margin)};`,
        props.borderRadius && `border-radius: ${props.borderRadius};`,
        props.borderColor && `border-color: ${props.borderColor};`,
        props.borderWidth && `border-width: ${props.borderWidth}px;`,
        props.borderStyle && `border-style: ${props.borderStyle};`,
        getBorderValue(props.border),
        getBoxShadowValue(props.boxShadow),
        props.fontFamily && `font-family: ${props.fontFamily};`,
        props.fontSize && `font-size: ${typeof props.fontSize === 'number' ? props.fontSize + 'px' : props.fontSize};`,
        props.fontWeight && `font-weight: ${props.fontWeight};`,
        props.textTransform && `text-transform: ${props.textTransform};`,
        props.width && props.width !== 'auto' && `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};`,
        props.height && props.height !== 'auto' && `height: ${typeof props.height === 'number' ? props.height + 'px' : props.height};`,
        props.fullWidth && `width: 100%;`,
        props.align && `text-align: ${props.align};`,
        props.verticalAlign && `vertical-align: ${props.verticalAlign};`,
        props.disabled && `opacity: 0.6; cursor: not-allowed;`,
        'display: inline-block;',
        'text-decoration: none;',
        'transition: all 0.2s ease;',
    ].filter(Boolean).join(' ');

    const buttonContent = `<span style="${getInlineStyles(buttonStyles)}">${props.text}</span>`;

    const finalContent = props.link && !props.disabled ?
        `<a href="${props.link}" target="${props.linkTarget || '_blank'}" style="text-decoration: none;">${buttonContent}</a>` :
        buttonContent;

    const containerStyles = [
        props.align && `text-align: ${props.align};`,
    ].filter(Boolean).join(' ');

    return `
        <!-- Button: ${button.id} -->
        <div style="${getInlineStyles(containerStyles)}">
            ${finalContent}
        </div>
    `;
};

const generateDividerHTML = (divider: DividerElement): string => {
    const { props } = divider;

    const containerStyles = [
        getSpacingValue({ all: 0, ...props.padding }) && `padding: ${getSpacingValue(props.padding)};`,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${getSpacingValue(props.margin)};`,
        props.align && `text-align: ${props.align};`,
        props.width && props.width !== 'auto' && `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};`,
        props.align === 'center' && !props.width && 'width: 100%;',
    ].filter(Boolean).join(' ');

    const dividerStyles = [
        props.color && `background-color: ${props.color};`,
        props.height && `height: ${props.height}px;`,
        props.style && props.style !== 'solid' && `border-bottom: ${props.height || 1}px ${props.style} ${props.color || '#e0e0e0'};`,
        props.style && props.style === 'solid' && `background-color: ${props.color || '#e0e0e0'}; height: ${props.height || 1}px;`,
    ].filter(Boolean).join(' ');

    if (props.text) {
        const labelStyles = [
            `color: ${props.textColor || '#666'};`,
            `background-color: ${props.textBackgroundColor || 'transparent'};`,
            `padding: ${props.textPadding || 0}px;`,
            'font-size: 14px;',
        ].join(' ');

        return `
            <!-- Divider: ${divider.id} -->
            <div style="${getInlineStyles(containerStyles)}">
                <table border="0" cellSpacing="0" cellPadding="0" width="100%">
                    <tbody>
                        <tr>
                            <td width="40%" style="${getInlineStyles(dividerStyles)}">&nbsp;</td>
                            <td style="${getInlineStyles(labelStyles)}" align="center">${props.text}</td>
                            <td width="40%" style="${getInlineStyles(dividerStyles)}">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else {
        return `
            <!-- Divider: ${divider.id} -->
            <div style="${getInlineStyles(containerStyles)}">
                <div style="${getInlineStyles(dividerStyles)}">&nbsp;</div>
            </div>
        `;
    }
};

const generateSpacerHTML = (spacer: SpacerElement): string => {
    const { props } = spacer;

    const styles = [
        props.width && `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};`,
        props.height && `height: ${props.height}px;`,
        getSpacingValue({ all: 0, ...props.margin }) && `margin: ${getSpacingValue(props.margin)};`,
        props.backgroundColor && `background-color: ${props.backgroundColor};`,
    ].filter(Boolean).join(' ');

    return `
        <!-- Spacer: ${spacer.id} -->
        <div style="${getInlineStyles(styles)}">
            &nbsp;
        </div>
    `;
};

// ==================== MAIN GENERATOR FUNCTION ====================

const generateComponentHTML = (component: EmailComponent): string => {
    switch (component.type) {
        case 'Module':
            const moduleChildren = component.children?.map(child => generateComponentHTML(child)).join('\n') || '';
            return generateModuleHTML(component as ModuleComponent, moduleChildren);

        case 'Grid':
            return generateGridHTML(component as GridComponent);

        case 'GridItem':
            // GridItem is handled within Grid generation
            return '';

        case 'Group':
            const groupChildren = component.children?.map(child => generateComponentHTML(child)).join('\n') || '';
            return generateGroupHTML(component as GroupComponent, groupChildren);

        case 'Text':
            return generateTextHTML(component as TextElement);

        case 'Image':
            return generateImageHTML(component as ImageElement);

        case 'Button':
            return generateButtonHTML(component as ButtonElement);

        case 'Divider':
            return generateDividerHTML(component as DividerElement);

        case 'Spacer':
            return generateSpacerHTML(component as SpacerElement);

        default:
            return `<!-- Unknown component type: ${(component as any).type} -->`;
    }
};

// ==================== EMAIL EXPORT FUNCTION ====================

export interface EmailExportOptions {
    title?: string;
    subject?: string;
    previewText?: string;
    includeComments?: boolean;
    minify?: boolean;
}

export const generateEmailHTML = (
    components: EmailComponent[],
    options: EmailExportOptions = {}
): string => {
    const {
        title = 'Email Template',
        subject = '',
        previewText = '',
        includeComments = true,
        minify = false
    } = options;

    // Generate the body content
    const bodyContent = components.map(component => generateComponentHTML(component)).join('\n');

    // Create the full HTML document
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Email Client Resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        
        /* iOS Blue Links */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        
        /* Gmail Color Fix */
        u + #body a {
            color: inherit;
            text-decoration: none;
        }
        
        /* Outlook Link Fix */
        a {
            text-decoration: none;
            color: inherit;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #f4f4f4;">
    <!-- Preview Text -->
    ${previewText ? `
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        ${previewText}
    </div>
    ` : ''}
    
    <!-- Email Body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0; padding: 0; background-color: #f4f4f4;">
        <tbody>
            <tr>
                <td align="center" style="padding: 20px 0;">
                    ${bodyContent}
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;

    // Minify if requested
    if (minify) {
        html = html
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/\n/g, '')
            .replace(/<!--.*?-->/g, includeComments ? '' : '');
    }

    return html;
};

// ==================== UTILITY FUNCTIONS ====================

export const validateEmailHTML = (html: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Basic HTML validation
    if (!html.includes('<!DOCTYPE html>')) {
        errors.push('Missing DOCTYPE declaration');
    }

    if (!html.includes('<html')) {
        errors.push('Missing HTML tag');
    }

    if (!html.includes('<head>')) {
        errors.push('Missing head section');
    }

    if (!html.includes('<body>')) {
        errors.push('Missing body section');
    }

    // Email-specific validation
    if (!html.includes('viewport')) {
        errors.push('Missing viewport meta tag (recommended for responsive design)');
    }

    if (!html.includes('x-apple-disable-message-reformatting')) {
        errors.push('Missing Apple email formatting meta tag (recommended)');
    }

    // Check for unclosed tags
    const openTags = (html.match(/<[^\/][^>]*>/g) || []).length;
    const closeTags = (html.match(/<\/[^>]*>/g) || []).length;

    if (openTags !== closeTags) {
        errors.push('Mismatched HTML tags');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const optimizeForEmailClients = (html: string): string => {
    // Add Outlook-specific fixes
    let optimized = html;

    // Add VML for background images in Outlook
    if (html.includes('background-image')) {
        optimized = optimized.replace(
            /<head>/,
            `<head><!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->`
        );
    }

    // Add mobile-specific CSS
    optimized = optimized.replace(
        '</style>',
        `
        /* Mobile Styles */
        @media only screen and (max-width: 480px) {
            table[class="responsive-table"] {
                width: 100% !important;
            }
            td[class="responsive-cell"] {
                display: block !important;
                width: 100% !important;
            }
        }
        </style>`
    );

    return optimized;
};
