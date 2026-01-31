# ContentSplit

Turn one blog post into a week of social content in 30 seconds.

## Features

- **Twitter Thread**: 5-8 tweets, numbered, with hooks
- **LinkedIn Post**: Professional tone, optimized for engagement
- **Short Summary**: 2-3 sentences for newsletter intros
- **Key Takeaways**: 3-5 bullet points for quick sharing

## Setup

1. Clone this repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your-api-key-here
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

## Tech Stack

- Next.js 14
- Tailwind CSS
- Claude AI (Anthropic)
- Vercel
