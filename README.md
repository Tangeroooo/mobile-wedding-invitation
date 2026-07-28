# Mobile Wedding Invitation

결혼식 전에는 `Coming Soon`, 준비가 끝난 뒤에는 완성된 모바일 청첩장,
결혼식 이후에는 일러스트 보존판을 같은 주소에서 제공하는 프로젝트입니다.

## 고정 주소

<https://tangeroooo.github.io/mobile-wedding-invitation/>

저장소 이름 또는 GitHub 사용자명을 변경하면 주소와 QR 코드가 달라질 수 있습니다.

## Design Lab

<https://tangeroooo.github.io/mobile-wedding-invitation/design-lab/>

Warm 5종과 Modern 5종의 전체 청첩장 구성을 비교하고 최대 3개를 후보로
선택할 수 있습니다. 각 시안은 초대 문구, 달력, 사진첩, 오시는 길, 연락처와
계좌 안내, 참석 여부 전달 영역을 포함합니다. 선택 결과는 현재 브라우저에만
저장됩니다.

## 실행

```bash
npm install
npm run dev
```

## 배포

`main` 브랜치에 변경 사항을 push하면 GitHub Actions가 정적 파일을 빌드하고
GitHub Pages에 자동 배포합니다. 최초 한 번은 저장소의
`Settings → Pages → Build and deployment → Source`를 `GitHub Actions`로
설정해야 합니다.

## QR 코드

```bash
npm run qr
```

인쇄용 PNG와 SVG 파일은 `public/qr`에 생성됩니다. 인쇄물에 넣기 전,
실제 GitHub Pages 배포가 완료된 뒤 휴대전화로 한 번 스캔해 확인합니다.

## 공개 전 확인

- 현재 페이지는 이름, 날짜, 장소를 노출하지 않는 `Coming Soon` 상태입니다.
- 검색 노출 방지를 위해 `noindex`가 설정되어 있습니다.
- 완성본을 공개할 때 `index.html`의 `robots` 설정을 변경합니다.
- 웹용 사진만 저장소에 넣고 원본 사진은 비공개 공간에 따로 보관합니다.
