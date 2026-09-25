export const copyDefaults = {
  introCaption: 'TOGETHER, A NEW BEGINNING', coverCaption: 'OUR NEXT CHAPTER',
  tickerLeft: 'WITH YOU, ALWAYS', tickerRight: 'A NEW CHAPTER',
  greetingLabel: 'THE INVITATION', greetingTitle: '우리의', greetingAccent: '가장 좋은 날.',
  greetingMessage: '서로의 일상에 가장 다정한 사람이 되어\n이제, 함께하는 내일을 시작합니다.',
  greetingInvite: '소중한 여러분을\n우리의 시작에 초대합니다.', groom: '신랑 이름', bride: '신부 이름',
  dateLabel: 'SAVE THE DATE', dateTitle: '함께할', dateAccent: '그날의 약속.',
  dateYear: '2026 · OUR DAY', dateStamp: '11. 07. SAT', dateText: '2026년 11월 7일 토요일\n오후 7시 20분',
  galleryLabel: 'MOMENTS OF US', galleryTitle: '우리라는', galleryAccent: '장면들.',
  galleryMessage: '함께 웃던 순간을 모아.', galleryFirst: 'IN THE GARDEN', gallerySecond: 'SIDE BY SIDE',
  galleryNote: '갤러리 구성은 사진을 추가하며 다듬을 예정입니다.',
  locationLabel: 'MEET US HERE', locationTitle: '오시는 길',
  venueName: '더링크호텔', venueHall: '3층 베일리홀', venueAddress: '서울특별시 구로구 경인로 610',
  transport: '', mapHelp: '지도가 보이지 않으면 위 버튼으로 열어주세요.',
  rsvpLabel: 'WITH LOVE', rsvpTitle: '당신과 함께라서', rsvpAccent: '더 특별한 하루.',
  rsvpMessage: '참석 여부와 마음 전하실 곳은\n정보가 정해지면 연결할 예정입니다.',
  footerLabel: 'BLUE MEETS PINK.', footerTitle: 'Better, together.', footerNote: 'OUR WEDDING INVITATION',
}
export type DraftCopy = typeof copyDefaults
export type CopyKey = keyof DraftCopy
export const copyGroups: Record<string, { title: string; fields: [CopyKey, string][] }> = {
  cover: { title:'커버', fields:[['introCaption','인트로 하단 문구'],['coverCaption','메인 하단 문구']] },
  greeting: { title:'인사말', fields:[['tickerLeft','띠 문구 왼쪽'],['tickerRight','띠 문구 오른쪽'],['greetingLabel','영문 소제목'],['greetingTitle','제목'],['greetingAccent','강조 제목'],['greetingMessage','인사말'],['greetingInvite','초대 문구'],['groom','신랑 이름'],['bride','신부 이름']] },
  date: { title:'예식 일시', fields:[['dateLabel','영문 소제목'],['dateTitle','제목'],['dateAccent','강조 제목'],['dateYear','연도 문구'],['dateStamp','날짜 큰 글씨'],['dateText','날짜와 시간']] },
  gallery: { title:'갤러리', fields:[['galleryLabel','영문 소제목'],['galleryTitle','제목'],['galleryAccent','강조 제목'],['galleryMessage','소개 문구'],['galleryFirst','첫 사진 설명'],['gallerySecond','둘째 사진 설명'],['galleryNote','갤러리 안내']] },
  location: { title:'오시는 길', fields:[['locationLabel','영문 소제목'],['locationTitle','제목'],['venueName','예식장 이름'],['venueHall','층과 홀'],['venueAddress','주소'],['transport','교통 및 주차 안내'],['mapHelp','지도 안내']] },
  rsvp: { title:'참석 안내', fields:[['rsvpLabel','영문 소제목'],['rsvpTitle','제목'],['rsvpAccent','강조 제목'],['rsvpMessage','안내 문구']] },
  footer: { title:'마무리', fields:[['footerLabel','윗 문구'],['footerTitle','중앙 문구'],['footerNote','아랫 문구']] },
}
