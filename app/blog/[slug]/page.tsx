import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getPost, postPath, postEncPath } from '../../../lib/blog';
import { BRAND, BUSINESS, SITE_URL } from '../../../lib/site';
import { breadcrumbJsonLd, pageListJsonLd, ogMeta } from '../../../lib/jsonld';
import { IconArrow, JsonLd } from '../../../components/Common';
import { CtaBox } from '../../../components/Fr';

export const dynamicParams = false;
export function generateStaticParams() {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_' }]; // 정적 export 는 빈 목록을 못 받는다 — '_' 자리는 deploy.sh 가 빌드 뒤 지운다
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return { robots: { index: false } };
  const m = ogMeta(p.title, p.description, postEncPath(p), `blog-${p.slug}`);
  return { ...m, openGraph: { ...m.openGraph, type: 'article' as const, publishedTime: p.date } };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const all = getPosts(), at = all.indexOf(p);
  const others = [...all.slice(at + 1), ...all.slice(0, at)].slice(0, 6); // 글마다 바로 다음 글들 — 모두 같은 최신 6편을 걸면 글끼리 같은 문장이 늘어난다
  const path = postEncPath(p);
  return (
    <main className="g">
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date,
          mainEntityOfPage: `${SITE_URL}${path}`, image: `${SITE_URL}/og/blog-${encodeURIComponent(p.slug)}.jpg`,
          author: { '@type': 'Organization', name: BUSINESS.name }, publisher: { '@type': 'Organization', name: BUSINESS.name } },
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '창업 가이드', path: '/blog/' }, { name: p.title, path }]),
        pageListJsonLd(`${BRAND} 창업 가이드 다른 글`, others.map((x) => ({ name: x.title, path: postEncPath(x) }))),
      ]} />
      <section className="g-hero small">
        <div className="wrap g-hero-in">
          <nav className="crumbs g-crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/blog/">창업 가이드</Link></nav>
          <p className="g-badge">{p.date.replace(/-/g, '.')}</p>
          <h1 className="g-title post">{p.title}</h1>
          <p className="g-lead">{p.description}</p>
        </div>
      </section>
      <section className="g-sec">
        <div className="wrap">
          <article className="g-article">
            {p.sections.map((x, i) => (
              <section key={x.h}>
                <h2 className="g-post-h"><span>{String(i + 1).padStart(2, '0')}</span>{x.h}</h2>
                {x.p.map((t) => <p key={t}>{t}</p>)}
                {x.list.length > 0 && <ul className="g-post-list">{x.list.map((t) => <li key={t}>{t}</li>)}</ul>}
              </section>
            ))}
          </article>
        </div>
      </section>
      {others.length > 0 && (
        <section className="g-sec soft">
          <div className="wrap">
            <div className="g-head"><h2>다른 창업 가이드</h2></div>
            <ul className="g-posts">{others.map((x) => <li key={x.slug}><Link href={postPath(x)}><small>{x.date.replace(/-/g, '.')}</small><b>{x.title}</b><span>{x.description}</span><IconArrow /></Link></li>)}</ul>
          </div>
        </section>
      )}
      <CtaBox eyebrow="본사 방문 상담 · 전화로 미팅 예약" title={<>궁금한 점은<br />본사에서 직접 확인하세요</>} sub="전화로 미팅을 잡고 부산 사상구 본사 매장을 직접 본 뒤 상담합니다." />
    </main>
  );
}
