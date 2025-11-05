import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vendor from '@/models/Vendor';
import { withCORS } from '@/lib/cors';

const allowedStatuses = ['pending', 'approved', 'rejected'];
const statusAliases = {
  accepted: 'approved', // Backward compatibility
};

const normalize = (value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
};

export const GET = withCORS(async (_request, context) => {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vendor id is required',
        },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findById(id)
      .select('-passwordHash')
      .lean();

    if (!vendor) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vendor not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: vendor._id.toString(),
          businessName: vendor.businessName,
          contactName: vendor.contactName || '',
          category: vendor.category,
          email: vendor.email,
          phone: vendor.phone,
          city: vendor.city,
          status: vendor.status,
          role: vendor.role || 'vendor',
          panCard: vendor.panCard || '',
          registrationDoc: vendor.registrationDoc || '',
          gstCertificate: vendor.gstCertificate || '',
          rejectionReason: vendor.rejectionReason || '',
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load vendor',
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
          message: 'Vendor id is required',
        },
        { status: 400 }
      );
    }

    const payload = await request.json();
    const update = {};
    const hasRejectionReason = Object.prototype.hasOwnProperty.call(payload, 'rejectionReason');
    const normalizedRejectionReason = hasRejectionReason ? normalize(payload.rejectionReason) : '';

    if (payload.status !== undefined) {
      let normalizedStatus = normalize(payload.status).toLowerCase();

      if (statusAliases[normalizedStatus]) {
        normalizedStatus = statusAliases[normalizedStatus];
      }

      if (!allowedStatuses.includes(normalizedStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid status value',
          },
          { status: 400 }
        );
      }

      if (normalizedStatus === 'rejected' && !normalizedRejectionReason) {
        return NextResponse.json(
          {
            success: false,
            message: 'Rejection reason is required',
          },
          { status: 400 }
        );
      }

      update.status = normalizedStatus;

      if (normalizedStatus !== 'rejected' && !hasRejectionReason) {
        update.rejectionReason = '';
      }
    }

    if (hasRejectionReason) {
      update.rejectionReason = normalizedRejectionReason;
    }

    const vendor = await Vendor.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!vendor) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vendor not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: vendor._id.toString(),
          status: vendor.status,
          rejectionReason: vendor.rejectionReason,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update vendor',
      },
      { status: 500 }
    );
  }
});

// Ensure preflight OPTIONS requests receive CORS headers
export const OPTIONS = withCORS(async () => {
  return NextResponse.json({}, { status: 200 });
});
