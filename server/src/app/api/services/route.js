import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request) => {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const status = searchParams.get('status'); // pending, accepted, rejected
    const type = searchParams.get('type');
    const city = searchParams.get('city');

    const filters = {};
    if (status) {
      filters.status = status.toLowerCase();
    }
    if (type) {
      filters.type = { $regex: type, $options: 'i' };
    }
    if (city) {
      filters.city = { $regex: city, $options: 'i' };
    }

    const services = await Service.find(filters)
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
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch services',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

export const POST = withCORS(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();

    const service = new Service({
      vendorId: body.vendorId,
      type: body.type,
      subcategory: body.subcategory || '',
      name: body.name,
      description: body.description || '',
      city: body.city,
      price: body.price || 0,
      status: 'pending',
      images: body.images || [],
      documents: body.documents || [],
    });

    await service.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: service._id.toString(),
          ...service.toObject(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create service',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

