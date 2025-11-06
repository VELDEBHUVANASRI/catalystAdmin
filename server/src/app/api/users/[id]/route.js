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
    mobile: readField(user, 'mobile') || nested(['phone', 'phoneNumber', 'contactNumber']),
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
    
    // Get ID from params or URL
    let id = params?.id;
    if (!id) {
      try {
        const pathname = new URL(request.url).pathname;
        const matches = pathname.match(/\/api\/users\/([^\/]+)/);
        id = matches ? decodeURIComponent(matches[1]) : null;
      } catch (e) {
        console.error('Error extracting ID from URL:', e);
      }
    }

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

    // If the caller wants to mark user as blocked, move the user to `blockeduser` collection
    if (update.status === 'blocked') {
      // fetch the full user document before removal
      const existingUser = await User.findById(id).lean();
      if (!existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: 'User not found',
          },
          { status: 404 }
        );
      }

      try {
        const blockedCollection = mongoose.connection.collection('blocked_user');
        const blockedAt = update.blockedAt || now;

        await blockedCollection.updateOne(
          { userId: existingUser._id },
          {
            $set: {
              userId: existingUser._id,
              name: existingUser.name || existingUser.fullName || '',
              email: existingUser.email || '',
              mobile: existingUser.mobile || existingUser.mobileNumber || '',
              blockedAt,
              createdAt: existingUser.createdAt || now,
              updatedAt: now,
            },
          },
          { upsert: true }
        );

        // Remove from users collection
        await User.deleteOne({ _id: existingUser._id });
      } catch (err) {
        console.error('Failed to move user to blockeduser collection', err);
        return NextResponse.json(
          { success: false, message: 'Failed to block user' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            user: formatUser(existingUser),
          },
        },
        { status: 200 }
      );
    }

    // For non-block status updates, apply the update normally
    const user = await User.findByIdAndUpdate(id, update, { new: true });

    // If the user isn't present in users collection but we're trying to set them active (unblock),
    // attempt to restore from the blocked_user snapshot.
    if (!user) {
      if (update.status && update.status !== 'blocked') {
        try {
          const blockedCollection = mongoose.connection.collection('blocked_user');

          // Try to convert the ID to ObjectId
          let objectId;
          try {
            objectId = mongoose.Types.ObjectId(id);
          } catch (e) {
            objectId = null;
          }

          // Look for the blocked user document using various ID combinations
          const blockedDoc = await blockedCollection.findOne({
            $or: [
              ...(objectId ? [{ userId: objectId }, { _id: objectId }] : []),
              { userId: id },
              { _id: id }
            ]
          });

          if (blockedDoc) {
            // Ensure we're connected to the wedding database
            if (mongoose.connection.name !== 'wedding') {
              console.warn('Connecting to wedding database...');
              await mongoose.connection.useDb('wedding');
            }

            // Recreate the user document in users collection using snapshot
            const userData = {
              name: blockedDoc.name || '',
              fullName: blockedDoc.name || '',
              email: (blockedDoc.email || '').toLowerCase(),
              mobile: blockedDoc.mobile || blockedDoc.phone || '',
              status: update.status || 'active',
              createdAt: blockedDoc.createdAt || now,
              updatedAt: now,
            };

            // Insert new user document (preserve original _id if possible)
            let restoredUser;
            
            // First try to convert userId to ObjectId if it exists
            let userIdToUse;
            if (blockedDoc.userId) {
              try {
                userIdToUse = typeof blockedDoc.userId === 'string' 
                  ? mongoose.Types.ObjectId(blockedDoc.userId)
                  : blockedDoc.userId;
              } catch (e) {
                userIdToUse = null;
              }
            }

            // If we have a valid userId, try to restore with that ID
            if (userIdToUse) {
              try {
                // First check if user already exists to avoid duplicates
                const existingUser = await User.findOne({ _id: userIdToUse });
                if (existingUser) {
                  return NextResponse.json(
                    {
                      success: false,
                      message: 'User already exists in users collection',
                    },
                    { status: 409 }
                  );
                }

                restoredUser = await User.findOneAndUpdate(
                  { _id: userIdToUse },
                  { $set: userData },
                  { upsert: true, new: true, setDefaultsOnInsert: true }
                );
              } catch (e) {
                console.error('Failed to restore user with original ID', e);
                // Will fall through to create below
              }
            }

            // If we couldn't restore with the original ID, create a new user
            if (!restoredUser) {
              try {
                restoredUser = await User.create(userData);
              } catch (e) {
                console.error('Failed to create new user during unblock', e);
                return NextResponse.json(
                  {
                    success: false,
                    message: 'Failed to create user during unblock operation',
                  },
                  { status: 500 }
                );
              }
            }

            // Remove snapshot from blocked_user collection and verify removal
            try {
              const result = await blockedCollection.deleteOne({ _id: blockedDoc._id });
              if (result.deletedCount !== 1) {
                console.warn('Blocked user document was not found during deletion');
              }
            } catch (e) {
              console.error('Failed to delete blocked_user snapshot after restore', e);
            }

            return NextResponse.json(
              {
                success: true,
                data: { user: formatUser(restoredUser.toObject ? restoredUser.toObject() : restoredUser) },
              },
              { status: 200 }
            );
          }
        } catch (e) {
          console.error('Error restoring blocked user', e);
          // fallthrough to return not found below
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // If status was changed away from blocked, ensure the blockeduser snapshot is removed
    if (update.status && update.status !== 'blocked') {
      try {
        const blockedCollection = mongoose.connection.collection('blocked_user');
        
        // Try multiple ID formats for deletion
        const objectId = (() => {
          try {
            return mongoose.Types.ObjectId(id);
          } catch (e) {
            return null;
          }
        })();

        const deleteResult = await blockedCollection.deleteOne({
          $or: [
            ...(objectId ? [{ userId: objectId }, { _id: objectId }] : []),
            { userId: id },
            { _id: id }
          ]
        });

        if (deleteResult.deletedCount === 0) {
          console.warn('No blocked user record found to remove');
        }
      } catch (error) {
        console.error('Failed to remove blockeduser record', error);
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
