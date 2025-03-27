/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this being included in the bundle
      config.resolve.fallback = {
        fs: false,
        child_process: false,
        crypto: false,
        events: false,
        path: false,
        stream: false,
        util: false,
      }
    }
    return config
  },
}

module.exports = nextConfig 