import type { Timestamp } from 'firebase/firestore'

export type Restaurant = {
  id: string
  name: string
  category: string
  area: string
  address: string
  naverMapUrl: string
  recommendedMenu: string
  memo: string
  tags: string[]
  isVisible: boolean
  sortOrder: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type RestaurantForm = Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'tags'> & {
  tags: string
}

export const emptyRestaurantForm: RestaurantForm = {
  name: '',
  category: '',
  area: '',
  address: '',
  naverMapUrl: '',
  recommendedMenu: '',
  memo: '',
  tags: '',
  isVisible: true,
  sortOrder: 0,
}
