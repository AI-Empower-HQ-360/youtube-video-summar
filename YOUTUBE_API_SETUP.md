# YouTube Data API v3 Setup Guide

## 🎯 Overview

This guide explains how to set up YouTube Data API v3 for reliable transcript access. The official API provides stable access that bypasses scraping library issues caused by YouTube's frequent API changes.

## ⚡ Quick Start (5 Minutes)

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name: `youtube-summarizer` (or any name)
4. Click "Create"

### 2. Enable YouTube Data API v3

1. In Cloud Console, navigate to **APIs & Services** → **Library**
2. Search for "YouTube Data API v3"
3. Click on it, then click **"Enable"**

### 3. Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the generated API key (looks like: `AIzaSyABC123...`)
4. *Optional but recommended:* Click "Restrict Key"
   - Application restrictions: None (or HTTP referrers for production)
   - API restrictions: Select "YouTube Data API v3"
   - Click "Save"

### 4. Configure Environment

Add to `/workspaces/youtube-video-summar/server/.env`:

```bash
YOUTUBE_API_KEY=AIzaSyABC123YourActualKeyHere
```

### 5. Restart Server

```bash
cd /workspaces/youtube-video-summar/server
npm run dev
```

## 📊 API Quota & Limits

### Free Tier (Default)
- **Daily Quota:** 10,000 units
- **Cost per Request:**
  - Caption list: 50 units
  - Caption download: 200 units
  - **Total per video:** ~250 units
- **Videos per Day:** ~40 videos (250 units each)

### Cost Optimization
The implementation tries **TimedText API first** (no quota usage) and falls back to Data API v3 only when needed, maximizing your free quota.

### Upgrading Quota
If you need more than 40 videos/day:
1. Go to [Google Cloud Console Quotas](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)
2. Request quota increase (requires billing account)
3. Paid quota: $0.001 per 100 units (~$2.50 per 1000 videos)

## 🔄 Fallback Chain

The system tries methods in this order:

```
1. YouTube TimedText API (Public, Free, No Key)
   ↓ (if fails)
2. YouTube Data API v3 (Official, Requires Key)
   ↓ (if fails)  
3. Innertube/youtubei.js (Scraping, May Break)
   ↓ (if fails)
4. Local Whisper AI (Audio Transcription, Slow)
```

## ✅ Verification

Test your setup:

```bash
# Should return transcript if captions available
curl "http://localhost:3001/api/youtube/transcript/dQw4w9WgXcQ"
```

Check logs for:
```
✅ TimedText API success: 5234 characters
```
or
```
✅ YouTube API v3 success: 5234 characters
```

## 🚨 Common Issues

### Issue: "YouTube API key not configured"
**Solution:** Add `YOUTUBE_API_KEY` to `server/.env` and restart server

### Issue: "YouTube API quota exceeded"
**Solution:** 
- Wait until midnight Pacific Time (quota resets daily)
- Or upgrade quota in Google Cloud Console

### Issue: "403 Forbidden"
**Solution:**
- Check API key is correct
- Verify YouTube Data API v3 is enabled in Cloud Console
- Check API key restrictions aren't blocking requests

### Issue: "No captions available"
**Solution:** 
- Video doesn't have captions (check manually on YouTube)
- System will automatically fall back to Whisper transcription

## 🎓 How It Works

### TimedText API (Tried First)
```javascript
https://www.youtube.com/api/timedtext?v=VIDEO_ID&lang=en&fmt=srv3
```
- **Pros:** Free, no quota, fast
- **Cons:** Unofficial, may break, limited languages

### YouTube Data API v3 (Official Fallback)
```javascript
1. GET https://www.googleapis.com/youtube/v3/captions?videoId=...
2. GET https://www.googleapis.com/youtube/v3/captions/{captionId}
```
- **Pros:** Official, stable, supports all languages
- **Cons:** Requires API key, has quota limits

## 📝 Best Practices

### Development
- Use TimedText API when possible (free tier lasts longer)
- Configure API key only if you need:
  - Non-English captions
  - High volume (>40 videos/day)
  - Production stability

### Production
- **Always configure API key** for reliability
- Set up monitoring for quota usage
- Consider quota upgrade if expecting >1000 videos/day
- Use caching to avoid redundant API calls

## 🔗 Useful Links

- [YouTube Data API v3 Docs](https://developers.google.com/youtube/v3/docs)
- [Captions Resource](https://developers.google.com/youtube/v3/docs/captions)
- [Quota Management](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

## 💡 Pro Tips

1. **Cache transcripts** - Store fetched transcripts in database to avoid re-fetching
2. **Batch requests** - If processing multiple videos, spread requests over time
3. **Monitor quota** - Set up alerts in Google Cloud Console
4. **Use service account** (advanced) - For server-to-server authentication in production

## 🆘 Support

If you encounter issues:
1. Check server logs: `cd server && npm run dev`
2. Verify API key: `echo $YOUTUBE_API_KEY` in server directory
3. Test manually: Use curl command from Verification section
4. Check quota: Visit Google Cloud Console → APIs → Quotas

---

**Note:** YouTube's free tier (10,000 units/day) is sufficient for personal use and small-scale applications. Most users won't need to upgrade.
