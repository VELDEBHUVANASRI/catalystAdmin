import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vendor from '@/models/Vendor';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async () => {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Connected to database, fetching rejected vendors...');

    const vendors = await Vendor.find({ status: 'rejected' })
      .select('-passwordHash')
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    console.log('✅ Found rejected vendors:', vendors.length);
    if (vendors.length === 0) {
      console.log('⚠️ No rejected vendors found');
    }

    const data = vendors.map((vendor) => ({
      id: vendor._id.toString(),
      businessName: vendor.businessName || '',
      contactName: vendor.contactName || '',
      category: vendor.category || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      city: vendor.city || '',
      status: vendor.status || 'rejected',
      rejectionReason: vendor.rejectionReason || '',
      role: vendor.role || 'vendor',
      // Backwards-compatible keys
      panCard: vendor.panCard || '',
      registrationDoc: vendor.registrationDoc || '',
      gstCertificate: vendor.gstCertificate || '',
      // Standardized keys
      panDocument: vendor.panDocument || vendor.panCard || vendor.pan || '',
      registrationDocument: vendor.registrationDocument || vendor.registrationDoc || vendor.registration || '',
      gstDocument: vendor.gstDocument || vendor.gstCertificate || vendor.gst || '',
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    }));

    console.log('📦 Returning', data.length, 'rejected vendors');

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error in rejected vendors route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load rejected vendors',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

export const OPTIONS = withCORS(async () => {
  return NextResponse.json({}, { status: 200 });
});
