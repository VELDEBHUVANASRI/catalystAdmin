import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request, { params }) => {
  try {
    await dbConnect();
    const { id } = params;

    const service = await Service.findById(id)
      .populate('vendorId', 'businessName contactName email phone category')
      .lean();

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service not found',
        },
        { status: 404 }
      );
    }

    const data = {
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
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch service',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

export const PUT = withCORS(async (request, { params }) => {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const service = await Service.findByIdAndUpdate(
      id,
      {
        status: body.status,
        rejectionReason: body.rejectionReason || '',
      },
      { new: true, runValidators: true }
    )
      .populate('vendorId', 'businessName contactName email phone category')
      .lean();

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: service._id.toString(),
        ...service,
      },
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update service',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

