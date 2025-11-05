import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vendor from '@/models/Vendor';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async () => {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Connected to database, fetching approved vendors...');

    const vendors = await Vendor.find({ status: 'approved' })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    console.log('✅ Found approved vendors:', vendors.length);
    if (vendors.length === 0) {
      console.log('⚠️ No approved vendors found');
    }

    const data = vendors.map((vendor) => ({
      id: vendor._id.toString(),
      businessName: vendor.businessName || '',
      contactName: vendor.contactName || '',
      category: vendor.category || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      city: vendor.city || '',
      status: vendor.status || 'approved',
      role: vendor.role || 'vendor',
      panCard: vendor.panCard || '',
      registrationDoc: vendor.registrationDoc || '',
      gstCertificate: vendor.gstCertificate || '',
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    }));

    console.log('📦 Returning', data.length, 'approved vendors');

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error in approved vendors route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load approved vendors',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

export const OPTIONS = withCORS(async () => {
  return NextResponse.json({}, { status: 200 });
});

