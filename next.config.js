/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      // Add your Supabase domain here when you have it
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  async redirects() {
    return [
      // Hiring-manager mockup (static files in public/) — the redirect lands on
      // index.html so the mockup's relative links resolve inside its directory.
      {
        source: '/hiring-mockup-17d62407',
        destination: '/hiring-mockup-17d62407/index.html',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
