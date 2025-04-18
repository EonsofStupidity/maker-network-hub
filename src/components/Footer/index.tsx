
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">MakersIMPULSE</h3>
            <p className="text-sm text-muted-foreground">Build, Share, Innovate</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-sm">
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MakersIMPULSE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
