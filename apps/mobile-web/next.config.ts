/** @type {import('next').NextConfig} */
const nextConfig = {
  // monorepo에서 내부 패키지를 번들에 포함해야 하면 지정  
  async redirects() {
    return [
      {
        source: '/',          // 루트 접근 시
        destination: '/page', // 여기에 기본으로 열 페이지
        permanent: false,     // dev에서는 보통 false(307)
      },
    ];
  },
  transpilePackages: ['@kiwoom_ex/ui'], 
  images: {
    localPatterns: [
      { pathname: '/resources/images/**', search: '' },
    ],
  },
};
module.exports = nextConfig;