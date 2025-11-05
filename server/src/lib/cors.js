import { NextResponse } from 'next/server';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// CORS handler for Next.js API routes
export function withCORS(handler) {
  return async (request, context) => {
    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // Execute the handler
      const response = await handler(request, context);
      
      // Ensure we have a NextResponse object
      const nextResponse = response instanceof NextResponse 
        ? response 
        : NextResponse.json(response);
      
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        nextResponse.headers.set(key, value);
      });

      return nextResponse;
    } catch (error) {
      // Handle errors with CORS headers
      const errorResponse = NextResponse.json(
        {
          success: false,
          message: error.message || 'Internal server error',
        },
        { status: 500 }
      );
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });

      return errorResponse;
    }
  };
}

// Export CORS headers for use in individual routes
export { corsHeaders };