/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // El sitio es estático: `next build` lo deja en out/ y GitHub Pages lo sirve.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
