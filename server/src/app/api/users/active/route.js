import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withCORS } from '@/lib/cors';

const ACTIVE_STATUSES = ['active'];

export const GET = withCORS(async () => {
  try {
    await dbConnect();

    const users = await User.find({ status: { $in: ACTIVE_STATUSES } })
      .sort({ createdAt: -1 })
      .lean();

    const data = users.map((user) => ({
      id: user._id.toString(),
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || user.phone || '',
      createdAt: user.createdAt || null,
      updatedAt: user.updatedAt || null,
      status: user.status || 'active',
    }));

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load active users',
      },
      { status: 500 }
    );
  }
});
