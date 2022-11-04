/** @type {import('next').NextConfig} */
const { withPlaiceholder } = require("@plaiceholder/next");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPlaiceholder(nextConfig);
