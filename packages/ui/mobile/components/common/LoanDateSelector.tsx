'use client';

import React, { useState, useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  Heading
} from 'react-aria-components';
import { ChevronLeft, ChevronRight, X as XIcon, Calendar as CalendarIcon } from 'lucide-react';
import styles from './LoanDateSelector.module.scss'; // SCSS 모듈 불러오기

interface Props {
  onChange?: (date: Date) => void;
}

export default function LoanDateSelector({ onChange }: Props) {
  // 1. 상태 및 로직 (기존과 동일)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  
  const handleGoToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
    if (onChange) onChange(date);
  };

  const isSameDay = (d1: Date | null, d2: Date) => {
    return d1?.toDateString() === d2.toDateString();
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>대출희망일</label>
      
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        {/* === 입력창 === */}
        <Button 
          className={`${styles.triggerButton} ${isOpen ? styles.isOpen : ''}`}
        >
          <span className={`${styles.dateText} ${selectedDate ? styles.hasValue : ''}`}>
            {selectedDate ? formatDate(selectedDate) : 'YYYY.MM.DD'}
          </span>
          <CalendarIcon className={styles.icon} size={20} />
        </Button>

        {/* === 모달 === */}
        <Modal 
          className={styles.modalOverlay}
          isDismissable
        >
          <Dialog className={styles.modalContent}>
            {({ close }) => (
              <>
                {/* 헤더 */}
                <div className={styles.header}>
                  <Heading slot="title" className={styles.title}>
                    대출희망일
                  </Heading>
                  <Button onPress={close} className={styles.closeBtn}>
                    <XIcon size={24} />
                  </Button>
                </div>

                {/* 네비게이션 */}
                <div className={styles.calendarNav}>
                  <div className={styles.navGroup}>
                    <button onClick={handlePrevMonth} className={styles.navBtn}>
                      <ChevronLeft size={24} />
                    </button>
                    <span className={styles.currentMonth}>
                      {year}. {String(month + 1).padStart(2, '0')}
                    </span>
                    <button onClick={handleNextMonth} className={styles.navBtn}>
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  
                  <button onClick={handleGoToday} className={styles.todayBtn}>
                    오늘
                  </button>
                </div>

                {/* 달력 그리드 */}
                <div className={styles.calendarGrid}>
                  {/* 요일 */}
                  <div className={styles.weekdays}>
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>

                  {/* 날짜 */}
                  <div className={styles.days}>
                    {days.map((date, index) => {
                      if (!date) return <div key={`empty-${index}`} />;

                      const isSelected = isSameDay(selectedDate, date);
                      const isToday = isSameDay(today, date);
                      const isPast = date < today;

                      return (
                        <div key={index} className={styles.dayCell}>
                          <button
                            onClick={() => handleSelectDate(date)}
                            // disabled={isPast} // 필요시 주석 해제
                            className={`
                              ${styles.dayBtn}
                              ${isSelected ? styles.selected : ''}
                              ${isToday ? styles.today : ''}
                              ${isPast ? styles.disabled : ''}
                            `}
                          >
                            {date.getDate()}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  );
}