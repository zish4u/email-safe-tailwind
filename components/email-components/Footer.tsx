import React from 'react';
import { FooterProps } from './types';
import { SocialLinks } from './SocialLinks';

export const Footer: React.FC<FooterProps> = ({
    company,
    address,
    unsubscribeLink,
    socialLinks,
    backgroundColor = '#f8f9fa',
    textColor = '#6b7280',
    className = '',
    style = {},
    id,
}) => {
    const combinedClasses = `
    w-full
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        backgroundColor,
        color: textColor,
        ...style,
    };

    return (
        <footer
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        >
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="text-center space-y-4">
                    {company && (
                        <div className="font-semibold text-lg" style={{ color: textColor }}>
                            {company}
                        </div>
                    )}

                    {address && (
                        <div className="text-sm opacity-80" style={{ color: textColor }}>
                            {address}
                        </div>
                    )}

                    {socialLinks && socialLinks.length > 0 && (
                        <div className="flex justify-center">
                            <SocialLinks
                                links={socialLinks}
                                size="md"
                                align="center"
                            />
                        </div>
                    )}

                    {unsubscribeLink && (
                        <div className="text-xs opacity-60">
                            <a
                                href={unsubscribeLink}
                                style={{ color: textColor }}
                                className="underline hover:no-underline"
                            >
                                Unsubscribe
                            </a>
                        </div>
                    )}

                    <div className="text-xs opacity-50 pt-4 border-t border-gray-300" style={{ borderColor: textColor + '30' }}>
                        © {new Date().getFullYear()} {company || 'Company'}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};
