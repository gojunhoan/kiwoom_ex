"use client";
import React, { useState, useMemo } from 'react';

// 외부에서 사용할 수 있게 타입 export
export interface TermChild {
  id: string;
  label: string;
  link?: string;
}

export interface TermParent {
  id: string;
  label: string;
  required: boolean;
  children?: TermChild[];
}

interface TermsAgreementProps {
  items: TermParent[]; // 부모로부터 받을 데이터
}

export default function TermsAgreement({ items }: TermsAgreementProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // props로 받은 items를 기반으로 전체 ID 추출
  const allIds = useMemo(() => {
    const ids: string[] = [];
    items.forEach(parent => {
      ids.push(parent.id);
      parent.children?.forEach(child => ids.push(child.id));
    });
    return ids;
  }, [items]); // items가 바뀔 때만 재계산

  const isAllChecked = allIds.length > 0 && allIds.every(id => checkedIds.has(id));

  // --- 1. 전체 동의 핸들러 ---
  const handleAllCheck = () => {
    if (isAllChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(allIds));
    }
  };

  // --- 2. 부모 약관 체크 핸들러 ---
  const handleParentCheck = (parent: TermParent) => {
    const newChecked = new Set(checkedIds);
    const parentId = parent.id;
    const childIds = parent.children?.map(c => c.id) || [];
    const allRelatedIds = [parentId, ...childIds];

    const isParentChecked = checkedIds.has(parentId);

    if (isParentChecked) {
      allRelatedIds.forEach(id => newChecked.delete(id));
    } else {
      allRelatedIds.forEach(id => newChecked.add(id));
    }
    setCheckedIds(newChecked);
  };

  // --- 3. 자식 약관 체크 핸들러 ---
  const handleChildCheck = (childId: string, parent: TermParent) => {
    const newChecked = new Set(checkedIds);
    
    if (newChecked.has(childId)) {
      newChecked.delete(childId);
      newChecked.delete(parent.id);
    } else {
      newChecked.add(childId);
      const allChildrenChecked = parent.children?.every(c => 
        c.id === childId || newChecked.has(c.id)
      );
      if (allChildrenChecked) {
        newChecked.add(parent.id);
      }
    }
    setCheckedIds(newChecked);
  };

  // --- 4. 아코디언 토글 ---
  const toggleAccordion = (parentId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(parentId)) newExpanded.delete(parentId);
    else newExpanded.add(parentId);
    setExpandedIds(newExpanded);
  };

  return (
    <div className="terms-container">
      {/* 전체 동의 */}
      <div className="check-item all-check">
        <input 
          type="checkbox" 
          id="agree_all" 
          className="input" // class -> className 수정
          checked={isAllChecked}
          onChange={handleAllCheck}
        />
        <label htmlFor="agree_all">약관 전체 동의</label>
      </div>

      {/* 리스트 렌더링 (items prop 사용) */}
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
                    type="checkbox"
                    id={parent.id}
                    className="input"
                    checked={isChecked}
                    onChange={() => handleParentCheck(parent)}
                    required={parent.required}
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
                    type="button"
                    className="btn-accor js-btnAccor"
                    aria-expanded={isExpanded}
                    aria-controls={`panel_${parent.id}`}
                    aria-label={`${parent.label} ${isExpanded ? '접기' : '펼치기'}`}
                    onClick={() => toggleAccordion(parent.id)}
                  ></button>
                ) : (
                  <button type="button" className="btn-ico-arrow" aria-label="자세히 보기"></button>
                )}
              </div>

              {hasChildren && (
                <div 
                  id={`panel_${parent.id}`}
                  className="terms-accor-body"
                  style={{ display: isExpanded ? 'block' : 'none' }}
                >
                  <ul className="terms-list">
                    {parent.children?.map((child) => (
                      <li key={child.id}>
                        <div className="check-item">
                          <input
                            type="checkbox"
                            id={child.id}
                            className="input"
                            checked={checkedIds.has(child.id)}
                            onChange={() => handleChildCheck(child.id, parent)}
                          />
                          <label htmlFor={child.id}>{child.label}</label>
                        </div>
                        <button type="button" className="btn-ico-arrow" aria-label="자세히보기"></button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}