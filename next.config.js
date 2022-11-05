/** @type {import('next').NextConfig} */

const nextConfig = {
  i18n: {
    locales: ["en-US", "tr-TR"],
    defaultLocale: "en-US",
  },
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
};

module.exports = nextConfig;
