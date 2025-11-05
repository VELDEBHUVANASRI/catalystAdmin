import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { withCORS } from '@/lib/cors';

const normalizeString = (value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
};

const readField = (entity, key) => {
  if (!entity) {
    return '';
  }
  const value = entity[key];
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return String(value).trim();
};

const formatUser = (user) => {
  const nested = (keys) => {
    for (const key of keys) {
      const candidate = readField(user, key);
      if (candidate) {
        return candidate;
      }
    }
    return '';
  };

  const statusRaw = readField(user, 'status');
  const status = statusRaw ? statusRaw.toLowerCase() : 'active';

  return {
    id: user._id.toString(),
    fullName: readField(user, 'name') || nested(['fullName', 'firstName', 'displayName']),
    email: readField(user, 'email'),
    mobileNumber: readField(user, 'mobile') || nested(['phone', 'phoneNumber', 'contactNumber']),
    address: nested(['address', 'streetAddress', 'addressLine', 'location']),
    city: readField(user, 'city') || nested(['town', 'locality']),
    state: readField(user, 'state') || nested(['province', 'region']),
    postalCode: readField(user, 'postalCode') || nested(['zip', 'zipCode', 'pincode']),
    country: readField(user, 'country'),
    profileImage: readField(user, 'profileImage') || nested(['avatar', 'photoUrl', 'picture']),
    createdAt: user.createdAt || null,
    blockedAt: user.blockedAt || null,
    status,
  };
};

const formatOrder = (order) => {
  const amountCandidate = order?.amountPaid ?? order?.totalAmount ?? order?.amount ?? null;
  const numericAmount = typeof amountCandidate === 'number' ? amountCandidate : Number(amountCandidate);
  const amountPaid = Number.isNaN(numericAmount) ? null : numericAmount;
  const vendorName = order?.vendorName || order?.vendor?.name || order?.vendor?.businessName || '';
  const serviceType = order?.serviceType || order?.service || order?.category || '';
  const orderId = order?.orderId || order?.referenceId || (order?._id ? String(order._id) : '');
  const rawDate = order?.dateOfService || order?.serviceDate || order?.eventDate || order?.createdAt || null;
  let dateOfService = null;

  if (rawDate) {
    const parsed = new Date(rawDate);
    dateOfService = Number.isNaN(parsed.getTime()) ? rawDate : parsed.toISOString();
  }

  return {
    id: order?._id?.toString() || orderId,
    orderId: normalizeString(orderId),
    serviceType: normalizeString(serviceType),
    vendorName: normalizeString(vendorName),
    amountPaid,
    currency: normalizeString(order?.currency) || 'INR',
    dateOfService,
  };
};

const fetchOrdersForUser = async (userId) => {
  try {
    const collection = mongoose.connection.collection('orders');
    const userIdString = userId.toString();
    const orderDocs = await collection
      .find({
        $or: [
          { userId },
          { user: userId },
          { userId: userIdString },
          { user: userIdString },
        ],
      })
      .sort({ dateOfService: -1, serviceDate: -1, createdAt: -1 })
      .limit(50)
      .toArray();

    return orderDocs.map(formatOrder);
  } catch (error) {
    if (error.code === 26) {
      return [];
    }
    console.error('Failed to load orders for user', error);
    return [];
  }
};

export const GET = withCORS(async (_request, { params }) => {
  try {
    await dbConnect();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'User id is required',
        },
        { status: 400 }
      );
    }

    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const orders = await fetchOrdersForUser(user._id);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: formatUser(user),
          orders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load user',
      },
      { status: 500 }
    );
  }
});

export const PUT = withCORS(async (request, { params }) => {
  try {
    await dbConnect();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'User id is required',
        },
        { status: 400 }
      );
    }

    const payload = await request.json();
    const update = {};
    const now = new Date();

    if (payload.status !== undefined) {
      const statusValue = normalizeString(payload.status).toLowerCase();

      if (!statusValue) {
        return NextResponse.json(
          {
            success: false,
            message: 'Status value is invalid',
          },
          { status: 400 }
        );
      }

      update.status = statusValue;

      if (statusValue === 'blocked') {
        update.blockedAt = now;
      } else {
        update.blockedAt = null;
      }
    }

    if (payload.address !== undefined) {
      update.address = normalizeString(payload.address);
    }

    if (payload.mobileNumber !== undefined) {
      update.mobile = normalizeString(payload.mobileNumber);
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    if (update.status) {
      try {
        const blockedCollection = mongoose.connection.collection('blocked_users');

        if (update.status === 'blocked') {
          await blockedCollection.updateOne(
            { userId: user._id },
            {
              $set: {
                userId: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                blockedAt: update.blockedAt || now,
                updatedAt: now,
              },
            },
            { upsert: true }
          );
        } else {
          await blockedCollection.deleteOne({ userId: user._id });
        }
      } catch (error) {
        console.error('Failed to sync blocked user record', error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: formatUser(user.toObject()),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update user',
      },
      { status: 500 }
    );
  }
});
