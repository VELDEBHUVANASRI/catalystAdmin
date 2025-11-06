import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withCORS } from '@/lib/cors';

export const POST = withCORS(async (req) => {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Try to convert userId to ObjectId if it's a string
    let userObjectId;
    try {
      userObjectId = typeof userId === 'string' ? mongoose.Types.ObjectId(userId) : userId;
    } catch (e) {
      userObjectId = null;
    }

    // Get the blocked user collection
    const blockedCollection = mongoose.connection.collection('blocked_user');

    // Try to find the blocked user
    const blockedUser = await blockedCollection.findOne({
      $or: [
        ...(userObjectId ? [{ userId: userObjectId }, { _id: userObjectId }] : []),
        { userId: userId },
        { _id: userId }
      ]
    });

    if (!blockedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Blocked user not found',
        },
        { status: 404 }
      );
    }

    // Prepare user data for restoration
    const userData = {
      name: blockedUser.name || '',
      fullName: blockedUser.name || '',
      email: (blockedUser.email || '').toLowerCase(),
      mobile: blockedUser.mobile || blockedUser.phone || '',
      status: 'active',
      createdAt: blockedUser.createdAt || new Date(),
      updatedAt: new Date(),
    };

    // Try to restore user with original ID if possible
    let restoredUser;
    if (blockedUser.userId) {
      try {
        const originalId = typeof blockedUser.userId === 'string' 
          ? mongoose.Types.ObjectId(blockedUser.userId)
          : blockedUser.userId;

        restoredUser = await User.findOneAndUpdate(
          { _id: originalId },
          { $set: userData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (e) {
        console.error('Failed to restore with original ID:', e);
      }
    }

    // If restoration with original ID failed, create new user
    if (!restoredUser) {
      restoredUser = await User.create(userData);
    }

    // Remove from blocked collection
    await blockedCollection.deleteOne({ _id: blockedUser._id });

    return NextResponse.json(
      {
        success: true,
        message: 'User successfully unblocked',
        data: {
          user: {
            id: restoredUser._id,
            name: restoredUser.name,
            email: restoredUser.email,
            mobile: restoredUser.mobile,
            status: restoredUser.status,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unblocking user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while unblocking user',
      },
      { status: 500 }
    );
  }
});