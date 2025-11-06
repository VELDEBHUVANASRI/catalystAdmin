import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserTicket from '@/models/UserTicket';
import { withCORS } from '@/lib/cors';

export const GET = withCORS(async (request) => {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const filters = {};
    if (userId) filters.userId = userId;
    if (status && status !== 'all') filters.status = status.toLowerCase();

    const tickets = await UserTicket.find(filters)
      .populate('userId', 'name email')
      .populate('vendorId', 'businessName')
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
    console.error('Error fetching user tickets:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user tickets',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

export const OPTIONS = withCORS(async () => {
  return NextResponse.json({ success: true }, { status: 200 });
});
