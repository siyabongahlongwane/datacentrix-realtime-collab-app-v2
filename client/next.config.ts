/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
      NEXT_PUBLIC_SERVER_URL: 'http://45.220.164.73/api',
      NEXT_PUBLIC_SOCKET_URL: 'http://45.220.164.73'
  }
};

module.exports = nextConfig;
