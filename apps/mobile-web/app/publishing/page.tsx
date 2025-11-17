import Link from "next/link";
import s from "./publishing.module.scss";

export default function PublishingIndex() {
  return (
    <>
      <header className={s["pub-list-page-head"]}>
        <div className={s["pub-list-container"]}>
          <h1 className={s["pub-list-page-title"]}>
            키움예스저축은행 여수신통합APP 퍼블리싱
          </h1>
          <div className={s["pub-list-page-actions"]}>
            <Link
              href="/app_list"
              className={`${s["page-tab"]} ${s["active"]}`}
            >
              APP
            </Link>
            <Link href="/mobile_list" className={s["page-tab"]}>
              MOBILE
            </Link>
            <Link href="/pc_list" className={s["page-tab"]}>
              PC
            </Link>
          </div>
        </div>
      </header>

      <main className={s["pub-list-container"]} id="main">
        <ul className={s["btn-guide-box"]}>
          <li>
            <a href="#none">가이드</a>
          </li>
          <li>
            <a href="#none">콤포넌트</a>
          </li>
        </ul>

        <div
          className={s["table-wrap"]}
          role="region"
          aria-label="퍼블리싱 테이블"
          tabIndex={0}
        >
          <table className={s["pub-list-table"]}>
            <caption>
              위쳌 퍼블리싱 산출물 목록 (진행 현황, 담당, 경로)
            </caption>
            <colgroup>
              <col style={{ width: "100px" }} />
              <col style={{ width: "200px" }} />
              <col style={{ width: "200px" }} />
              <col style={{ width: "250px" }} />
              <col style={{ width: "250px" }} />
              <col style={{ width: "170px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "auto" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">1Depth</th>
                <th scope="col">2Depth</th>
                <th scope="col">3Depth</th>
                <th scope="col">4Depth</th>
                <th scope="col">화면명</th>
                <th scope="col">화면ID</th>
                <th scope="col">날짜</th>
                <th scope="col">상태</th>
                <th scope="col">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={s["depth-title"]} colSpan={9}>
                  공통
                </th>
              </tr>
              <tr>
                <td>메인</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="../" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ing"]}`}>진행중</td>
                <td></td>
              </tr>
              <tr>
                <td>로그인</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>-</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td>최근</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>-</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td>자주</td>
                <td>자주쓰는메뉴 등록</td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>자주쓰는메뉴 삭제</td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>자주쓰는메뉴 순서변경</td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>

              {/* MY */}
              <tr>
                <th className={s["depth-title"]} colSpan={9}>
                  MY
                </th>
              </tr>
              <tr>
                <td>MY</td>
                <td>내정보</td>
                <td>사용자 정보 수정 상세</td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ing"]}`}>진행중</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>멤버십 탈퇴 안내 상세</td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>-</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>멤버십 탈퇴 사유 입력 영역</td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>-</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>증명서</td>
                <td>신청</td>
                <td></td>
                <td>(T)예금잔액증명서</td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>(T)부채잔액증명서</td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>(T)금융거래 확인서</td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ok"]}`}>완료</td>
                <td></td>
              </tr>

              {/* 상품 */}
              <tr>
                <th className={s["depth-title"]} colSpan={9}>
                  상품
                </th>
              </tr>
              <tr>
                <td>상품</td>
                <td>전체상품</td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>2025.11.10</td>
                <td className={`${s["align-c"]} ${s["ing"]}`}>진행중</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>금융계산기</td>
                <td></td>
                <td></td>
                <td></td>
                <td className={s["align-c"]}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    APP-MA-2AA-3xx-V001
                  </a>
                </td>
                <td className={s["align-c"]}>-</td>
                <td className={`${s["align-c"]} ${s["ing"]}`}>-</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
