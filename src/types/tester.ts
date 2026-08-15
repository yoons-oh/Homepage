import type { Timestamp } from 'firebase/firestore'

export type TesterApplicationStatus = 'requested' | 'registered' | 'invited'

export type TesterApplication = {
  id: string
  appKey: string
  name: string
  email: string
  device: string
  memo: string
  canTest14Days: boolean
  status: TesterApplicationStatus
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type TesterApplicationForm = {
  name: string
  email: string
  device: string
  memo: string
  canTest14Days: boolean
}

export const emptyTesterApplicationForm: TesterApplicationForm = {
  name: '',
  email: '',
  device: 'android',
  memo: '',
  canTest14Days: false,
}
