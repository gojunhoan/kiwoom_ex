"use client";

import { useState } from "react";

// 데이터 타입 정의
interface Product {
  id: number;
  tag: string;
  name: string;
  rate: string;
  limit: string;
}

interface ProductSelectProps {
  productList: Product[];
}

export default function ProductSelect({ productList }: ProductSelectProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    console.log("Selected Product ID:", id);
  };

  return (
    <div className="product-select-wrap">
      <ul className="product-list">
        {productList.map((product) => {
          const isSelected = selectedId === product.id;
          
          return (
            <li key={product.id} className={isSelected ? "selected" : ""}>
              <button
                type="button"
                className="product-card"
                onClick={() => handleSelect(product.id)}
                aria-pressed={isSelected} 
                title={isSelected ? "선택됨" : ""}
              >
                <span className="badge">{product.tag}</span>
                
                <strong className="product-name">{product.name}</strong>
                <div className="product-info">
                  <span className="rate">{product.rate}</span>
                  <span className="divider"></span>
                  <span className="limit">{product.limit}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}