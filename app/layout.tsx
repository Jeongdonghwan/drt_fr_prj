import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, Footer, StickyBar, JsonLd } from '../components/Common';
import Motion from '../components/Motion';
import { businessJsonLd } from '../lib/jsonld';
import { SITE_URL, BRAND } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND} 가맹 창업 | 강아지·고양이 분양샵 창업 상담`, template: '%s' },
  description: '도로시펫 가맹 창업 안내. 본사 공급망·교육·마케팅 지원, 동일 상권 중복 가맹 제한, 상담부터 오픈까지 11단계. 본사 방문 상담 010-2236-8276.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/', types: { 'application/rss+xml': [{ url: '/rss.xml', title: `${BRAND} 지역별 창업 안내` }] } },
  // TODO: 서치어드바이저·서치콘솔 소유확인 코드
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body>
        <JsonLd data={businessJsonLd()} />
        <Header />
        {children}
        <Footer />
        <StickyBar />
        <Motion />
      </body>
    </html>
  );
}
