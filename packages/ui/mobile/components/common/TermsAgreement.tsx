"use client";
import React, { useState, useMemo, useRef } from 'react';
import FullPopup from '../Popup/FullPopup';
import Button from './Button'; 

// --- 전체 동의 팝업 설정 타입 ---
export interface AllAgreePopupConfig {
  title?: string;
  content?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface TermFooterConfig {
  confirmLabel?: string;
  cancelLabel?: string;
  hideFooter?: boolean;
}

export interface TermChild {
  id: string;
  label: string;
  required?: boolean;
  hideDetailBtn?: boolean;
  children?: TermChild[];
  content?: React.ReactNode; 
  footerConfig?: TermFooterConfig;
}

export interface TermParent {
  id: string;
  label: string;
  required: boolean;
  children?: TermChild[];
  content?: React.ReactNode;
  footerConfig?: TermFooterConfig;
}

interface TermsAgreementProps {
  items: TermParent[];
  allAgreePopupConfig?: AllAgreePopupConfig;
  hideAllAgree?: boolean; // [추가] 전체 동의 영역 숨김 여부
}

export default function TermsAgreement({ items, allAgreePopupConfig, hideAllAgree = false }: TermsAgreementProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [activeTerm, setActiveTerm] = useState<TermParent | TermChild | null>(null);
  const [isAllAgreePopupOpen, setIsAllAgreePopupOpen] = useState(false);
  const allCheckRef = useRef<HTMLInputElement>(null);

  // 1단계 ~ 3단계 모든 ID 추출
  const allIds = useMemo(() => {
    const ids: string[] = [];
    items.forEach(p => {
      ids.push(p.id);
      p.children?.forEach(c => {
        ids.push(c.id);
        c.children?.forEach(sc => ids.push(sc.id));
      });
    });
    return ids;
  }, [items]);

  const isAllChecked = allIds.length > 0 && allIds.every(id => checkedIds.has(id));

  const handleAllCheckClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault(); 
    if (isAllChecked) {
      setCheckedIds(new Set());
    } else {
      setIsAllAgreePopupOpen(true);
    }
  };
  
  const confirmAllAgree = () => {
    setCheckedIds(new Set(allIds));
    setIsAllAgreePopupOpen(false);
    setTimeout(() => { allCheckRef.current?.focus(); }, 100);
  };

  const cancelAllAgree = () => {
    setIsAllAgreePopupOpen(false);
  };

  // --- [1단계] 부모 체크 핸들러 ---
  const handleParentCheck = (parent: TermParent) => {
    const newChecked = new Set(checkedIds);
    const allRelated = [parent.id];
    parent.children?.forEach(c => {
      allRelated.push(c.id);
      c.children?.forEach(sc => allRelated.push(sc.id));
    });

    if (checkedIds.has(parent.id)) {
      allRelated.forEach(id => newChecked.delete(id));
    } else {
      allRelated.forEach(id => newChecked.add(id));
    }
    setCheckedIds(newChecked);
  };
  
  // --- [2단계] 자식 체크 핸들러 ---
  const handleChildCheck = (childId: string, parent: TermParent, childItem: TermChild) => {
    const newChecked = new Set(checkedIds);
    const selfAndSubs = [childId, ...(childItem.children?.map(sc => sc.id) || [])];

    if (newChecked.has(childId)) {
      // 해제 시: 본인 + 하위(3단계) 모두 해제 + 상위(1단계) 해제
      selfAndSubs.forEach(id => newChecked.delete(id));
      newChecked.delete(parent.id);
    } else {
      // 체크 시: 본인 + 하위(3단계) 모두 체크
      selfAndSubs.forEach(id => newChecked.add(id));
      
      // 상위(1단계) 체크 여부 판단
      const siblings = parent.children || [];
      const allRequiredSiblingsChecked = siblings.every(sib => 
        (sib.required === false) || 
        sib.id === childId || 
        newChecked.has(sib.id)
      );
      if (allRequiredSiblingsChecked) newChecked.add(parent.id);
    }
    setCheckedIds(newChecked);
  };

  // --- [3단계] 손자 체크 핸들러 (수정됨) ---
  const handleSubChildCheck = (subId: string, parent: TermParent, child: TermChild) => {
    const newChecked = new Set(checkedIds);
    
    if (newChecked.has(subId)) {
      // [수정 포인트] 해제 로직
      newChecked.delete(subId);

      // 형제들(같은 그룹의 3단계 항목들)이 하나라도 체크되어 있는지 확인
      const siblings = child.children || [];
      const hasAnySiblingChecked = siblings.some(sib => 
        sib.id !== subId && newChecked.has(sib.id)
      );

      // 형제들이 모두 꺼졌다면 -> 직계 부모(2단계, term_3_1)도 해제
      if (!hasAnySiblingChecked) {
        newChecked.delete(child.id);
        
        // 2단계가 꺼졌으므로, 1단계(최상위)도 당연히 해제
        newChecked.delete(parent.id);
      }

    } else {
      // 체크 로직
      newChecked.add(subId);
      newChecked.add(child.id); // 하위가 체크되면 상위(2단계)도 자동 체크

      // 1단계(최상위) 체크 여부 확인
      const parentSiblings = parent.children || [];
      const allRequiredParentSiblingsChecked = parentSiblings.every(sib => 
        (sib.required === false) || 
        sib.id === child.id || 
        newChecked.has(sib.id)
      );
      if (allRequiredParentSiblingsChecked) newChecked.add(parent.id);
    }
    setCheckedIds(newChecked);
  };

  const toggleAccordion = (parentId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(parentId)) newExpanded.delete(parentId);
    else newExpanded.add(parentId);
    setExpandedIds(newExpanded);
  };

  const openDetailPopup = (term: TermParent | TermChild) => { setActiveTerm(term); };
  const closeDetailPopup = () => { setActiveTerm(null); };

  // --- 팝업 내 "동의하고 닫기" ---
  const handleAgreeAndClose = () => {
    if (!activeTerm) return;

    for (const parent of items) {
      // 1. 부모(1단계) 찾기
      if (parent.id === activeTerm.id) {
        if (!checkedIds.has(parent.id)) handleParentCheck(parent);
        break;
      }
      if (parent.children) {
        for (const child of parent.children) {
          // 2. 자식(2단계) 찾기
          if (child.id === activeTerm.id) {
            if (!checkedIds.has(child.id)) handleChildCheck(child.id, parent, child);
            closeDetailPopup(); return;
          }
          if (child.children) {
            for (const sub of child.children) {
              // 3. 손자(3단계) 찾기
              if (sub.id === activeTerm.id) {
                if (!checkedIds.has(sub.id)) handleSubChildCheck(sub.id, parent, child);
                closeDetailPopup(); return;
              }
            }
          }
        }
      }
    }
    closeDetailPopup();
  };

  const renderFooter = () => {
    if (!activeTerm) return null;
    const config = activeTerm.footerConfig;
    if (config?.hideFooter) return null;

    const confirmText = config?.confirmLabel || "동의하기";
    const cancelText = config?.cancelLabel;

    return (
      <div className="btn-group" style={{ display: 'flex', gap: '8px' }}>
        {cancelText && (
          <Button variant="sec" onClick={closeDetailPopup} style={{ flex: 1 }}>{cancelText}</Button>
        )}
        <Button variant="pri" onClick={handleAgreeAndClose} style={{ flex: 1 }}>{confirmText}</Button>
      </div>
    );
  };

  const popupTitle = allAgreePopupConfig?.title || "약관 전체 동의";
  const popupConfirmBtn = allAgreePopupConfig?.confirmLabel || "모두 동의하기";
  const popupCancelBtn = allAgreePopupConfig?.cancelLabel || "취소";
  const popupContent = allAgreePopupConfig?.content || "전체 약관에 동의하시겠습니까?";

  return (
    <div className="terms-container">
      {/* --- [수정] 전체 동의 노출 옵션 적용 --- */}
      {!hideAllAgree && (
        <div className="check-item all-check">
          <input 
            ref={allCheckRef}
            type="checkbox" 
            id="agree_all" 
            className="input"
            checked={isAllChecked} 
            onClick={handleAllCheckClick} 
            readOnly
          />
          <label htmlFor="agree_all">약관 전체 동의</label>
        </div>
      )}

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
                {hasChildren ? (
                  <button
                    type="button" className="btn-accor js-btnAccor"
                    aria-expanded={isExpanded} aria-controls={`panel_${parent.id}`}
                    aria-label={`${parent.label} ${isExpanded ? '접기' : '펼치기'}`}
                    onClick={() => toggleAccordion(parent.id)}
                  ></button>
                ) : (
                  <button 
                    type="button" className="btn-ico-arrow" 
                    aria-label={`${parent.label} 자세히 보기`}
                    onClick={() => openDetailPopup(parent)}
                  ></button>
                )}
              </div>

              {hasChildren && (
                <div id={`panel_${parent.id}`} className="terms-accor-body" style={{ display: isExpanded ? 'block' : 'none' }}>
                  <ul className="terms-list">
                    {parent.children?.map((child) => (
                      <li key={child.id} className="terms-sub-item">
                        <div className="check-item">
                          <input
                            type="checkbox" id={child.id} className="input"
                            checked={checkedIds.has(child.id)} 
                            onChange={() => handleChildCheck(child.id, parent, child)}
                          />
                          <label htmlFor={child.id}>
                            {child.label}
                            {child.required === false && <span className="optional" style={{color:'#888', marginLeft:'4px'}}>(선택)</span>}
                          </label>
                        </div>
                        {!child.hideDetailBtn && (
                           <button type="button" className="btn-ico-arrow" onClick={() => openDetailPopup(child)}></button>
                        )}

                        {child.children && child.children.length > 0 && (
                          <ul className="terms-sub-list" style={{ paddingLeft: '20px', marginTop: '8px', background: '#f9f9f9', borderRadius: '4px' }}>
                            {child.children.map((sub) => (
                              <li key={sub.id} style={{ padding: '8px 0' }}>
                                <div className="check-item">
                                  <input
                                    type="checkbox" id={sub.id} className="input"
                                    checked={checkedIds.has(sub.id)}
                                    onChange={() => handleSubChildCheck(sub.id, parent, child)}
                                  />
                                  <label htmlFor={sub.id} style={{ fontSize: '14px' }}>
                                    {sub.label}
                                    {sub.required === false && <span className="optional" style={{color:'#888', marginLeft:'4px'}}>(선택)</span>}
                                  </label>
                                </div>
                                {!sub.hideDetailBtn && (
                                   <button type="button" className="btn-ico-arrow" onClick={() => openDetailPopup(sub)}></button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <FullPopup
        open={!!activeTerm} onClose={closeDetailPopup}
        title={activeTerm?.label || ""} footer={renderFooter()}
      >
        <div className="terms-content-view">
          {activeTerm?.content || "약관 상세 내용이 없습니다."}
        </div>
      </FullPopup>

      <FullPopup
        open={isAllAgreePopupOpen} onClose={cancelAllAgree}
        title={popupTitle} footer={
          <div className="btn-group">
            <Button variant="sec" onClick={cancelAllAgree}>{popupCancelBtn}</Button>
            <Button variant="pri" onClick={confirmAllAgree}>{popupConfirmBtn}</Button>
          </div>
        }
      >
        {popupContent}
      </FullPopup>
    </div>
  );
}