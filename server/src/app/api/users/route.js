import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withCORS } from '@/lib/cors';

const parseDate = (value) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const computeStartDate = (timeframe) => {
  const now = new Date();

  if (timeframe === 'week') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  if (timeframe === 'month') {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  if (timeframe === 'year') {
    return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  return null;
};

const mapUser = (user) => ({
  id: user._id.toString(),
  fullName: user.name || user.fullName || '',
  email: user.email || '',
  // send both `mobile` and `mobileNumber` for compatibility
  mobile: user.mobile || user.phone || '',
  mobileNumber: user.mobile || user.phone || '',
  status: user.status || 'active',
  address: user.address || '',
  city: user.city || '',
  // include both createdAt/updatedAt and friendly names used by the frontend
  createdAt: user.createdAt || null,
  updatedAt: user.updatedAt || null,
  joinedDate: user.createdAt || null,
  lastActive: user.updatedAt || null,
});

export const GET = withCORS(async (request) => {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const filters = {};

    const timeframe = (searchParams.get('timeframe') || '').toLowerCase();
    const emailQuery = searchParams.get('email');
    const startDate = parseDate(searchParams.get('startDate'));
    const endDate = parseDate(searchParams.get('endDate'));
    const statusQuery = (searchParams.get('status') || '').toLowerCase();

    if (emailQuery) {
      filters.email = { $regex: emailQuery.trim(), $options: 'i' };
    }

    if (startDate || endDate) {
      filters.createdAt = {};

      if (startDate) {
        filters.createdAt.$gte = startDate;
      }

      if (endDate) {
        const inclusiveEnd = new Date(endDate);
        inclusiveEnd.setHours(23, 59, 59, 999);
        filters.createdAt.$lte = inclusiveEnd;
      }
    } else {
      const timeframeStart = computeStartDate(timeframe);

      if (timeframeStart) {
        filters.createdAt = { $gte: timeframeStart };
      }
    }

    if (statusQuery) {
      filters.status = statusQuery;
    } else {
      filters.status = { $ne: 'blocked' };
    }

    const users = await User.find(filters).sort({ createdAt: -1 }).lean();
    const data = users.map(mapUser);

    return NextResponse.json(
      {
        success: true,
        data,
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

export const POST = withCORS(async (request) => {
  try {
    await dbConnect();

    const body = await request.json();
    const { fullName, email, mobile, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (existing) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password using bcryptjs
    const bcrypt = await import('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    const user = new User({
      name: fullName || '',
      email: email.toLowerCase().trim(),
      mobile: mobile || '',
      password: hashed,
      status: 'active',
    });

    await user.save();

    return NextResponse.json({ success: true, data: mapUser(user) }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, message: 'Failed to create user', error: error.message }, { status: 500 });
  }
});
