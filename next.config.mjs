/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true, // optional, remove if you don’t use styled-components
  },
};

export default nextConfig;
