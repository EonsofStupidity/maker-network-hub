
// Theme Fallback Edge Function
// Provides theme data from S3 when the database is unavailable
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { S3Client, GetObjectCommand } from 'https://esm.sh/@aws-sdk/client-s3@3.433.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

// Initialize S3 Client
const s3Client = new S3Client({
  region: 'us-east-1', // Default region, override with environment variable if needed
  credentials: {
    accessKeyId: Deno.env.get('S3_CLIENT_ID') || '',
    secretAccessKey: Deno.env.get('S3_CLIENT_SECRET') || ''
  }
});

// Default theme to return if all else fails
const defaultTheme = {
  id: "fallback-theme",
  name: "Fallback Theme",
  description: "Emergency fallback theme used when theme service is unavailable",
  status: "published",
  is_default: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
  design_tokens: {
    colors: {
      background: "#080F1E",
      foreground: "#F9FAFB",
      card: "#0E172A",
      cardForeground: "#F9FAFB",
      primary: "#00F0FF",
      primaryForeground: "#F9FAFB",
      secondary: "#FF2D6E",
      secondaryForeground: "#F9FAFB",
      muted: "#131D35",
      mutedForeground: "#94A3B8",
      accent: "#131D35",
      accentForeground: "#F9FAFB",
      destructive: "#EF4444",
      destructiveForeground: "#F9FAFB",
      border: "#131D35",
      input: "#131D35",
      ring: "#1E293B",
    },
    effects: {
      primary: "#00F0FF",
      secondary: "#FF2D6E"
    }
  },
  component_tokens: [],
  composition_rules: {},
  cached_styles: {}
};

// S3 config
const S3_BUCKET = 'makers-impulse-themes';
const S3_THEME_PREFIX = 'themes/';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse URL to get theme name or ID
    const url = new URL(req.url);
    let themeName = url.searchParams.get('name') || 'Impulsivity';
    
    // If no name is provided, default to Impulsivity
    if (!themeName) {
      themeName = 'Impulsivity';
    }

    // Normalize filename for S3
    const s3ThemeKey = `${S3_THEME_PREFIX}${themeName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.json`;

    console.log(`Attempting to fetch theme from S3: ${s3ThemeKey}`);

    try {
      // Try to get theme from S3
      const getObjectParams = {
        Bucket: S3_BUCKET,
        Key: s3ThemeKey
      };

      const command = new GetObjectCommand(getObjectParams);
      const s3Response = await s3Client.send(command);

      if (s3Response.Body) {
        // Convert readable stream to text
        const reader = s3Response.Body.getReader();
        let result = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += new TextDecoder().decode(value);
        }

        // Parse the JSON
        const theme = JSON.parse(result);
        
        return new Response(
          JSON.stringify({ 
            theme, 
            source: 's3',
            success: true 
          }),
          { status: 200, headers: corsHeaders }
        );
      }
    } catch (s3Error) {
      console.error(`S3 error fetching theme: ${s3Error.message}`);
      // Continue to fallback; don't return error response yet
    }

    // If we get here, S3 fetch failed, use the default fallback theme
    console.log(`Using built-in fallback theme`);
    return new Response(
      JSON.stringify({ 
        theme: defaultTheme, 
        source: 'default-fallback',
        success: true 
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Unhandled error in theme fallback service:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to retrieve theme', 
        details: error instanceof Error ? error.message : String(error),
        theme: defaultTheme, // Always provide a fallback theme even on error
        source: 'error-fallback',
        success: false
      }),
      { status: 200, headers: corsHeaders } // Return 200 even on error with fallback data
    );
  }
});
