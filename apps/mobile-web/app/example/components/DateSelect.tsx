'use client';
import { useState } from 'react';
import DateSelector from '../../../../../packages/ui/mobile/components/common/DateSelector';

export default function Page() {
  const [error, setError] = useState('');
  const [errorRange, setErrorRange] = useState('');

  const handleSubmit = () => {
    setError('대출 기간을 정확히 선택해주세요.');
    setErrorRange('대출 기간을 정확히 선택해주세요.');
  };

  return (
    <>
      <div className="form-item">
        <label className="label">대출 희망일</label>        
        <DateSelector 
          mode="single"
          errorMessage={error}
        />
      </div>
      <div className="form-item">
        
        <label className="label">
          계약 기간 설정
        </label>

        <DateSelector 
          mode="range"
        errorMessage={errorRange} // 에러 메시지 전달
      />

      </div>
      
      <button onClick={handleSubmit} className="btn btn-pri">
        확인
      </button>
    </>
  );
}