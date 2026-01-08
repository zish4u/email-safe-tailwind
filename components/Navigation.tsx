"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation: React.FC = () => {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="bg-background border-b border-border" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-emerald-500 transition-all duration-200"
                            aria-label="Email Safe Tailwind Home"
                        >
                            Email Safe Tailwind
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/')
                                ? 'bg-accent text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            aria-current={isActive('/') ? 'page' : undefined}
                        >
                            Converter
                        </Link>
                        <Link
                            href="/template-builder"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/builder')
                                ? 'bg-accent text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            aria-current={isActive('/builder') ? 'page' : undefined}
                        >
                            Template Builder
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
