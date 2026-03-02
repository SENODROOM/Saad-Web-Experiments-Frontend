import mongoose, { Schema, model, models } from 'mongoose';

export interface IBookmark {
  projectId: string;
  projectTitle: string;
  sessionId: string;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  projectId: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for unique bookmarks per session
BookmarkSchema.index({ projectId: 1, sessionId: 1 }, { unique: true });

export const Bookmark = models.Bookmark || model<IBookmark>('Bookmark', BookmarkSchema);
