module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  //swcMinify: true,
  images: {
    domains: ['immoask.com','immoaskbetaapi.omnisoft.africa','omnisoft.africa'],
    imageSizes: [48, 64, 88, 96, 128, 256, 384, 416],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tg',
        permanent: true
      },
    ];
  },
}
