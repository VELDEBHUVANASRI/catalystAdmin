import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async () => {
  try {
    await dbConnect();

    const collection = mongoose.connection.collection('blocked_user');
    const docs = await collection
      .find({})
      .sort({ blockedAt: -1, updatedAt: -1, createdAt: -1 })
      .limit(200)
      .toArray();

    const data = docs.map((doc) => ({
      id: doc.userId?.toString() || doc._id?.toString() || '',
      _id: doc.userId?.toString() || doc._id?.toString() || '', // Add _id for consistency
      userId: doc.userId?.toString() || doc._id?.toString() || '', // Use _id as fallback
      name: doc.name || '',
      email: doc.email || '',
      mobile: doc.mobile || doc.phone || '',
      blockedAt: doc.blockedAt || doc.updatedAt || doc.createdAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === 26) {
      return NextResponse.json(
        {
          success: true,
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load blocked users',
      },
      { status: 500 }
    );
  }
});
