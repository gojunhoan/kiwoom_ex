'use client';

import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { Button, Dialog, DialogTrigger, Modal, Heading } from 'react-aria-components';
import { ChevronLeft, ChevronRight, X as XIcon, Calendar as CalendarIcon } from 'lucide-react';

// --- 타입 정의 ---
interface SingleModeProps {
  mode?: 'single';
  onChange?: (date: Date) => void;
  value?: Date | null;
}

interface RangeModeProps {
  mode: 'range';
  onChange?: (range: { startDate: Date | null; endDate: Date | null }) => void;
  value?: { startDate: Date | null; endDate: Date | null };
}

type CommonProps = {
  errorMessage?: string;
};

type Props = (SingleModeProps | RangeModeProps) & CommonProps;

// --- 유틸리티 ---
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

const parseDateString = (value: string): Date | null => {
  const clean = value.replace(/[^0-9]/g, '');
  if (clean.length !== 8) return null;
  const y = parseInt(clean.substring(0, 4), 10);
  const m = parseInt(clean.substring(4, 6), 10) - 1;
  const d = parseInt(clean.substring(6, 8), 10);
  const date = new Date(y, m, d);
  if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) return date;
  return null;
};

export default function DateSelector(props: Props) {
  const { mode = 'single', errorMessage } = props;
  
  const [isOpen, setIsOpen] = useState(false);
  
  // 내부 날짜 데이터 상태
  const [internalSingle, setInternalSingle] = useState<Date | null>(null);
  const [internalStart, setInternalStart] = useState<Date | null>(null);
  const [internalEnd, setInternalEnd] = useState<Date | null>(null);

  const [activeField, setActiveField] = useState<'single' | 'start' | 'end'>('single');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Input 텍스트 상태
  const [singleInputStr, setSingleInputStr] = useState('');
  const [startInputStr, setStartInputStr] = useState('');
  const [endInputStr, setEndInputStr] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Props 또는 내부 State에서 현재 날짜 가져오기
  const getSingleDate = () => (props.mode !== 'range' && props.value !== undefined ? props.value : internalSingle);
  const getStartDate = () => (props.mode === 'range' && props.value?.startDate !== undefined ? props.value.startDate : internalStart);
  const getEndDate = () => (props.mode === 'range' && props.value?.endDate !== undefined ? props.value.endDate : internalEnd);

  const singleDate = getSingleDate();
  const startDate = getStartDate();
  const endDate = getEndDate();
  
  // ⭐ [수정 핵심] useEffect 무한 루프 방지 로직 ⭐
  // 날짜 데이터가 변경되었을 때, "현재 입력된 텍스트"가 그 날짜를 이미 의미하고 있다면 업데이트 하지 않음.
  // (예: 사용자가 '20250101'을 입력 중일 때 '2025.01.01'로 강제 변환되어 커서가 튀는 현상 방지)

  useEffect(() => {
    const formatted = singleDate ? formatDate(singleDate) : '';
    // 현재 입력창 값과 포맷팅 된 값이 다를 때만 업데이트
    if (singleInputStr !== formatted) {
        // 단, 현재 입력값이 유효한 날짜이고 그게 현재 날짜와 같다면(타이핑 중이라면) 무시
        const parsed = parseDateString(singleInputStr);
        const isTypingSameDate = parsed && singleDate && parsed.getTime() === singleDate.getTime();
        
        if (!isTypingSameDate) {
            setSingleInputStr(formatted);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleDate]); // singleInputStr는 의존성에서 제외하여 루프 차단

  useEffect(() => {
    const formatted = startDate ? formatDate(startDate) : '';
    if (startInputStr !== formatted) {
        const parsed = parseDateString(startInputStr);
        const isTypingSameDate = parsed && startDate && parsed.getTime() === startDate.getTime();
        if (!isTypingSameDate) setStartInputStr(formatted);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  useEffect(() => {
    const formatted = endDate ? formatDate(endDate) : '';
    if (endInputStr !== formatted) {
        const parsed = parseDateString(endInputStr);
        const isTypingSameDate = parsed && endDate && parsed.getTime() === endDate.getTime();
        if (!isTypingSameDate) setEndInputStr(formatted);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);
  
  const hasSelection = mode === 'single' ? !!singleDate : !!startDate && !!endDate;
  const showError = errorMessage && !hasSelection;
  
  // 달력 데이터 생성
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(new Date(year, month, i));
    }
    return result;
  }, [year, month, firstDayOfMonth, daysInMonth]);
  
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleGoToday = () => setCurrentDate(new Date());

  const openModal = (field: 'single' | 'start' | 'end') => {
    setActiveField(field);
    let targetDate = new Date();
    if (field === 'single' && singleDate) targetDate = singleDate;
    if (field === 'start' && startDate) targetDate = startDate;
    if (field === 'end' && endDate) targetDate = endDate;
    setCurrentDate(new Date(targetDate));
    setIsOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: 'single' | 'start' | 'end') => {
    const val = e.target.value;
    
    // 1. 텍스트 상태는 즉시 업데이트 (입력 반응성)
    if (field === 'single') setSingleInputStr(val);
    else if (field === 'start') setStartInputStr(val);
    else if (field === 'end') setEndInputStr(val);

    // 2. 유효한 날짜 포맷일 경우에만 실제 데이터 업데이트
    const parsedDate = parseDateString(val);
    if (parsedDate) {
      if (mode === 'single') {
        setInternalSingle(parsedDate);
        if (props.mode !== 'range' && props.onChange) props.onChange(parsedDate);
      } else {
        if (field === 'start') {
          setInternalStart(parsedDate);
          if (props.mode === 'range' && props.onChange) props.onChange({ startDate: parsedDate, endDate });
        } else if (field === 'end') {
          setInternalEnd(parsedDate);
          if (props.mode === 'range' && props.onChange) props.onChange({ startDate, endDate: parsedDate });
        }
      }
    }
  };

  const handleSelectDate = (date: Date) => {
    // 날짜 선택 시 텍스트도 강제 업데이트 (여기는 확실히 값이 바뀌는 시점이므로)
    const formatted = formatDate(date);

    if (mode === 'single') {
      setInternalSingle(date);
      setSingleInputStr(formatted); // 즉시 반영
      setIsOpen(false);
      if (props.mode !== 'range' && props.onChange) props.onChange(date);
    } else {
      let newStart = startDate;
      let newEnd = endDate;

      if (activeField === 'start') {
        newStart = date;
        setStartInputStr(formatted);
        if (endDate && date > endDate) {
            newEnd = null; // 시작일이 종료일보다 뒤면 종료일 초기화
            setEndInputStr('');
        }
      } else {
        newEnd = date;
        setEndInputStr(formatted);
      }

      setInternalStart(newStart);
      setInternalEnd(newEnd);
      setIsOpen(false);
      if (props.mode === 'range' && props.onChange) props.onChange({ startDate: newStart, endDate: newEnd });
    }
  };

  const isSameDay = (d1: Date | null, d2: Date) => d1?.toDateString() === d2.toDateString();

  return (
    <div className="date-container">      
      <div className="date-range-row">
        {mode === 'single' ? (
          <div className={`date-input-box ${showError ? 'is-error' : ''} ${isOpen ? 'is-open' : ''}`}>
            <input
              type="text"
              className="date-real-input"
              value={singleInputStr}
              onChange={(e) => handleInputChange(e, 'single')}
              placeholder="YYYY.MM.DD"
              maxLength={10}
              aria-label="대출 희망일 입력"
              aria-invalid={!!showError}
            />
            <Button className="date-icon-btn" onPress={() => openModal('single')} aria-label="달력 열기">
              <CalendarIcon size={20} />
            </Button>
          </div>
        ) : (
          <>
            <div className={`date-input-box ${showError ? 'is-error' : ''} ${isOpen && activeField === 'start' ? 'is-open' : ''}`}>
              <input
                type="text"
                className="date-real-input"
                value={startInputStr}
                onChange={(e) => handleInputChange(e, 'start')}
                placeholder="시작일"
                maxLength={10}
                aria-label="기간 시작일 입력"
                aria-invalid={!!showError}
              />
              <Button className="date-icon-btn" onPress={() => openModal('start')} aria-label="시작일 달력 열기">
                <CalendarIcon size={18} />
              </Button>
            </div>
            <span className="date-range-separator">~</span>
            <div className={`date-input-box ${showError ? 'is-error' : ''} ${isOpen && activeField === 'end' ? 'is-open' : ''}`}>
              <input
                type="text"
                className="date-real-input"
                value={endInputStr}
                onChange={(e) => handleInputChange(e, 'end')}
                placeholder="만료일"
                maxLength={10}
                aria-label="기간 만료일 입력"
                aria-invalid={!!showError}
              />
              <Button className="date-icon-btn" onPress={() => openModal('end')} aria-label="만료일 달력 열기">
                <CalendarIcon size={18} />
              </Button>
            </div>
          </>
        )}
      </div>

      {showError && (
        <div className="date-error-hint">
          <span>{errorMessage}</span>
        </div>
      )}

      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <div style={{ display: 'none' }}></div>
        <Modal className="date-modal-overlay" isDismissable>
          <Dialog className="date-modal-content">
            {({ close }) => (
              <>
                {/* ⭐ [수정 2] 닫기 버튼 레이아웃 변경 (justify-between 유지하되 순서 보장) ⭐ */}
                <div className="date-header">
                  <Heading slot="title" className="date-title">
                    {mode === 'single' ? '날짜 선택' : (activeField === 'start' ? '시작일 선택' : '만료일 선택')}
                  </Heading>
                  {/* CSS에서 margin-left: auto로 우측 끝 정렬 처리됨 */}
                </div>

                <div className="date-calendar-nav">
                  <div className="date-nav-group">
                    <button onClick={handlePrevMonth} className="date-nav-btn"><ChevronLeft size={24} /></button>
                    <span className="date-current-month">{year}. {String(month + 1).padStart(2, '0')}</span>
                    <button onClick={handleNextMonth} className="date-nav-btn"><ChevronRight size={24} /></button>
                  </div>
                  <button onClick={handleGoToday} className="date-today-btn">오늘</button>
                </div>

                <div className="date-calendar-grid">
                  <div className="date-weekdays">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
                  </div>
                  <div className="date-days">
                    {days.map((date, index) => {
                      if (!date) return <div key={`empty-${index}`} />;
                      let isSelected = false;
                      if (mode === 'single') isSelected = isSameDay(singleDate, date);
                      else if (activeField === 'start') isSelected = isSameDay(startDate, date);
                      else if (activeField === 'end') isSelected = isSameDay(endDate, date);

                      const isToday = isSameDay(today, date);
                      let isDisabled = false;
                      if (date < today) isDisabled = true;
                      if (mode === 'range' && activeField === 'end' && startDate && date < startDate) isDisabled = true;
                      const dayOfWeek = date.getDay();

                      return (
                        <div key={index} className="date-day-cell">
                          <button
                            onClick={() => !isDisabled && handleSelectDate(date)}
                            disabled={isDisabled}
                            className={`date-day-btn ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'disabled' : ''} ${dayOfWeek === 0 ? 'sunday' : ''} ${dayOfWeek === 6 ? 'saturday' : ''}`}
                          >
                            {date.getDate()}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button onPress={close} className="date-close-btn" aria-label="닫기">
                  <XIcon size={24} />
                </Button>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  );
}