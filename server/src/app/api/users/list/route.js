import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withCORS } from '@/lib/cors';

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

export const GET = withCORS(async (request) => {
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

    // Execute the query
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-password')
      .lean();

    // Format the response
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      fullName: user.name || user.fullName || '',
      email: user.email || '',
      mobile: user.mobile || user.phone || '',
      status: user.status || 'active',
      joinedDate: user.createdAt,
      lastActive: user.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch users'
      },
      { status: 500 }
    );
  }
});