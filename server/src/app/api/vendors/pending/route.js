import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vendor from '@/models/Vendor';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async () => {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Connected to database, searching for pending vendors...');

    // First, let's check total vendors
    const totalVendors = await Vendor.countDocuments({});
    console.log('📊 Total vendors in database:', totalVendors);
    
    // Check vendors by status
    const statusCounts = await Vendor.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('📋 Vendors by status:', statusCounts);

    // Query pending vendors
    const pendingVendors = await Vendor.find({ status: 'pending' })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('✅ Found pending vendors:', pendingVendors.length);
    if (pendingVendors.length > 0) {
      console.log('📝 Sample vendor data:', JSON.stringify(pendingVendors[0], null, 2));
    } else {
      console.log('⚠️ No pending vendors found. Checking all vendors...');
      const allVendors = await Vendor.find({})
        .select('status businessName email')
        .limit(5)
        .lean();
      console.log('📋 Sample of all vendors:', allVendors);
    }

    const data = pendingVendors.map((vendor) => ({
      id: vendor._id.toString(),
      businessName: vendor.businessName || '',
      contactName: vendor.contactName || '',
      category: vendor.category || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      city: vendor.city || '',
      status: vendor.status || 'pending',
      role: vendor.role || 'vendor',
      panCard: vendor.panCard || '',
      registrationDoc: vendor.registrationDoc || '',
      gstCertificate: vendor.gstCertificate || '',
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt
    }));

    console.log('📦 Returning data array with', data.length, 'vendors');

    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          total: totalVendors,
          statusCounts: statusCounts.reduce((acc, item) => {
            acc[item._id || 'undefined'] = item.count;
            return acc;
          }, {})
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error in pending vendors route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load pending vendors',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
});

export const OPTIONS = withCORS(async () => {
  return NextResponse.json({}, { status: 200 });
});
