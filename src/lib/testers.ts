import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import type { TesterApplication, TesterApplicationForm, TesterApplicationStatus } from '../types/tester'

const testerApplicationsRef = collection(db, 'tester_applications')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const toTesterApplication = (id: string, data: Record<string, unknown>): TesterApplication => ({
  id,
  appKey: String(data.appKey ?? 'mathmagic'),
  name: String(data.name ?? ''),
  email: String(data.email ?? ''),
  device: String(data.device ?? ''),
  memo: String(data.memo ?? ''),
  canTest14Days: Boolean(data.canTest14Days),
  status: (data.status as TesterApplicationStatus) ?? 'requested',
  createdAt: data.createdAt as TesterApplication['createdAt'],
  updatedAt: data.updatedAt as TesterApplication['updatedAt'],
})

const normalizeTesterForm = (form: TesterApplicationForm) => {
  const email = form.email.trim().toLowerCase()

  if (!form.name.trim()) throw new Error('Name is required.')
  if (!emailPattern.test(email)) throw new Error('A valid Google account email is required.')
  if (!form.canTest14Days) throw new Error('The 14-day testing agreement is required.')

  return {
    appKey: 'mathmagic',
    name: form.name.trim(),
    email,
    device: form.device.trim() || 'android',
    memo: form.memo.trim(),
    canTest14Days: true,
    status: 'requested' as TesterApplicationStatus,
    updatedAt: serverTimestamp(),
  }
}

export async function createTesterApplication(form: TesterApplicationForm) {
  await addDoc(testerApplicationsRef, {
    ...normalizeTesterForm(form),
    createdAt: serverTimestamp(),
  })
}

export async function fetchTesterApplications() {
  const snapshot = await getDocs(query(testerApplicationsRef, orderBy('createdAt', 'desc')))
  return snapshot.docs.map((item) => toTesterApplication(item.id, item.data()))
}

export async function updateTesterApplicationStatus(id: string, status: TesterApplicationStatus) {
  await updateDoc(doc(db, 'tester_applications', id), {
    status,
    updatedAt: serverTimestamp(),
  })
}
