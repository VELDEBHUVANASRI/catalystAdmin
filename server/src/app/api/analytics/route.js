import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Vendor from '@/models/Vendor';
import Service from '@/models/Service';
import Event from '@/models/Event';
import Subscription from '@/models/Subscription';
import Ticket from '@/models/Ticket';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request) => {
  try {
    await dbConnect();

    // Get user stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const blockedUsers = await User.countDocuments({ status: 'blocked' });

    // Get vendor stats
    const totalVendors = await Vendor.countDocuments();
    const activeVendors = await Vendor.countDocuments({ status: 'approved' });
    const blockedVendors = await Vendor.countDocuments({ status: 'rejected' });

    // Get service stats
    const totalServices = await Service.countDocuments();
    const acceptedServices = await Service.countDocuments({ status: 'accepted' });

    // Get event stats
    const totalEvents = await Event.countDocuments();
    const eventTypeAggregation = await Event.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    const eventTypeData = eventTypeAggregation.map((item) => ({
      label: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1).toLowerCase() : 'Other',
      value: item.count,
    }));

    // Get monthly user registration data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userOverviewData = userRegistrations.map((item) => ({
      month: monthNames[item._id.month - 1],
      users: item.count,
    }));

    // Get monthly vendor registration data
    const vendorRegistrations = await Vendor.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const vendorRegistrationData = vendorRegistrations.map((item) => ({
      month: monthNames[item._id.month - 1],
      vendors: item.count,
    }));

    // Calculate average events per vendor
    const avgEventsPerVendor = totalVendors > 0 ? (totalEvents / totalVendors).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          blockedUsers,
        },
        vendorStats: {
          totalVendors,
          activeVendors,
          blockedVendors,
        },
        serviceStats: {
          totalServices,
          acceptedServices,
        },
        eventStats: {
          totalEvents,
          avgEventsPerVendor: parseFloat(avgEventsPerVendor),
          eventTypeData,
        },
        userOverviewData,
        vendorRegistrationData,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch analytics',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

