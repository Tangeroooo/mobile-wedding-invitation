# 공유 서비스 연결

청첩장 링크 복사 및 기본 공유창은 별도 키 없이 작동합니다. 기본 공유창에서는 방문자가 설치한 앱(카카오톡 등)을 직접 선택합니다. 브라우저가 공유/클립보드를 지원하지 않으면 수동 복사 주소를 제공합니다.

## 카카오톡 전용 공유

1. https://developers.kakao.com 에서 본인의 앱을 등록합니다.
2. 앱 > 플랫폼 키 > JavaScript 키의 JavaScript SDK 도메인에 `https://tangeroooo.github.io`를 등록합니다.
3. 제품 링크 관리 > 웹 도메인에도 `https://tangeroooo.github.io`를 등록합니다.
4. GitHub 저장소 Settings > Secrets and variables > Actions > Variables에 `VITE_KAKAO_JS_KEY`로 JavaScript 키를 등록하고 다시 배포합니다.
5. 로컬 확인에는 `.env.local`에 `VITE_KAKAO_JS_KEY=공개_JavaScript_키`를 설정하고 로컬 도메인도 등록합니다.

JavaScript 키는 브라우저에 공개되는 키입니다. Admin 키, REST API 키, Client Secret을 넣지 마세요. 키가 없을 때는 일반 공유 버튼, 연결 후에는 카카오톡 전용 버튼이 표시됩니다. 카카오 로그인은 필요하지 않습니다. 세 버전 각각의 URL·이름·메인 사진 공유 이미지를 사용합니다. 실제 전송은 방문자가 공유 대상과 전송을 결정합니다.

공식 문서: https://developers.kakao.com/docs/ko/kakaotalk-share/js-link

## 조작 가능한 네이버지도 (연결 대기)

현재 정적 지도는 유지했습니다. 네이버 Cloud Maps의 Dynamic Map 사용 설정 및 공개 Client ID(`ncpKeyId`)가 필요합니다. 웹 서비스 URL에 `https://tangeroooo.github.io`를 등록합니다. Client Secret은 필요하지 않습니다. 발급 시 약관과 현재 요금·무료 한도는 계정 소유자가 확인해야 합니다.

키 연결 후 별도 흰색 하단 띠 없이 SDK 기본 지도 및 출처 표시, 하트 위치 마커와 더링크호텔 라벨을 유지하는 방식으로 교체할 예정입니다.

공식 문서: https://navermaps.github.io/maps.js.en/docs/tutorial-1-Getting-Client-ID.html
