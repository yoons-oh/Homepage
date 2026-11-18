import type { Restaurant } from '../types/restaurant'

/** true only for the standalone preview build (VITE_MOCK=1): no Firebase, hash routing */
export const IS_MOCK = import.meta.env.VITE_MOCK === '1'

export const mockRestaurants: Restaurant[] = [
  {
    id: 'mock-1',
    name: '샘플 칼국수집',
    category: '한식',
    area: '서울 성수',
    address: '서울 성동구 (예시 주소)',
    naverMapUrl: 'https://map.naver.com',
    imageUrls: [],
    recommendedMenu: '바지락 칼국수',
    memo: '목업용 예시 데이터입니다. 실제 사이트에서는 관리자 페이지에 등록한 맛집이 보여요.',
    tags: ['점심', '혼밥'],
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: 'mock-2',
    name: '샘플 스시 오마카세',
    category: '일식',
    area: '서울 한남',
    address: '서울 용산구 (예시 주소)',
    naverMapUrl: 'https://map.naver.com',
    imageUrls: [],
    recommendedMenu: '런치 코스',
    memo: '목업용 예시 데이터입니다.',
    tags: ['데이트', '예약 필수'],
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: 'mock-3',
    name: '샘플 브런치 카페',
    category: '카페',
    area: '경기 판교',
    address: '경기 성남시 (예시 주소)',
    naverMapUrl: 'https://map.naver.com',
    imageUrls: [],
    recommendedMenu: '프렌치 토스트',
    memo: '목업용 예시 데이터입니다.',
    tags: ['주말', '작업하기 좋음'],
    isVisible: true,
    sortOrder: 3,
  },
]
