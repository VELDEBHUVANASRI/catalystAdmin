import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request) => {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const status = searchParams.get('status');
    const planType = searchParams.get('planType');

    const filters = {};
    if (status) {
      filters.status = status.toLowerCase();
    }
    if (planType) {
      filters.planType = planType.toLowerCase();
    }

    const subscriptions = await Subscription.find(filters)
      .populate('vendorId', 'businessName contactName email phone')
      .sort({ createdAt: -1 })
      .lean();

    const data = subscriptions.map((sub) => ({
      id: sub._id.toString(),
      vendorId: sub.vendorId?._id?.toString() || sub.vendorId?.toString() || '',
      clientName: sub.vendorId?.businessName || '',
      planType: sub.planType,
      subscriptionDate: sub.subscriptionDate,
      expiryDate: sub.expiryDate,
      amount: sub.amount || 0,
      status: sub.status,
      paymentStatus: sub.paymentStatus,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    }));

    // Calculate summary stats
    const totalSubscribers = await Subscription.countDocuments({ status: 'active' });
    const activePlans = await Subscription.countDocuments({ status: 'active', paymentStatus: 'paid' });
    const pendingPayments = await Subscription.countDocuments({ paymentStatus: 'pending' });

    return NextResponse.json({
      success: true,
      data,
      stats: {
        totalSubscribers,
        activePlans,
        pendingPayments,
      },
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch subscriptions',
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

    const subscription = new Subscription({
      vendorId: body.vendorId,
      planType: body.planType || 'standard',
      subscriptionDate: body.subscriptionDate || new Date(),
      expiryDate: body.expiryDate,
      amount: body.amount || 0,
      status: 'active',
      paymentStatus: body.paymentStatus || 'pending',
    });

    await subscription.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: subscription._id.toString(),
          ...subscription.toObject(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create subscription',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

