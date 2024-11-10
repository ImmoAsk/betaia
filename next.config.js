 module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  //swcMinify: true,
  images: {
    disableStaticImages: true,
    domains: ['immoask.com','immoaskbetaapi.omnisoft.africa','omnisoft.africa','beta.immoask.com','devapi.omnisoft.africa'],
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
/* const cors = require('cors');

const allowedOrigins = ['https://beta.immoask.com', 'https://immoaskbetaapi.omnisoft.africa'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['immoask.com', 'immoaskbetaapi.omnisoft.africa', 'omnisoft.africa'],
    imageSizes: [48, 64, 88, 96, 128, 256, 384, 416],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tg',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/public/api/(.*)', // Apply these headers to all API routes
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Adjust according to your needs
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
}; */
