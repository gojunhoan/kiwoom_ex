import React from 'react';

// Title
type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;
interface TitleProps {
  level: TitleLevel;
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

export const Title = ({ level, children, as, className = '' }: TitleProps) => {
  const Tag = as || (level === 7 ? 'p' : (`h${level}` as React.ElementType));
  // [Global] ui-title 클래스와 level-x 클래스 조합
  return <Tag className={`ui-tit${level} ${className}`}>{children}</Tag>;
};

// TextList
type ListType = 'dot' | 'dash' | 'remark';
interface TextListProps {
  type: ListType;
  items: React.ReactNode[];
  as?: React.ElementType;
  itemAs?: React.ElementType;
  className?: string;
}

export const TextList = ({ 
  type, 
  items, 
  as: Container = 'ul', 
  itemAs: Item = 'li', 
  className = '' 
}: TextListProps) => {
  return (
    // [Global] ui-list 클래스 사용
    <Container className={`ui-list ${type} ${className}`}>
      {items.map((item, idx) => (
        <Item key={idx} className="list-item">{item}</Item>
      ))}
    </Container>
  );
};