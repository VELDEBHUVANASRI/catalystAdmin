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

    const { name, email, mobileNumber, password, confirmPassword } = await request.json();

    // Validation
    if (!name || !email || !mobileNumber || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid 10-digit mobile number' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists
    const existingUser = await Admin.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409, headers: corsHeaders }
      );
    }

    // Create new user
    const admin = new Admin({
      name,
      email: email.toLowerCase(),
      mobileNumber,
      password,
    });

    await admin.save();

    // Generate JWT token
    const token = generateToken(admin._id.toString(), admin.email);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          mobileNumber: admin.mobileNumber,
        },
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Signup error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages[0] },
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}