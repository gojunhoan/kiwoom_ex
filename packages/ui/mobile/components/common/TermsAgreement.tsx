"use client";
import React, { useState, useMemo, useRef } from 'react';
import FullPopup from '../Popup/FullPopup';
import Button from './Button'; 

// --- [추가] 전체 동의 팝업 설정 타입 ---
export interface AllAgreePopupConfig {
  title?: string;            // 팝업 제목 (기본값: 약관 전체 동의)
  content?: React.ReactNode; // 팝업 본문 (기본값: 있음)
  confirmLabel?: string;     // 확인 버튼 텍스트 (기본값: 모두 동의하기)
  cancelLabel?: string;      // 취소 버튼 텍스트 (기본값: 취소)
}

export interface TermFooterConfig {
  confirmLabel?: string; // 확인(동의) 버튼 텍스트 (기본값: 동의하기)
  cancelLabel?: string;  // 취소(닫기) 버튼 텍스트 (값이 있으면 버튼 노출)
  hideFooter?: boolean;  // true일 경우 푸터 숨김
}
export interface TermChild {
  id: string;
  label: string;
  required?: boolean;      // false일 경우 (선택)
  hideDetailBtn?: boolean; // 상세보기 화살표 숨김 여부
  children?: TermChild[];  // [추가] 3단계(Sub-Child) 지원
  content?: React.ReactNode; 
  footerConfig?: TermFooterConfig;
}

export interface TermParent {
  id: string;
  label: string;
  required: boolean;
  children?: TermChild[];
  content?: React.ReactNode;
  footerConfig?: TermFooterConfig; // 개별 설정 추가
}

interface TermsAgreementProps {
  items: TermParent[];
  allAgreePopupConfig?: AllAgreePopupConfig;
}

export default function TermsAgreement({ items, allAgreePopupConfig }: TermsAgreementProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [activeTerm, setActiveTerm] = useState<TermParent | TermChild | null>(null);
  const [isAllAgreePopupOpen, setIsAllAgreePopupOpen] = useState(false);
  const allCheckRef = useRef<HTMLInputElement>(null);

  // ... (기존 로직: allIds, handleAllCheck, handleParentCheck, handleChildCheck 등은 그대로 유지) ...
  // (코드 중략 - 기존과 동일)
const allIds = useMemo(() => {
    const ids: string[] = [];
    items.forEach(p => {
      ids.push(p.id);
      p.children?.forEach(c => {
        ids.push(c.id);
        // 3단계 자식 ID 추출
        c.children?.forEach(sc => ids.push(sc.id));
      });
    });
    return ids;
  }, [items]);
  const isAllChecked = allIds.length > 0 && allIds.every(id => checkedIds.has(id));
  const handleAllCheckClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // 1. 기본 체크 동작 막기 (React 제어 컴포넌트 패턴)
    e.preventDefault(); 

    if (isAllChecked) {
      // 이미 전체 선택된 상태라면 -> 그냥 해제 (팝업 없이)
      setCheckedIds(new Set());
    } else {
      // 전체 선택이 안 된 상태라면 -> 확인 팝업 오픈
      setIsAllAgreePopupOpen(true);
    }
  };
  
  // --- [추가] 팝업에서 "동의하기" 눌렀을 때 실행 ---
  const confirmAllAgree = () => {
    setCheckedIds(new Set(allIds)); // 전체 체크
    setIsAllAgreePopupOpen(false);  // 팝업 닫기
    
    // FullPopup이 자동으로 포커스를 돌려주지만, 
    // 만약 동작하지 않을 경우를 대비해 명시적으로 포커스 이동 (안전장치)
    setTimeout(() => {
      allCheckRef.current?.focus();
    }, 100);
  };

  // --- [추가] 팝업에서 "취소" 눌렀을 때 실행 ---
  const cancelAllAgree = () => {
    setIsAllAgreePopupOpen(false);
    // 체크하지 않고 닫음
  };

  // 부모 체크 핸들러 (재사용을 위해 분리하거나 기존 코드 사용)
  const handleParentCheck = (parent: TermParent) => {
    const newChecked = new Set(checkedIds);
    // 1단계, 2단계, 3단계 ID 모두 수집
    const allRelated = [parent.id];
    parent.children?.forEach(c => {
      allRelated.push(c.id);
      c.children?.forEach(sc => allRelated.push(sc.id));
    });

    // 토글 로직
    if (checkedIds.has(parent.id)) {
      allRelated.forEach(id => newChecked.delete(id));
    } else {
      allRelated.forEach(id => newChecked.add(id));
    }
    setCheckedIds(newChecked);
  };
  
  // 자식 체크 핸들러
  const handleChildCheck = (childId: string, parent: TermParent, childItem: TermChild) => {
    const newChecked = new Set(checkedIds);
    
    // 본인 및 하위(3단계) ID 목록
    const selfAndSubs = [childId, ...(childItem.children?.map(sc => sc.id) || [])];

    if (newChecked.has(childId)) {
      // 해제 시: 본인과 하위 모두 해제, 부모(1단계)도 해제
      selfAndSubs.forEach(id => newChecked.delete(id));
      newChecked.delete(parent.id);
    } else {
      // 체크 시: 본인과 하위 모두 체크
      selfAndSubs.forEach(id => newChecked.add(id));
      
      // 부모(1단계) 체크 여부 확인 (형제들의 필수 여부 확인)
      // 주의: 형제들 중 '필수'인 항목들이 모두 체크되어야 부모 체크
      const siblings = parent.children || [];
      const allRequiredSiblingsChecked = siblings.every(sib => 
        (sib.required === false) || // 선택항목은 패스
        sib.id === childId ||       // 방금 체크한 항목
        newChecked.has(sib.id)      // 이미 체크된 항목
      );
      
      if (allRequiredSiblingsChecked) newChecked.add(parent.id);
    }
    setCheckedIds(newChecked);
  };

  const handleSubChildCheck = (subId: string, parent: TermParent, child: TermChild) => {
    const newChecked = new Set(checkedIds);
    
    if (newChecked.has(subId)) {
      newChecked.delete(subId);
      // 3단계 선택약관 해제 시 상위(2단계)가 필수라면 해제하지 않음 (일반적 로직)
      // 단, 2단계도 풀고 싶다면: newChecked.delete(child.id); newChecked.delete(parent.id);
    } else {
      newChecked.add(subId);
      // 3단계 체크 시 상위(2단계) 자동 체크? 
      // 보통 하위를 체크하면 상위 그룹도 체크되는 것이 UX상 자연스러움
      newChecked.add(child.id); 

      // 2단계가 체크되었으니 1단계(최상위)도 체크 확인
      const siblings = parent.children || [];
      const allRequiredSiblingsChecked = siblings.every(sib => 
        (sib.required === false) || 
        sib.id === child.id || 
        newChecked.has(sib.id)
      );
      if (allRequiredSiblingsChecked) newChecked.add(parent.id);
    }
    setCheckedIds(newChecked);
  };

  const toggleAccordion = (parentId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(parentId)) newExpanded.delete(parentId);
    else newExpanded.add(parentId);
    setExpandedIds(newExpanded);
  };

  // 상세 보기 핸들러
  const openDetailPopup = (term: TermParent | TermChild) => { setActiveTerm(term); };
  const closeDetailPopup = () => { setActiveTerm(null); };

  // --- [수정 2] 팝업 내 "동의하고 닫기" 기능 구현 ---
  const handleAgreeAndClose = () => {
    if (!activeTerm) return;

    // activeTerm이 전체 데이터 중 어디에 속하는지 탐색 (1단계 ~ 3단계)
    for (const parent of items) {
      
      // Case 1: 현재 팝업이 '부모(1단계)' 약관인 경우
      if (parent.id === activeTerm.id) {
        if (!checkedIds.has(parent.id)) {
          handleParentCheck(parent);
        }
        break; // 찾았으니 루프 종료
      }

      // 자식 탐색
      if (parent.children) {
        for (const child of parent.children) {
          
          // Case 2: 현재 팝업이 '자식(2단계)' 약관인 경우
          if (child.id === activeTerm.id) {
            if (!checkedIds.has(child.id)) {
              // [수정] 3번째 인자로 child 객체(본인)를 넘겨줍니다.
              handleChildCheck(child.id, parent, child);
            }
            // 찾았으니 함수 종료(또는 break)를 위해 플래그 처리 필요하지만, 
            // 여기서는 return 없이 closeDetailPopup 호출로 이어지게 break 사용
            closeDetailPopup(); 
            return; 
          }

          // 손자 탐색 (3단계)
          if (child.children) {
            for (const sub of child.children) {
              
              // Case 3: 현재 팝업이 '손자(3단계)' 약관인 경우
              if (sub.id === activeTerm.id) {
                if (!checkedIds.has(sub.id)) {
                  // [추가] 3단계 핸들러 호출
                  handleSubChildCheck(sub.id, parent, child);
                }
                closeDetailPopup();
                return;
              }
            }
          }
        }
      }
    }

    closeDetailPopup();
  };

  // --- [수정 3] 푸터 렌더링 로직 ---
  const renderFooter = () => {
    if (!activeTerm) return null;
    
    const config = activeTerm.footerConfig;
    if (config?.hideFooter) return null; // 푸터 숨김 처리

    const confirmText = config?.confirmLabel || "동의하기";
    const cancelText = config?.cancelLabel; // 값이 없으면 버튼 미노출

    return (
      <div className="btn-group" style={{ display: 'flex', gap: '8px' }}>
        {cancelText && (
          <Button variant="sec" onClick={closeDetailPopup} style={{ flex: 1 }}>
            {cancelText}
          </Button>
        )}
        {/* 확인/동의 버튼 (항상 노출) */}
        <Button variant="pri" onClick={handleAgreeAndClose} style={{ flex: 1 }}>
          {confirmText}
        </Button>
      </div>
    );
  };

  const popupTitle = allAgreePopupConfig?.title || "약관 전체 동의";
  const popupConfirmBtn = allAgreePopupConfig?.confirmLabel || "모두 동의하기";
  const popupCancelBtn = allAgreePopupConfig?.cancelLabel || "취소";

  const popupContent = allAgreePopupConfig?.content || "전체 약관에 동의하시겠습니까?";

  return (
    <div className="terms-container">
      {/* ... (상단 체크박스 리스트 렌더링 부분은 기존과 동일) ... */}
       {/* (코드 중략 - 기존 렌더링 로직 유지) */}
      <div className="check-item all-check">
        <input 
          ref={allCheckRef} // [중요] 포커스 복귀를 위해 ref 연결
          type="checkbox" 
          id="agree_all" 
          className="input"
          checked={isAllChecked} 
          onClick={handleAllCheckClick} // onChange 대신 onClick으로 이벤트 인터셉트
          readOnly // React 경고 방지 (onClick에서 제어하므로)
        />
        <label htmlFor="agree_all">약관 전체 동의</label>
      </div>
      <ul className="terms-accor">
        {items.map((parent) => {
          const isExpanded = expandedIds.has(parent.id);
          const hasChildren = parent.children && parent.children.length > 0;
          const isChecked = checkedIds.has(parent.id);

          return (
            <li key={parent.id} className={`terms-accor-item ${isExpanded ? 'active' : ''}`}>
              <div className="terms-accor-head">
                <div className="check-item">
                  <input
                    type="checkbox" id={parent.id} className="input"
                    checked={isChecked} onChange={() => handleParentCheck(parent)}
                  />
                  <label htmlFor={parent.id}>
                    {parent.label}
                    <span className="required" style={{color: parent.required ? undefined : '#666'}}>
                      {parent.required ? '(필수)' : '(선택)'}
                    </span>
                  </label>
                </div>

                {/* 아코디언 버튼 or 상세 버튼 */}
                {hasChildren ? (
                  <button
                    type="button"
                    className="btn-accor js-btnAccor"
                    aria-expanded={isExpanded}
                    aria-controls={`panel_${parent.id}`}
                    aria-label={`${parent.label} ${isExpanded ? '접기' : '펼치기'}`}
                    onClick={() => toggleAccordion(parent.id)}
                  ></button>
                ) : (
                  // --- [수정 4] 부모 항목 상세 보기 버튼 연결 ---
                  <button 
                    type="button" 
                    className="btn-ico-arrow" 
                    aria-label={`${parent.label} 자세히 보기`}
                    onClick={() => openDetailPopup(parent)}
                  ></button>
                )}
              </div>

              {hasChildren && (
                <div id={`panel_${parent.id}`} className="terms-accor-body" style={{ display: isExpanded ? 'block' : 'none' }}>
                  <ul className="terms-list">
                    {parent.children?.map((child) => (
                      <li key={child.id} className="terms-sub-item"> {/* 스타일링용 클래스 */}
                        <div className="check-item">
                          <input
                            type="checkbox" id={child.id} className="input"
                            checked={checkedIds.has(child.id)} 
                            // 2단계 핸들러 호출 시 child 객체 전체 전달
                            onChange={() => handleChildCheck(child.id, parent, child)}
                          />
                          <label htmlFor={child.id}>
                            {child.label}
                            {child.required === false && <span className="optional" style={{color:'#888', marginLeft:'4px'}}>(선택)</span>}
                          </label>
                        </div>
                        {/* 2단계 상세 버튼 */}
                        {!child.hideDetailBtn && (
                           <button type="button" className="btn-ico-arrow" onClick={() => openDetailPopup(child)}></button>
                        )}

                        {/* ▼▼▼ [추가] 3단계(Sub-Child) 렌더링 ▼▼▼ */}
                        {child.children && child.children.length > 0 && (
                          <ul className="terms-sub-list" style={{ paddingLeft: '20px', marginTop: '8px', background: '#f9f9f9', borderRadius: '4px' }}>
                            {child.children.map((sub) => (
                              <li key={sub.id} style={{ padding: '8px 0' }}>
                                <div className="check-item">
                                  <input
                                    type="checkbox" id={sub.id} className="input"
                                    checked={checkedIds.has(sub.id)}
                                    // 3단계 핸들러 호출
                                    onChange={() => handleSubChildCheck(sub.id, parent, child)}
                                  />
                                  <label htmlFor={sub.id} style={{ fontSize: '14px' }}>
                                    {sub.label}
                                    {sub.required === false && <span className="optional" style={{color:'#888', marginLeft:'4px'}}>(선택)</span>}
                                  </label>
                                </div>
                                {/* 3단계 상세 버튼 (필요시) */}
                                {!sub.hideDetailBtn && (
                                   <button type="button" className="btn-ico-arrow" onClick={() => openDetailPopup(sub)}></button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                        {/* ▲▲▲ -------------------------- ▲▲▲ */}

                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
        
         
      </ul>

      {/* --- [기존] 개별 약관 상세 팝업 --- */}
      <FullPopup
        open={!!activeTerm}
        onClose={closeDetailPopup}
        title={activeTerm?.label || ""}
        footer={renderFooter()}
      >
        <div className="terms-content-view">
          {activeTerm?.content || "약관 상세 내용이 없습니다."}
        </div>
      </FullPopup>

      <FullPopup
        open={isAllAgreePopupOpen}
        onClose={cancelAllAgree} // 기존에 만든 닫기 핸들러
        title={popupTitle}       // 변수 적용
        footer={
          <div className="btn-group">
            <Button variant="sec" onClick={cancelAllAgree}>
              {popupCancelBtn}
            </Button>
            <Button variant="pri" onClick={confirmAllAgree}>
              {popupConfirmBtn}
            </Button>
          </div>
        }
      >
        {/* 변수 적용 (JSX) */}
        {popupContent}
      </FullPopup>
    </div>
  );
}