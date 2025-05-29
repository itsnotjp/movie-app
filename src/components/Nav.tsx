"use client";

import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cn from 'classnames';
import Search from './Search';

const Nav = ( { className }: { className?: string } = {}) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Movies', path: '/movies' },
        { label: 'TV Shows', path: '/tv' },
    ];

    return (
        <nav className={cn("bg-black/95 fixed w-full z-50 top-0",className)}>
            <div className={cn(
                " mx-auto px-4 sm:px-6 lg:px-8",
                'max-w-400 2xl:max-w-500',
                )}>
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="text-white text-2xl font-bold">
                            <span className='text-emerald-400'>i</span><span className='text-3xl'>W</span>atch
                        </Link>
                        <Search />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={cn(
                                        'px-3 py-2 rounded-md text-sm font-medium',
                                        pathname === item.path
                                            ? 'bg-emerald-600/60 text-white'
                                            : 'text-gray-300 hover:text-white'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    'block px-3 py-2 rounded-md text-base font-medium',
                                    pathname === item.path
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Nav;