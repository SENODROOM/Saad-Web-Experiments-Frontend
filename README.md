# Frontend - Saad Web Experiments

Next.js 16 frontend for the portfolio website.

## Features

- Next.js 16 with App Router
- TypeScript support
- Server and Client Components
- Responsive design
- Dark mode
- 150+ project showcases

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (proxy to backend)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   └── lib/              # Utility libraries
├── public/               # Static assets
│   ├── HTML/            # HTML projects
│   ├── CSS/             # CSS projects
│   ├── Javascript/      # JavaScript projects
│   ├── React/           # React projects
│   ├── Python/          # Python projects
│   └── Images/          # Images
└── package.json
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

See root `DEPLOYMENT_GUIDE.md` for details.
