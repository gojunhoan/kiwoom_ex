"use client";

import { useState } from "react";

interface SearchResult {
  id: number;
  name: string;
  address: string;
}

interface OptionItem {
  id: number;
  label: string;
}

interface SearchAccordionProps {
  searchResults: SearchResult[];
  areaOptions: OptionItem[];
  floorOptions: OptionItem[];
}

export default function SearchAccordion({ 
  searchResults, 
  areaOptions, 
  floorOptions 
}: SearchAccordionProps) {
  
  const [selectedApt, setSelectedApt] = useState<SearchResult | null>(null);
  const [selectedArea, setSelectedArea] = useState<OptionItem | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<OptionItem | null>(null);
  
  const [activeStep, setActiveStep] = useState<string>("apt");

  const getRenderList = <T extends { id: number }>(list: T[], selectedItem: T | null) => {
    return selectedItem ? [selectedItem] : list;
  };

  const handleSelectApt = (apt: SearchResult) => {
    if (selectedApt?.id === apt.id) return;
    
    setSelectedApt(apt);
    setSelectedArea(null);
    setSelectedFloor(null);
    setActiveStep("area");
  };

  const handleSelectArea = (area: OptionItem) => {
    if (selectedArea?.id === area.id) return;

    setSelectedArea(area);
    setSelectedFloor(null);
    setActiveStep("floor");
  };

  const handleSelectFloor = (floor: OptionItem) => {
    if (selectedFloor?.id === floor.id) return;
    
    setSelectedFloor(floor);
    if (selectedApt && selectedArea) {
      console.log("Completed:", selectedApt.name, selectedArea.label, floor.label);
    }
  };

  const toggleStep = (step: string) => {
    if (step === "area" && !selectedApt) return;
    if (step === "floor" && !selectedArea) return;
    
    setActiveStep(activeStep === step ? "" : step);
  };

  // 상태 체크 변수
  const isAptSelected = !!selectedApt;
  const isAreaSelected = !!selectedArea;
  const isFloorSelected = !!selectedFloor;

  const isAptActive = activeStep === "apt" || isAptSelected;
  const isAreaActive = activeStep === "area" || isAreaSelected;
  const isFloorActive = activeStep === "floor" || isFloorSelected;

  return (
    <div className="apt-search-accordion">
      
      {/* 1. 검색 결과 */}
      <div className={`accordion-item ${isAptActive ? "active" : ""} ${isAptSelected ? "has-selection" : ""}`}>
        <button 
          className="accordion-header" 
          onClick={() => toggleStep("apt")}
          type="button"
          aria-expanded={isAptActive}
        >
          <div className="header-text">
            <span className="title">검색 결과에서 선택하세요.</span>
          </div>
          <span className="icon-arrow"></span>
        </button>
        
        <div className="accordion-content">
          <ul className="select-list">
            {getRenderList(searchResults, selectedApt).map((apt) => {
               const isSelected = selectedApt?.id === apt.id;
               return (
                <li key={apt.id} className={isSelected ? "selected" : ""}>
                  <button 
                    type="button" 
                    onClick={() => handleSelectApt(apt)}
                    aria-pressed={isSelected}
                    title={isSelected ? "선택됨" : ""}
                  >
                    <strong className="apt-name">{apt.name}</strong>
                    <span className="apt-addr">{apt.address}</span>
                  </button>
                </li>
               );
            })}
          </ul>
        </div>
      </div>

      {/* 2. 면적 선택 */}
      {selectedApt && (
        <div className={`accordion-item ${isAreaActive ? "active" : ""} ${isAreaSelected ? "has-selection" : ""}`}>
          <button 
            className="accordion-header" 
            onClick={() => toggleStep("area")}
            type="button"
            aria-expanded={isAreaActive}
          >
            <div className="header-text">
               <span className="title">면적을 선택하세요.</span>
            </div>
            <span className="icon-arrow"></span>
          </button>
          
          <div className="accordion-content">
            <ul className="select-list">
              {getRenderList(areaOptions, selectedArea).map((area) => {
                const isSelected = selectedArea?.id === area.id;
                return (
                  <li key={area.id} className={isSelected ? "selected" : ""}>
                    <button
                      type="button"
                      onClick={() => handleSelectArea(area)}
                      aria-pressed={isSelected}
                      title={isSelected ? "선택됨" : ""}
                    >
                      {area.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* 3. 층수 선택 */}
      {selectedArea && (
        <div className={`accordion-item ${isFloorActive ? "active" : ""} ${isFloorSelected ? "has-selection" : ""}`}>
          <button 
            className="accordion-header" 
            onClick={() => toggleStep("floor")}
            type="button"
            aria-expanded={isFloorActive}
          >
            <div className="header-text">
               <span className="title">층수를 선택하세요.</span>
            </div>
            <span className="icon-arrow"></span>
          </button>
          
          <div className="accordion-content">
            <ul className="select-list">
              {getRenderList(floorOptions, selectedFloor).map((floor) => {
                const isSelected = selectedFloor?.id === floor.id;
                return (
                  <li key={floor.id} className={isSelected ? "selected" : ""}>
                    <button
                      type="button"
                      onClick={() => handleSelectFloor(floor)}
                      aria-pressed={isSelected}
                      title={isSelected ? "선택됨" : ""}
                    >
                      {floor.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}