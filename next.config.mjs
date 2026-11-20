import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const NextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  reactStrictMode: false,
  experimental: {
    cpus: 1,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/bookmarks/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/collection/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/home/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/profile/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/release/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/related/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/search",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withFlowbiteReact(NextConfig);
