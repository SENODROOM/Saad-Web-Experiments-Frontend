import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Bookmark } from '@/models/Bookmark';

// GET - Fetch bookmarks for a session
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'anonymous';

    await connectDB();
    const bookmarks = await Bookmark.find({ sessionId }).sort({ createdAt: -1 });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

// POST - Create a bookmark
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'anonymous';
    const { projectId, projectTitle } = await request.json();

    if (!projectId || !projectTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if bookmark already exists
    const existing = await Bookmark.findOne({ projectId, sessionId });
    if (existing) {
      return NextResponse.json({ message: 'Bookmark already exists', bookmark: existing });
    }

    const bookmark = await Bookmark.create({
      projectId,
      projectTitle,
      sessionId,
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}

// DELETE - Remove a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'anonymous';
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    await connectDB();
    await Bookmark.deleteOne({ projectId, sessionId });

    return NextResponse.json({ message: 'Bookmark deleted' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}
