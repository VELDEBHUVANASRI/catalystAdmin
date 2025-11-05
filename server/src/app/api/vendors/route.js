import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vendor from '@/models/Vendor';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request) => {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Connected to database, fetching all vendors...');

    // Query all vendors without status filter
    const allVendors = await Vendor.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('📊 Found total vendors:', allVendors.length);
    
    // Log status breakdown
    const statusBreakdown = allVendors.reduce((acc, vendor) => {
      const status = vendor.status || 'undefined';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    console.log('📋 Vendors by status:', statusBreakdown);
    
    if (allVendors.length > 0) {
      console.log('📝 Sample vendor data:', JSON.stringify(allVendors[0], null, 2));
    }

    const data = allVendors.map((vendor) => ({
      id: vendor._id.toString(),
      businessName: vendor.businessName || '',
      contactName: vendor.contactName || '',
      category: vendor.category || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      city: vendor.city || '',
      status: vendor.status || 'pending',
      role: vendor.role || 'vendor',
      // Keep existing keys for backward compatibility
      panCard: vendor.panCard || '',
      registrationDoc: vendor.registrationDoc || '',
      gstCertificate: vendor.gstCertificate || '',
      // Standardized keys (preferred)
      panDocument: vendor.panDocument || vendor.panCard || vendor.pan || '',
      registrationDocument: vendor.registrationDocument || vendor.registrationDoc || vendor.registration || '',
      gstDocument: vendor.gstDocument || vendor.gstCertificate || vendor.gst || '',
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total: allVendors.length,
        statusBreakdown
      }
    });
  } catch (error) {
    console.error('❌ Error in fetching all vendors:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch vendors',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
});

export const OPTIONS = withCORS(async () => {
  return NextResponse.json({}, { status: 200 });
});


