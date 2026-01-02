import React from 'react';
import SearchBar from './SearchBar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, onSearchChange, onOpenSettings }) => {
  return (
    <nav className="bg-linear-to-br from-blue-500/50 to-cyan-400/50 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Left */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-4xl">🌤️</span>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                Moti.al
              </h1>
            </div>
          </div>

          {/* Search Bar - Center (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
          </div>

          {/* Actions - Right */}
          <TooltipProvider>
            <div className="flex items-center gap-3 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onOpenSettings}
                    className="p-3 cursor-pointer rounded-xl transition-all duration-300 text-white hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://github.com/yourusername/weather-albania"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl transition-all duration-300 text-white hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on GitHub</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
