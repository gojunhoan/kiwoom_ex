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
  return <Tag className={`tit-h${level} ${className}`}>{children}</Tag>;
};

// TextList
type ListType = 'default' | 'dot' | 'dash' | 'remark';
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
    <Container className={`ui-list ${type} ${className}`}>
      {items.map((item, idx) => (
        <Item key={idx} className="list-item">{item}</Item>
      ))}
    </Container>
  );
};