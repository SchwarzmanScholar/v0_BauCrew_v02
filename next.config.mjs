/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Enable TypeScript validation during builds for production readiness
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
 
}

export default nextConfig
