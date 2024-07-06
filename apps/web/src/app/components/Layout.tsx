import { ThemeProvider } from 'next-themes';
import type React from 'react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <nav className="bg-gray-100 dark:bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Workout Tracker
            </h1>
            <ThemeToggle />
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </div>
    </ThemeProvider>
  );
}
