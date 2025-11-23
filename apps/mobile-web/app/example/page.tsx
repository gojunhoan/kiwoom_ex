
import React from 'react';
import KyMoLayout from "../../../../packages/ui/mobile/components/Layout/KyMoLayout";
import { Title, TextList } from '../../../../packages/ui/mobile/components/common/Typography';
import { Tooltip } from '../../../../packages/ui/mobile/components/common/Tooltip';
import { Tabs } from '../../../../packages/ui/mobile/components/common/Tabs';
import { Accordion } from '../../../../packages/ui/mobile/components/common/Accordion';
import { Toggle } from '../../../../packages/ui/mobile/components/common/Toggle';
import TermsAgreement from '../../../../packages/ui/mobile/components/common/TermsAgreement';
import Link from 'next/link';


export default function ExamplePage() {
  const tabData = [
    {
      label: '제품 상세',
      content: (
        <article>
          <h3 className="text-xl font-bold mb-2">제품 상세 정보</h3>
          <p className="text-gray-600">
            이 영역은 <strong>서버 컴포넌트</strong>에서 작성된 HTML입니다.
            SEO에 유리하며, 초기 로딩 시 HTML에 포함되어 전송됩니다.
          </p>
        </article>
      ),
    },
    {
      label: '사용 방법',
      content: (
        <section>
          {/* 기존에 만들었던 TextList 컴포넌트 재사용 가능 */}
          <TextList 
            type="dot" 
            items={[
              '전원을 켭니다.',
              '설정 메뉴로 들어갑니다.',
              '완료 버튼을 누릅니다.'
            ]} 
          />
        </section>
      ),
    },
    {
      label: '리뷰',
      content: <div className="p-4 bg-gray-50 rounded text-center">작성된 리뷰가 없습니다.</div>,
    },
  ];

  
  const tabData2 = [
    {
      label: '제품 상세',
      content: (
        <article>
          <h3 className="text-xl font-bold mb-2">제품 상세 정보</h3>
          <p className="text-gray-600">
            이 영역은 <strong>서버 컴포넌트</strong>에서 작성된 HTML입니다.
            SEO에 유리하며, 초기 로딩 시 HTML에 포함되어 전송됩니다.
          </p>
        </article>
      ),
    },
    {
      label: '사용 방법',
      content: (
        <section>
          {/* 기존에 만들었던 TextList 컴포넌트 재사용 가능 */}
          <TextList 
            type="dot" 
            items={[
              '전원을 켭니다.',
              '설정 메뉴로 들어갑니다.',
              '완료 버튼을 누릅니다.'
            ]} 
          />
        </section>
      ),
    },
    {
      label: '리뷰',
      content: <div className="p-4 bg-gray-50 rounded text-center">작성된 리뷰가 없습니다.</div>,
    },
  ];
  
  // 서버에서 정의된 데이터 (SEO 친화적)
  const faqData = [
    {
      label: 'Q. 배송은 얼마나 걸리나요?',
      content: (
        <div>
          <p className="mb-2">보통 주문 후 <strong>2~3일 이내</strong>에 도착합니다.</p>
          <ul className="list-disc pl-4 text-sm bg-gray-50 p-3 rounded">
            <li>도서 산간 지역은 1~2일 추가 소요됩니다.</li>
            <li>주말/공휴일은 배송 기간에서 제외됩니다.</li>
          </ul>
        </div>
      ),
    },
    {
      label: 'Q. 교환/환불 규정이 궁금합니다.',
      content: '상품 수령 후 7일 이내에 고객센터로 접수해주시면 처리가 가능합니다. 단, 상품 가치가 훼손된 경우 처리가 불가능할 수 있습니다.',
    },
    {
      label: 'Q. 회원가입 혜택은 무엇인가요?',
      content: (
        <span>
          신규 회원 가입 시 <em className="text-blue-600 not-italic">3,000원 할인 쿠폰</em>을 즉시 지급해 드립니다.
        </span>
      ),
    },
  ];
  
  // 서버 컴포넌트 영역: 여기서 데이터를 정의하거나 API를 호출합니다.
  const TERMS_DATA: TermParent[] = [
    {
      id: 'term_1',
      label: '계약진행을 위한 개인(신용)정보 동의',
      required: true,
      children: [
        { id: 'term_1_1', label: '수집·이용에 관한 사항' },
        { id: 'term_1_2', label: '조회에 관한 사항' },
        { id: 'term_1_3', label: '제공에 관한 사항' },
        { id: 'term_1_4', label: '[국외]제공에 관한 사항' },
        { id: 'term_1_5', label: '개인(신용)정보 동의 관련 추가확인사항' },
      ],
    },
    {
      id: 'term_2',
      label: '휴대폰 인증 진행을 위한 개인(신용)정보처리 동의',
      required: true,
      children: [
        { id: 'term_2_1', label: '개인(신용)정보의 수집·이용에 대한 필수적 동의' },
        { id: 'term_2_2', label: '개인고유식별정보(주민등록번호) 처리에 대한 필수적 동의' },
        { id: 'term_2_3', label: '서비스 이용약관에 대한 필수적 동의' },
        { id: 'term_2_4', label: '통신사 이용약관에 대한 필수적 동의' },
      ],
    },
    {
      id: 'term_3',
      label: '비대면 실명인증 진행을 위한 개인(신용)정보처리 동의',
      required: true,
      children: [
        { id: 'term_3_1', label: '수집·이용에 관한 사항' },
        { id: 'term_3_2', label: '제공에 관한 사항' },
      ],
    },
    {
      id: 'term_4',
      label: '전자금융거래 기본약관 동의',
      required: true,
      // 자식 항목 없음
    },
    {
      id: 'term_5',
      label: '보험 및 금융상품 소개를 위한 개인신용정보 동의',
      required: false, 
    },
  ];

  return (
    <KyMoLayout 
      title="가계주택담보대출 신청"
      showHome={false}
      showCancel={true}
      // showMenu={false} 기본값 false 
    >
      <div className="ky-mo-contents">
        <section className="mb-8">
        <Title level={1}>기본 h1 태그입니다.</Title>
        <Title level={2}>기본 h2 태그입니다.</Title>
        <Title level={3}>기본 h3 태그입니다.</Title>
        <Title level={4}>기본 h4 태그입니다.</Title>
        <Title level={5}>기본 h5 태그입니다.</Title>
        <Title level={6}>기본 h6 태그입니다.</Title>
        
        {/* <h1~6> 태그 미사용시 */}
        <Title level={1} as="div">
          모양은 H1이지만 실제는 DIV입니다.
        </Title>
        </section>

      {/* (ul > li) */}
      <section className="mb-6">
        <Title level={4}>1. 기본형 (ul, li)</Title>
        <TextList 
          type="dot" 
          items={['기본 리스트 아이템 1', '기본 리스트 아이템 2']} 
        />
      </section>

      {/* CASE 2: 순서가 있는 리스트 (ol > li) */}
      <section className="mb-6">
        <Title level={4}>2. 순서형 태그 (ol, li)</Title>
        {/* 스타일은 'dash' 모양이지만, 스크린 리더는 '목록'으로 인식 */}
        <TextList 
          type="dash" 
          items={['첫 번째 단계', '두 번째 단계']} 
        />
      </section>

      {/* CASE 3: 단순 영역 나열 (div > div/p) */}
      <section className="mb-6">
        <Title level={4}>3. 박스형 (div, div)</Title>
        {/* 리스트 태그를 쓰면 안되는 상황(예: 버튼 그룹 등)에서 시각적 스타일만 차용 */}
        <TextList 
          type="remark" 
          items={[
            // 1. 단순 문자열
        '첫 번째 단계는 일반 텍스트입니다.',

        // 2. 텍스트 중간에 태그 섞어 쓰기 (span, strong, b 등)
        <span key="2">
          두 번째 단계는 <strong style={{ color: '#2563eb' }}>중요한 포인트</strong>가 강조됩니다.
        </span>,

        // 3. 링크 태그 넣기
        <span key="3">
          세 번째는 <Link href="/login" style={{ textDecoration: 'underline' }}>로그인 페이지</Link>로 이동합니다.
        </span>,

        // 4. 줄바꿈(br)이 필요한 경우
        <span key="4">
          네 번째 단계는 내용이 길어서<br/>
          다음 줄로 넘어갑니다.
        </span>
          ]} 
        />
      </section>

      {/* CASE 4: 인라인 요소 나열 (nav > span) */}
      <section className="mb-6">
        <Title level={4}>4. 인라인형 (nav, span)</Title>
        <TextList 
          as="nav" 
          itemAs="span" 
          type="dash" 
          items={[
            <a href="#">홈</a>, 
            <a href="#">소개</a>, 
            <a href="#">연락처</a>,
          ]} 
        />
      </section>

      <section>
          <Title level={4}>1. Click Trigger (Default)</Title>
          <Tooltip content="클릭해서 열린 툴팁입니다. 닫기 버튼으로 닫으세요.">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              클릭해보세요
            </button>
          </Tooltip>
        </section>
        <section>
          <Title level={4}>3. 위치 자동 보정 (Flip)</Title>
          <p className="mb-2 text-sm text-gray-500">
            화면 상단 공간이 부족하면 자동으로 아래(Bottom)로 뜹니다.
          </p>
          {/* 강제로 Top을 주었지만 공간 부족 시 Bottom으로 렌더링 */}
          <Tooltip content="위쪽 공간이 좁아서 아래로 뒤집혔습니다!" defaultDirection="top">
            <button className="px-4 py-2 border border-gray-300 rounded">
              Auto
            </button>
          </Tooltip>
        </section><section className="space-y-8 p-4">
        
        {/* 1. 기본형 */}
        <div>
          <Title level={4}>1. Basic Toggle</Title>
          <Toggle 
            name="alarm1"          // Form 전송 시 key
            label="알림 받기" 
            defaultChecked={false} // 초기값만 설정 (이후 브라우저가 관리)
          />
        </div>

        {/* 2. 텍스트 노출형 (ON/OFF) */}
        <div>
          <Title level={4}>2. Text Inside (ON/OFF)</Title>
          <Toggle 
            name="alarm"          // Form 전송 시 key
            label="알림 받기" 
            defaultChecked={false} // 초기값만 설정 (이후 브라우저가 관리)
          />
        </div>

        {/* 3. 커스텀 텍스트 */}
        <div>
          <Title level={4}>3. Custom Text</Title>
          <Toggle 
            label="언어 설정"
            onText="KR"
            offText="EN"
            showStateText={true}
            defaultChecked
          />
        </div>

        {/* 4. Disabled */}
        <div>
          <Title level={4}>4. Disabled State</Title>
          <div className="flex gap-4">
            <Toggle label="비활성 (Off)" disabled />
            <Toggle label="비활성 (On)" disabled defaultChecked />
          </div>
        </div>

      </section>
      <section>
        <Tabs type="round" items={tabData} />
        <Tabs type="line" items={tabData2} />
      </section>
      <section>
        <Tabs type="round" items={tabData} />
        <Tabs type="line" items={tabData2} />
      </section>

      {/* Case 1: 기본형 (하나만 열림) */}
        <section>
          <Title level={4}>1. 자주 묻는 질문 (Accordion)</Title>
          <p className="text-sm text-gray-500 mb-4">하나를 열면 다른 항목은 닫힙니다.</p>
          <Accordion items={faqData} />
        </section>

        {/* Case 2: 다중 선택형 (Collapsible) */}
        <section>
          <Title level={4}>2. 공지사항 (Multi Open)</Title>
          <p className="text-sm text-gray-500 mb-4">여러 항목을 동시에 열 수 있습니다.</p>
          <Accordion 
            allowMultiple={true} 
            defaultOpenIndex={[0]} // 첫 번째 항목 열어두기
            items={[
              { label: '공지사항 1', content: '내용입니다...' },
              { label: '공지사항 2', content: '내용입니다...' }
            ]} 
          />
        </section>
        <section>
          <TermsAgreement items={TERMS_DATA} />          
        </section>
        
      </div>
    </KyMoLayout>
  );
}