import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Restaurant, RestaurantForm } from '../types/restaurant'

const restaurantsRef = collection(db, 'restaurants')

const normalizeTags = (tags: string) =>
  tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

const normalizeImageUrls = (form: RestaurantForm) =>
  [form.imageUrl1, form.imageUrl2, form.imageUrl3].map((url) => url.trim()).filter(Boolean)

const toRestaurant = (id: string, data: Record<string, unknown>): Restaurant => ({
  id,
  name: String(data.name ?? ''),
  category: String(data.category ?? ''),
  area: String(data.area ?? ''),
  address: String(data.address ?? ''),
  naverMapUrl: String(data.naverMapUrl ?? ''),
  imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls.map(String).filter(Boolean) : [],
  recommendedMenu: String(data.recommendedMenu ?? ''),
  memo: String(data.memo ?? ''),
  tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  isVisible: Boolean(data.isVisible),
  sortOrder: Number(data.sortOrder ?? 0),
  createdAt: data.createdAt as Restaurant['createdAt'],
  updatedAt: data.updatedAt as Restaurant['updatedAt'],
})

const toPayload = (form: RestaurantForm) => ({
  name: form.name.trim(),
  category: form.category.trim(),
  area: form.area.trim(),
  address: form.address.trim(),
  naverMapUrl: form.naverMapUrl.trim(),
  imageUrls: normalizeImageUrls(form),
  recommendedMenu: form.recommendedMenu.trim(),
  memo: form.memo.trim(),
  tags: normalizeTags(form.tags),
  isVisible: form.isVisible,
  sortOrder: Number(form.sortOrder) || 0,
  updatedAt: serverTimestamp(),
})

export async function fetchPublicRestaurants() {
  const snapshot = await getDocs(query(restaurantsRef, where('isVisible', '==', true)))
  return snapshot.docs
    .map((item) => toRestaurant(item.id, item.data()))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
}

export async function fetchAdminRestaurants() {
  const snapshot = await getDocs(query(restaurantsRef, orderBy('sortOrder', 'asc')))
  return snapshot.docs.map((item) => toRestaurant(item.id, item.data()))
}

export async function createRestaurant(form: RestaurantForm) {
  await addDoc(restaurantsRef, {
    ...toPayload(form),
    createdAt: serverTimestamp(),
  })
}

export async function updateRestaurant(id: string, form: RestaurantForm) {
  await updateDoc(doc(db, 'restaurants', id), toPayload(form))
}

export async function removeRestaurant(id: string) {
  await deleteDoc(doc(db, 'restaurants', id))
}
