import { test, expect } from '@playwright/test'
import { calendarBrowser } from '../src/calendarBrowser'

test('calendar browser detection only intercepts Kakao and chooses the right instructions', () => {
  expect(calendarBrowser('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) KAKAOTALK/26.0')).toEqual({kakao:true,browserName:'Safari'})
  expect(calendarBrowser('Mozilla/5.0 (Linux; Android 15) KAKAOTALK 26.0')).toEqual({kakao:true,browserName:'Chrome'})
  expect(calendarBrowser('Mozilla/5.0 (Macintosh) KAKAOTALK','MacIntel',5)).toEqual({kakao:true,browserName:'Safari'})
  expect(calendarBrowser('Mozilla/5.0 (iPhone) Version/18.0 Mobile Safari/604.1').kakao).toBe(false)
  expect(calendarBrowser('Mozilla/5.0 (Linux; Android 15) Chrome/130.0').kakao).toBe(false)
})

for (const path of ['./','invitation-a/','invitation-b/']) {
  test(`Kakao calendar guidance intercepts the ICS link on ${path}`, async ({page}) => {
    await page.addInitScript(() => Object.defineProperty(navigator,'userAgent',{value:'Mozilla/5.0 (iPhone) KAKAOTALK/26.0'}))
    await page.goto(path)
    await page.locator('.draft-poster-body').waitFor({state:'visible'})
    const trigger = page.getByRole('link',{name:'결혼식 일정 캘린더에 추가'})
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading',{name:'Safari에서 일정을 추가해주세요'})).toBeVisible()
    await expect(page.getByLabel('복사할 청첩장 주소')).toHaveValue(page.url())
    await page.getByRole('button',{name:'캘린더 안내 닫기'}).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await trigger.click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
}

test('gallery end buttons match swipe boundaries without wrapping', async ({page}) => {
  await page.goto('draft/')
  await page.getByRole('button',{name:'1번 사진 보기',exact:true}).click()
  await expect(page.getByRole('button',{name:'이전 사진',exact:true})).toHaveCount(0)
  await expect(page.getByRole('button',{name:'다음 사진',exact:true})).toBeVisible()
  await page.getByRole('dialog',{name:'갤러리 사진 보기'}).press('ArrowLeft')
  await expect(page.locator('.draft-lightbox-slide[aria-hidden="false"] img')).toHaveAttribute('alt','1번째 웨딩 사진')
  await page.getByRole('button',{name:'사진 보기 닫기'}).click()
  await page.getByRole('button',{name:'24번 사진 보기',exact:true}).click()
  await page.getByRole('button',{name:'다음 사진',exact:true}).click()
  await expect(page.locator('.draft-lightbox-slide[aria-hidden="false"] img')).toHaveAttribute('alt','25번째 웨딩 사진')
  await expect(page.getByRole('button',{name:'다음 사진',exact:true})).toHaveCount(0)
  await page.getByRole('dialog',{name:'갤러리 사진 보기'}).press('ArrowRight')
  await expect(page.locator('.draft-lightbox-slide[aria-hidden="false"] img')).toHaveAttribute('alt','25번째 웨딩 사진')
  await page.getByRole('button',{name:'이전 사진',exact:true}).click()
  await expect(page.getByRole('button',{name:'다음 사진',exact:true})).toBeVisible()
})
