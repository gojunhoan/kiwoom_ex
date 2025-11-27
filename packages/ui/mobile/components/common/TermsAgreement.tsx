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
  content?: React.ReactNode; 
  footerConfig?: TermFooterConfig; // 개별 설정 추가
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
  const allIds = useMemo(() => { const ids: string[] = []; items.forEach(p => { ids.push(p.id); p.children?.forEach(c => ids.push(c.id)); }); return ids; }, [items]);
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
  const handleParentCheck = (parent: TermParent) => { const newChecked = new Set(checkedIds); const allRelated = [parent.id, ...(parent.children?.map(c=>c.id)||[])]; if(checkedIds.has(parent.id)) allRelated.forEach(id=>newChecked.delete(id)); else allRelated.forEach(id=>newChecked.add(id)); setCheckedIds(newChecked); };
  
  // 자식 체크 핸들러
  const handleChildCheck = (childId: string, parent: TermParent) => { const newChecked = new Set(checkedIds); if(newChecked.has(childId)) { newChecked.delete(childId); newChecked.delete(parent.id); } else { newChecked.add(childId); if(parent.children?.every(c=>c.id===childId||newChecked.has(c.id))) newChecked.add(parent.id); } setCheckedIds(newChecked); };

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

    // 현재 팝업의 약관이 부모인지 자식인지 찾아서 체크 로직 수행
    const parent = items.find(p => p.id === activeTerm.id || p.children?.some(c => c.id === activeTerm.id));
    
    if (parent) {
      if (parent.id === activeTerm.id) {
        // 부모 약관인 경우 -> 체크 안되어있으면 체크
        if (!checkedIds.has(activeTerm.id)) handleParentCheck(parent);
      } else {
        // 자식 약관인 경우 -> 체크 안되어있으면 체크
        if (!checkedIds.has(activeTerm.id)) handleChildCheck(activeTerm.id, parent);
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
                      <li key={child.id}>
                        <div className="check-item">
                          <input
                            type="checkbox" id={child.id} className="input"
                            checked={checkedIds.has(child.id)} onChange={() => handleChildCheck(child.id, parent)}
                          />
                          <label htmlFor={child.id}>{child.label}</label>
                        </div>
                        
                        {/* --- [수정 5] 자식 항목 상세 보기 버튼 연결 --- */}
                        <button 
                          type="button" 
                          className="btn-ico-arrow" 
                          aria-label={`${child.label} 자세히보기`}
                          onClick={() => openDetailPopup(child)}
                        ></button>
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