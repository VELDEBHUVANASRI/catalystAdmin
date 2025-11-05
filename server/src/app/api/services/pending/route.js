import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request) => {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'pending';

    const services = await Service.find({ status })
      .populate('vendorId', 'businessName contactName email phone category')
      .sort({ createdAt: -1 })
      .lean();

    const data = services.map((service) => ({
      id: service._id.toString(),
      vendorId: service.vendorId?._id?.toString() || service.vendorId?.toString() || '',
      vendorName: service.vendorId?.businessName || '',
      type: service.type,
      subcategory: service.subcategory || '',
      name: service.name,
      description: service.description || '',
      city: service.city,
      price: service.price || 0,
      status: service.status,
      rejectionReason: service.rejectionReason || '',
      images: service.images || [],
      documents: service.documents || [],
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(`Error fetching ${status} services:`, error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch ${status} services`,
        error: error.message,
      },
      { status: 500 }
    );
  }
});

