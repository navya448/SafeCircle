import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // In a real app, you would probably want to restrict this to known URLs
  // but for the purposes of a tutorial, this is fine.
  //
  // For more information, see:
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  devIndicators: {
    allowedDevOrigins: [
      '*.cloudworkstations.dev',
      '*.firebasestudio.corp.google.com',
    ]
  },
};

export default nextConfig;
