import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { generateToken } from '@/lib/auth';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find user by email and include password field
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if password matches
    const isPasswordCorrect = await admin.matchPassword(password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Generate JWT token
    const token = generateToken(admin._id.toString(), admin.email);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          mobileNumber: admin.mobileNumber,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}