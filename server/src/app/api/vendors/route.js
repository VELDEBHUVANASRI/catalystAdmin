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
      panCard: vendor.panCard || '',
      registrationDoc: vendor.registrationDoc || '',
      gstCertificate: vendor.gstCertificate || '',
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

export const POST = withCORS(async (request) => {
  try {
    await dbConnect();

    const payload = await request.json();

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid request payload' }, { status: 400 });
    }

    const businessName = (payload.businessName || '').toString().trim();
    const contactName = (payload.personName || payload.contactName || '').toString().trim();
    const email = (payload.email || '').toString().trim().toLowerCase();
    const phone = (payload.phone || '').toString().trim();
    const category = (payload.category || '').toString().trim();
    const city = (payload.city || '').toString().trim();
    const password = (payload.password || '').toString();

    if (!businessName || !contactName || !email || !phone || !category || !city || !password) {
      return NextResponse.json({ success: false, message: 'Missing required vendor fields' }, { status: 400 });
    }

    // Check for existing vendor with same email
    const existing = await Vendor.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ success: false, message: 'A vendor with this email already exists' }, { status: 409 });
    }

    // Map documents (optional) - store the base64 data or names depending on payload
    const panDocument = payload.panDocument || null;
    const registrationDocument = payload.registrationDocument || null;
    const gstDocument = payload.gstDocument || null;

    const newVendor = new Vendor({
      businessName,
      contactName,
      email,
      phone,
      category,
      city,
      passwordHash: password,
      panCard: panDocument && panDocument.data ? `data:${panDocument.type};base64,${panDocument.data}` : (panDocument?.name || ''),
      registrationDoc: registrationDocument && registrationDocument.data ? `data:${registrationDocument.type};base64,${registrationDocument.data}` : (registrationDocument?.name || ''),
      gstCertificate: gstDocument && gstDocument.data ? `data:${gstDocument.type};base64,${gstDocument.data}` : (gstDocument?.name || ''),
      status: 'pending'
    });

    await newVendor.save();

    return NextResponse.json({ success: true, data: { id: newVendor._id.toString() } }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating vendor:', error);
    // Handle duplicate key errors
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, message: 'Vendor with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: 'Failed to create vendor', error: error.message }, { status: 500 });
  }
});


