import React from 'react';
import Nav from '@/components/Nav';

export const metadata = {
    layout: false
};

export default function TvLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header>
                <Nav className=" border-gray-300/10 " />
            </header>
            <main className="max-w-400 mx-auto">
                {children}
            </main>
            {/* <footer className="h-10 bg-gray-600"></footer> */}
        </>
    );
}