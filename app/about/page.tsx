// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, BRANCHES, BUSINESS, CONTACT, LINKS, UPDATED, tel } from '../../lib/site';
import { breadcrumbJsonLd, businessJsonLd, ogMeta } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

export const metadata: Metadata = ogMeta(`소개 | ${BRAND} 가맹 창업`, `${BRAND}은 강아지·고양이 분양샵 가맹 본사입니다. 하는 일, 매장 위치, 가맹 상담 연락 방법을 사실대로 정리했습니다.`, '/about/', 'home');

export default function About() {
  return (
    <main className="g">
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <section className="g-hero small">
        <div className="wrap g-hero-in">
          <h1 className="g-title">{BRAND} 소개</h1>
          <p className="g-lead">{BRAND}은 강아지·고양이 분양샵을 운영하고 가맹점을 모집하는 가맹 본사입니다.</p>
        </div>
      </section>
      <section className="g-sec">
        <div className="wrap">
          <article className="g-article">
            <h2>{BRAND} 가맹 본사</h2>
            <section>
              <h3>하는 일</h3>
              <p>강아지·고양이 분양샵 가맹 창업을 상담합니다. 창업 컨설팅, 점주 교육, 오픈, 운영 관리를 본사가 지원합니다.</p>
              <p>지역별 창업 안내는 <Link href="/#regions">지역별 창업</Link>에, 창업 준비 글은 <Link href="/blog/">창업 가이드</Link>에 있습니다.</p>
            </section>
            <section>
              <h3>매장 위치</h3>
              {BRANCHES.map((b) => <p key={b.name}>{b.name}은 {b.address}에 있습니다. 전화는 {b.phone}입니다.</p>)}
            </section>
            <section>
              <h3>연락 방법</h3>
              <p>가맹 상담은 전화 <a href={tel}>{CONTACT.phone}</a>와 <a href={LINKS.kakao} target="_blank" rel="noopener">카카오톡 채널</a>로 받습니다. 상담은 본사 매장 방문으로 진행합니다.</p>
            </section>
            <section>
              <h3>사업자 정보</h3>
              <p>상호는 {BUSINESS.name}, 대표는 {BUSINESS.owner}, 사업자등록번호는 {BUSINESS.bizNumber}입니다. 주소는 {BUSINESS.address}입니다.</p>
              <p><a href={LINKS.home} target="_blank" rel="noopener">공식 사이트</a> · <a href={LINKS.blog} target="_blank" rel="noopener">네이버 블로그</a> · <a href={LINKS.instagram} target="_blank" rel="noopener">인스타그램</a> · <a href={LINKS.youtube} target="_blank" rel="noopener">유튜브</a></p>
              <p>이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
