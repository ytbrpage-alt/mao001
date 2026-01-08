/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    typescript: {
        // TODO: Remove after fixing type errors
        ignoreBuildErrors: true,
    },
    eslint: {
        // TODO: Remove after fixing lint errors
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
