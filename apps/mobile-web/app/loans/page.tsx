import React from "react";

import KyMoLayout from "../../../../packages/ui/mobile/components/Layout/KyMoLayout";
import TextField from "../../../../packages/ui/mobile/components/common/TextField";
import { Radio, RadioGroup } from "../../../../packages/ui/mobile/components/common/Radio";
import Button from "../../../../packages/ui/mobile/components/common/Button";
import SelectBox, { type OptionType } from "../../../../packages/ui/mobile/components/common/SelectBox";

export default function LoanPage() {
  
  // 명의자 선택
  const OWNER_OPTIONS1: OptionType[] = [
    { value: "본인", label: "본인" },
    { value: "배우자", label: "배우자" },
    { value: "공동명의", label: "공동명의(본인+배우자)" },
    { value: "기타", label: "기타" },
  ];

  // 명의자 선택1
  const OWNER_OPTIONS: OptionType[] = [
    { value: "본인", label: "본인" },
    { value: "배우자", label: "배우자" },
    { value: "공동명의(본인+배우자)", label: "공동명의(본인+배우자)" },
    { value: "기타", label: "기타" },
  ];

  return (
    <KyMoLayout 
      title="가계주택담보대출 신청"
      showHome={false}
      showCancel={true}
      // showMenu={false} 기본값 false 
    >
      <div className="ky-mo-contents">
        <div className="title-area">
          <nav className="step-wrap" aria-label="진행 단계">
            <h2 className="step-tit">한도조회</h2>
            <ol className="step-num">
              <li className="selected" aria-current="step">
                <span className="ky-hide">현재 단계: </span>
                1
                <span className="ky-hide"> / 총 4단계 중 1단계</span>
              </li>
              <li>
                <span className="ky-hide">다음 단계: </span>2
              </li>
              <li>3</li>
              <li>4</li>
            </ol>
          </nav>
          <div className="txt-body">고객님의 정보를 알려주세요</div>
        </div>

        <div className="form-area">
          <div className="form-item">
            <div className="label">직업</div>
            <RadioGroup variantClassName="check-type--box" layoutClassName="split-2" roleGroupLabel="직업 선택">
              <Radio name="job" value="직장인" label="직장인"/>
              <Radio name="job" value="개인사업자" label="개인사업자" />
            </RadioGroup>
          </div>
          <div className="form-item">
            <div className="label">자금사용 용도</div>
            
            <SelectBox
              title="명의자" 
              options={OWNER_OPTIONS1} 
            />
          </div>
          <h3 className="tit-h6">주택정보</h3>
          <div className="form-item">
            <div className="label">주택유형</div>
            <RadioGroup variantClassName="check-type--box" layoutClassName="split-2" roleGroupLabel="주택유형 선택">
              <Radio name="house" value="아파트(주상복합 포함)" label="아파트(주상복합 포함)"/>
              <Radio name="house" value="빌라(연립주택 포함)" label="빌라(연립주택 포함)" />
            </RadioGroup>
          </div>
          <div className="form-item">
            <TextField
              label="주소"
              placeholder="검색 후 자동입력"
              searchable
              wrapperClassName="address"
              id="addr"
              readOnly
            />
            <TextField
              placeholder="동, 호수입력"
              title="상세주소 입력"
              hint=""
              id="name"
            />
          </div>
          <div className="form-item">
            <TextField
              label="주택가격"
              value="70000"
              placeholder="주택가격 출력"
              inputMode="numeric"
              unitText="만원"
              unitLayout="two"
              id="amountHouse"
              error=""
              readOnly
            />
          </div>
          <div className="form-item">
            <div className="label">담보대출 보유 여부</div>
            <RadioGroup variantClassName="check-type--box" layoutClassName="split-2" roleGroupLabel="담보대출 보유 여부 선택">
              <Radio name="rdoSelect" value="네, 있어요" label="네, 있어요"/>
              <Radio name="rdoSelect" value="아니오, 없어요" label="아니오, 없어요" />
            </RadioGroup>
          </div>
          <div className="form-item">              
            <div className="form-item">
              <TextField
                label="담보대출 잔액"
                placeholder="담보대출 잔액 입력"
                inputMode="numeric"
                unitText="만원"
                unitLayout="two"
                id="amountHouse1"
                error=""
              />
            </div>
          </div>
          <div className="form-item">
            <div className="label">명의자</div>
            <SelectBox
              title="선택" 
              options={OWNER_OPTIONS} 
            />
          </div>
          <div className="form-item">
            <div className="label">거주 여부</div>
            <RadioGroup variantClassName="check-type--box" layoutClassName="split-2" roleGroupLabel="거주 여부 선택">
              <Radio name="rdoSelect1" value="거주하고 있어요" label="거주하고 있어요"/>
              <Radio name="rdoSelect1" value="세입자가 있어요" label="세입자가 있어요" />
            </RadioGroup>
          </div>
          <div className="form-item">     
            <TextField
              label="세입자 보증금"
              placeholder="세입자 보증금 입력"
              inputMode="numeric"
              unitText="만원"
              unitLayout="two"
              id="amountHouse1"
              error=""
            />
          </div>

          <h3 className="tit-h6">연력처</h3>
          <div className="form-item">     
            <TextField
              label="휴대폰번호"
              placeholder="휴대폰번호 입력"
              inputMode="numeric"
              id="phone"
              error=""
            />
          </div>
          <div className="form-item">     
            <TextField
              label="이메일"
              placeholder="이메일 주소 입력"
              id="email"
              error=""
            />
          </div>
        </div>
      </div>
      <div className="bottom-area">
        <div className="btn-group">
          <Button variant="pri" disabledClassOnly>다음</Button>
        </div>
      </div>
    </KyMoLayout>
  );
}