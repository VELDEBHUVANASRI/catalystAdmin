import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request) => {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');
  const userId = searchParams.get('userId');

    const filters = {};
    if (status && status !== 'all') {
      filters.status = status.toLowerCase();
    }
    if (priority) {
      filters.priority = priority.toLowerCase();
    }
    if (userId) {
      // allow filtering tickets for a specific user
      filters.userId = userId;
    }
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(filters)
      .populate('vendorId', 'businessName')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const data = tickets.map((ticket) => ({
      id: ticket._id.toString(),
      ticketId: ticket.ticketId || '',
      vendorId: ticket.vendorId?._id?.toString() || ticket.vendorId?.toString() || '',
      vendor: ticket.vendorId?.businessName || '',
      userId: ticket.userId?._id?.toString() || ticket.userId?.toString() || '',
      user: ticket.userId?.name || ticket.userId?.email || '',
      title: ticket.title || '',
      description: ticket.description || '',
      priority: ticket.priority || 'low',
      status: ticket.status || 'open',
      attachment: ticket.attachment?.name || '',
      attachmentUrl: ticket.attachment?.url || '',
      attachmentData: ticket.attachment?.data || '',
      resolution: ticket.resolution || '',
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch tickets',
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

    const ticket = new Ticket({
      vendorId: body.vendorId,
      userId: body.userId,
      title: body.title,
      description: body.description,
      priority: body.priority || 'low',
      status: body.status || 'open',
      attachment: body.attachment || {},
    });

    await ticket.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: ticket._id.toString(),
          ticketId: ticket.ticketId,
          ...ticket.toObject(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create ticket',
        error: error.message,
      },
      { status: 500 }
    );
  }
});