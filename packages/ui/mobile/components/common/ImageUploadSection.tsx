'use client'; 

import ImageInput from './ImageInput';

export default function ImageUploadSection() {

  function handleBack(file: File): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ImageInput 
        label="신분증 뒷면 촬영" 
        onFileSelect={handleBack} 
      />
    </div>
  );
}