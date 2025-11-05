import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const mappedUsers = users.map(user => ({
      id: user._id.toString(),
      fullName: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      status: user.status || 'active',
      joinedDate: user.createdAt,
      lastActive: user.updatedAt
    }));

    return NextResponse.json({ 
      success: true, 
      data: mappedUsers 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch users' 
    }, { 
      status: 500 
    });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = {};

    // Apply filters
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const dateFrom = parseDate(searchParams.get('dateFrom'));
    const dateTo = parseDate(searchParams.get('dateTo'));
    const status = searchParams.get('status');

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (name) {
      query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { fullName: { $regex: name, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = dateFrom;
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    if (status) {
      query.status = status;
    }
    
    // Handle list request
    const query = {};
    
    // Apply filters if provided
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const dateFrom = parseDate(searchParams.get('dateFrom'));
    const dateTo = parseDate(searchParams.get('dateTo'));
    const status = searchParams.get('status');

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (name) {
      query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { fullName: { $regex: name, $options: 'i' } }
      ];
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = dateFrom;
      if (dateTo) {
        const toDateEnd = new Date(dateTo);
        toDateEnd.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDateEnd;
      }
    }
    if (status) {
      query.status = status;
    }

    // Fetch users with the built query
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Map the users to the expected format
    const mappedUsers = users.map(user => ({
      id: user._id.toString(),
      fullName: user.name || user.fullName || '',
      email: user.email || '',
      mobile: user.mobile || user.phone || '',
      status: user.status || 'active',
      lastLogin: user.lastLogin || null,
      joinedDate: user.createdAt,
      lastActive: user.updatedAt,
      address: user.address || '',
      city: user.city || ''
    }));

    return NextResponse.json({
      success: true,
      data: mappedUsers
    });

    return NextResponse.json(
      {
        success: true,
        data: mappedUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to load users', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load users',
      },
      { status: 500 }
    );
  }
});
