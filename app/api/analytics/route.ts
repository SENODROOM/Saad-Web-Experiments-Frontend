import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Analytics } from '@/models/Analytics';

// POST - Track an analytics event
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'anonymous';
    const { event, data } = await request.json();

    if (!event) {
      return NextResponse.json({ error: 'Missing event name' }, { status: 400 });
    }

    await connectDB();

    const analyticsEvent = await Analytics.create({
      sessionId,
      event,
      data: data || {},
    });

    return NextResponse.json({ success: true, event: analyticsEvent }, { status: 201 });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}

// GET - Fetch analytics for a session
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'anonymous';

    await connectDB();
    const events = await Analytics.find({ sessionId }).sort({ timestamp: -1 }).limit(100);

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
