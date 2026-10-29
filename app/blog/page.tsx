import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncPath } from '../../lib/blog';
import { BRAND } from '../../lib/site';
import { pageListJsonLd, ogMeta } from '../../lib/jsonld';
import { IconArrow, JsonLd } from '../../components/Common';
import { CtaBox } from '../../components/Fr';

export function generateMetadata(): Metadata {
  const m = ogMeta(`${BRAND} 창업 가이드 | 분양샵 창업 준비 글`, `${BRAND} 가맹 본사가 정리한 반려동물 분양샵 창업 준비 글. 입지, 인허가, 운영, 가맹 상담 전에 알아 둘 것.`, '/blog/', 'home');
  return getPosts().length ? m : { ...m, robots: { index: false, follow: true } }; // 공개된 글이 없으면 빈 목록을 색인하지 않는다
}

export default function Blog() {
  const posts = getPosts();
  return (
    <main className="g">
      <JsonLd data={pageListJsonLd(`${BRAND} 창업 가이드`, posts.map((p) => ({ name: p.title, path: postEncPath(p) })))} />
      <section className="g-hero small">
        <div className="wrap g-hero-in">
          <p className="g-badge">FRANCHISE GUIDE</p>
          <h1 className="g-title">창업 가이드</h1>
          <p className="g-lead">반려동물 분양샵 창업을 준비하며 자주 묻는 것들을 {BRAND} 가맹 본사가 정리했습니다.</p>
        </div>
      </section>
      <section className="g-sec">
        <div className="wrap">
          {posts.length === 0 ? <p className="g-empty">첫 글을 준비하고 있습니다.</p> : (
            <ul className="g-posts">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={postPath(p)}>
                    <small>{p.date.replace(/-/g, '.')}</small>
                    <b>{p.title}</b>
                    <span>{p.description}</span>
                    <IconArrow />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <CtaBox eyebrow="본사 방문 상담 · 전화로 미팅 예약" title={<>글로 다 담지 못한 것은<br />본사에서 직접 확인하세요</>} sub="전화로 미팅을 잡고 부산 사상구 본사 매장을 직접 본 뒤 상담합니다." />
    </main>
  );
}
