import type { Timestamp } from 'firebase/firestore'

export type Restaurant = {
  id: string
  name: string
  category: string
  area: string
  address: string
  naverMapUrl: string
  imageUrls: string[]
  recommendedMenu: string
  memo: string
  tags: string[]
  isVisible: boolean
  sortOrder: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type RestaurantForm = Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'tags' | 'imageUrls'> & {
  tags: string
  imageUrl1: string
  imageUrl2: string
  imageUrl3: string
}

export const emptyRestaurantForm: RestaurantForm = {
  name: '',
  category: '',
  area: '',
  address: '',
  naverMapUrl: '',
  imageUrl1: '',
  imageUrl2: '',
  imageUrl3: '',
  recommendedMenu: '',
  memo: '',
  tags: '',
  isVisible: true,
  sortOrder: 0,
}
