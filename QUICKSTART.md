# Quick Reference - YouTube Video Summarizer

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/AI-Empower-HQ-360/youtube-video-summar.git
cd youtube-video-summar

# Run automated setup
./setup.sh

# Add your API keys to .env.local and server/.env

# Start application
./start.sh
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Project overview and features |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete setup instructions |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Full API reference |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Deployment to various platforms |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing instructions |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Environment configuration |
| [infrastructure/gcp/README.md](infrastructure/gcp/README.md) | GCP deployment guide |

---

## 🛠️ Commands

### Development

```bash
# Frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run type-check       # Check TypeScript

# Backend
cd server
npm run dev              # Start with auto-reload
npm start                # Start production server
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up

# Build individual services
docker build -t youtube-summarizer-api ./server
docker build -t youtube-summarizer-frontend .
```

### Deployment

```bash
# GCP (Terraform)
cd infrastructure/gcp
./deploy.sh deploy production

# Vercel (Frontend)
vercel --prod

# Heroku (Backend)
git push heroku main
```

---

## 🔑 Required API Keys

1. **OpenAI API Key** (Required)
   - Get from: https://platform.openai.com/api-keys
   - Add to: `.env.local` and `server/.env`

2. **YouTube API Key** (Optional)
   - Get from: https://console.cloud.google.com/
   - Add to: `server/.env`

---

## 📂 Project Structure

```
youtube-video-summar/
├── src/                      # Frontend source
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Libraries & utilities
│   └── services/            # API services
├── server/                   # Backend API
│   └── src/
│       ├── controllers/     # Request handlers
│       ├── middleware/      # Express middleware
│       ├── routes/          # API routes
│       └── services/        # Business logic
├── infrastructure/          # Infrastructure as Code
│   └── gcp/                 # Google Cloud Platform
└── docs/                    # Documentation
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :3001
# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Key Issues
- Verify keys in `.env` files
- Remove extra spaces/quotes
- Restart servers after changes

---

## 🔗 Resources

- **Repository:** https://github.com/AI-Empower-HQ-360/youtube-video-summar
- **Issues:** https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues
- **Email:** aiempowerhq@gmail.com

---

## 📝 Labels & Tags

**Infrastructure:** gcp, terraform, docker, cloud-run, vercel, heroku

**Features:** youtube, summarization, ai, openai, video-analysis

**Development:** typescript, react, vite, node, express

**Testing:** vitest, testing-library

---

## ⚡ One-Liners

```bash
# Full setup and start
git clone https://github.com/AI-Empower-HQ-360/youtube-video-summar.git && cd youtube-video-summar && ./setup.sh && ./start.sh

# Update dependencies
npm update && cd server && npm update && cd ..

# Clean install
rm -rf node_modules server/node_modules package-lock.json server/package-lock.json && npm install && cd server && npm install && cd ..

# Deploy to GCP
cd infrastructure/gcp && ./deploy.sh deploy production

# Run tests
npm test && cd server && npm test
```

---

## 🎯 Features

- ✅ YouTube video URL processing
- ✅ Automatic transcript extraction
- ✅ AI-powered summarization
- ✅ Key points extraction
- ✅ Q&A generation
- ✅ Rate limiting
- ✅ Error handling
- ✅ Docker support
- ✅ Cloud deployment ready
- ✅ Comprehensive testing

---

## 📄 License

See [LICENSE](LICENSE) file for details.
