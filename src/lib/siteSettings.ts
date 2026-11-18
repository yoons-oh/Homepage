import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { IS_MOCK } from './mock'

const careerSettingsRef = doc(db, 'site_settings', 'career')

export type CareerSettings = {
  isOpen: boolean
}

export async function fetchCareerSettings(): Promise<CareerSettings> {
  if (IS_MOCK) return { isOpen: true }
  const snapshot = await getDoc(careerSettingsRef)
  if (!snapshot.exists()) return { isOpen: false }

  return {
    isOpen: Boolean(snapshot.data().isOpen),
  }
}

export async function updateCareerSettings(isOpen: boolean) {
  await setDoc(
    careerSettingsRef,
    {
      isOpen,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
