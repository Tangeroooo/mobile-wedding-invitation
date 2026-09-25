import { useState } from 'react'

// Unmodified PNG exported through Naver Map's official Download button.
// Static preview; tapping opens the interactive map. Attribution stays visible.
const imageUrl = `${import.meta.env.BASE_URL}images/draft/venue-naver-map.png`
const mapUrl = 'https://map.naver.com/p/search/%EB%8D%94%EB%A7%81%ED%81%AC%ED%98%B8%ED%85%94'

export default function DraftMap() {
  const [failed, setFailed] = useState(false)
  return <div className="draft-location-map" role="region" aria-label="더링크호텔 네이버지도 미리보기">
    <a className="draft-naver-map" href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label="더링크호텔 네이버지도 크게 보기">
      <span className="draft-naver-canvas">
      <img src={imageUrl} width="1377" height="850" loading="lazy" decoding="async" alt="더링크호텔 주변 네이버지도" onError={() => setFailed(true)} />
      {/* The source hotel icon is centered at (883, 425) in the 1377 × 850 image.
          Anchor the heart itself there; the label must not affect its position. */}
      {!failed && <span className="draft-naver-marker"><strong>더링크호텔</strong><span className="draft-naver-heart" aria-hidden="true">♥</span></span>}
      </span>
    </a>
    {failed && <p className="draft-map-error" role="status">지도를 불러오지 못했어요. 아래 지도 버튼을 이용해주세요.</p>}
    <a className="draft-naver-credit" href={mapUrl} target="_blank" rel="noopener noreferrer"><span className="draft-map-source"><img src="https://ssl.pstatic.net/static/maps/assets/icons/apple-icon-180x180.png" width="20" height="20" alt="" /><strong>네이버지도</strong><span>© NAVER</span></span><span>지도 크게 보기 ↗</span></a>
  </div>
}
