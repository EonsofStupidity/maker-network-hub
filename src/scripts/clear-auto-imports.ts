/**
 * Browser-compatible version of clear-auto-imports
 * This will run in the browser instead of trying to use Node.js fs module
 */

// Define a console message function instead of trying to write to the filesystem
export function clearAutoImports(): void {
  console.log('Auto-imports are managed during build time.');
}

// Call the function immediately
clearAutoImports();

export default clearAutoImports;
