/**
 * @label Test Fixtures - Sample Videos
 * @description Mock video data for testing
 */

export const sampleVideos = {
  withCaptions: {
    id: 'dQw4w9WgXcQ',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '3:33',
    hasCaptions: true,
  },
  withoutCaptions: {
    id: 'fgp-t5SqQmM',
    url: 'https://www.youtube.com/watch?v=fgp-t5SqQmM',
    title: 'Test Video Without Captions',
    thumbnail: 'https://img.youtube.com/vi/fgp-t5SqQmM/maxresdefault.jpg',
    duration: '5:00',
    hasCaptions: false,
  },
  educational: {
    id: 'test123edu',
    url: 'https://www.youtube.com/watch?v=test123edu',
    title: 'Educational Video - React Tutorial',
    thumbnail: 'https://img.youtube.com/vi/test123edu/maxresdefault.jpg',
    duration: '15:00',
    hasCaptions: true,
  },
  shortForm: {
    id: 'short123',
    url: 'https://www.youtube.com/watch?v=short123',
    title: 'Short Video - Quick Tips',
    thumbnail: 'https://img.youtube.com/vi/short123/maxresdefault.jpg',
    duration: '0:45',
    hasCaptions: true,
  },
  longForm: {
    id: 'long123',
    url: 'https://www.youtube.com/watch?v=long123',
    title: 'Long Video - Complete Course',
    thumbnail: 'https://img.youtube.com/vi/long123/maxresdefault.jpg',
    duration: '2:30:00',
    hasCaptions: true,
  },
};

export const invalidVideos = {
  invalidUrl: {
    url: 'not-a-youtube-url',
    error: 'Invalid YouTube URL',
  },
  privateVideo: {
    id: 'private123',
    url: 'https://www.youtube.com/watch?v=private123',
    error: 'Video is private',
  },
  deletedVideo: {
    id: 'deleted123',
    url: 'https://www.youtube.com/watch?v=deleted123',
    error: 'Video not found',
  },
};
