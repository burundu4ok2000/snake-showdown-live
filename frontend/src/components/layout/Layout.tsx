import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>Snake Arena © {new Date().getFullYear()} - Compete with players worldwide!</p>
      </footer>
    </div>
  );
}
