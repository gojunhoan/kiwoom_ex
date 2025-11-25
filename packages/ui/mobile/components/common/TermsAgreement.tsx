"use client";
import React, { useState, useMemo } from 'react';
import FullPopup from '../Popup/FullPopup';

// --- [수정 1] 데이터 타입 확장 (content 추가) ---
export interface TermChild {
  id: string;
  label: string;
  content?: React.ReactNode; 
}

export interface TermParent {
  id: string;
  label: string;
  required: boolean;
  children?: TermChild[];
  content?: React.ReactNode; 
}

interface TermsAgreementProps {
  items: TermParent[];
}

export default function TermsAgreement({ items }: TermsAgreementProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // --- [수정 2] 팝업 상태 관리 ---
  // 현재 보고 있는 약관 객체 (null이면 팝업 닫힘)
  const [activeTerm, setActiveTerm] = useState<TermParent | TermChild | null>(null);

  // 기존 로직들 (allIds, checks...)
  const allIds = useMemo(() => {
    const ids: string[] = [];
    items.forEach(parent => {
      ids.push(parent.id);
      parent.children?.forEach(child => ids.push(child.id));
    });
    return ids;
  }, [items]);

  const isAllChecked = allIds.length > 0 && allIds.every(id => checkedIds.has(id));

  // ... (기존 체크 핸들러들: handleAllCheck, handleParentCheck, handleChildCheck 유지) ...
  const handleAllCheck = () => { /* ...생략... */ if(isAllChecked) setCheckedIds(new Set()); else setCheckedIds(new Set(allIds)); };
  const handleParentCheck = (parent: TermParent) => { /* ...생략... */ const newChecked = new Set(checkedIds); const allRelated = [parent.id, ...(parent.children?.map(c=>c.id)||[])]; if(checkedIds.has(parent.id)) allRelated.forEach(id=>newChecked.delete(id)); else allRelated.forEach(id=>newChecked.add(id)); setCheckedIds(newChecked); };
  const handleChildCheck = (childId: string, parent: TermParent) => { /* ...생략... */ const newChecked = new Set(checkedIds); if(newChecked.has(childId)) { newChecked.delete(childId); newChecked.delete(parent.id); } else { newChecked.add(childId); if(parent.children?.every(c=>c.id===childId||newChecked.has(c.id))) newChecked.add(parent.id); } setCheckedIds(newChecked); };

  const toggleAccordion = (parentId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(parentId)) newExpanded.delete(parentId);
    else newExpanded.add(parentId);
    setExpandedIds(newExpanded);
  };

  // --- [수정 3] 상세 보기 핸들러 ---
  const openDetailPopup = (term: TermParent | TermChild) => {
    setActiveTerm(term);
  };

  const closeDetailPopup = () => {
    setActiveTerm(null);
  };

  return (
    <div className="terms-container">
      {/* 전체 동의 */}
      <div className="check-item all-check">
        <input 
          type="checkbox" id="agree_all" className="input"
          checked={isAllChecked} onChange={handleAllCheck}
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
      <FullPopup
        open={!!activeTerm} 
        onClose={closeDetailPopup}
        title={activeTerm?.label || ""} 
      >
        <div className="terms-content-view">
           {/* content가 ReactNode이므로 그냥 렌더링 가능 */}
           {activeTerm?.content || "약관 상세 내용이 없습니다."}
        </div>
      </FullPopup>
    </div>
  );
}