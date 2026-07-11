import { FirebaseError } from 'firebase/app'
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore'
import { ArrowUpRight, BarChart3, Eye, ImagePlus, LogOut, Plus, Save, Trash2, X } from 'lucide-react'
import { adminEmail, auth, db } from '../lib/firebase'
import { createRestaurant, fetchAdminRestaurants, removeRestaurant, updateRestaurant } from '../lib/restaurants'
import { fetchCareerSettings, updateCareerSettings } from '../lib/siteSettings'
import { emptyRestaurantForm, type Restaurant, type RestaurantForm } from '../types/restaurant'

type VisitEvent = {
  path: string
  visitorId: string
  deviceType: string
  visitedAt?: Timestamp
}

const imageFields = ['imageUrl1', 'imageUrl2', 'imageUrl3'] as const
const maxRestaurantImages = imageFields.length
const maxImageDataLength = 240000

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('사진을 읽을 수 없습니다.'))
    reader.readAsDataURL(file)
  })

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('사진을 불러올 수 없습니다.'))
    image.src = src
  })

const compressRestaurantImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 등록할 수 있습니다.')
  }

  const source = await readFileAsDataUrl(file)
  const image = await loadImage(source)
  let maxSide = 900
  let quality = 0.74

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')

    if (!context) throw new Error('사진을 처리할 수 없습니다.')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const dataUrl = canvas.toDataURL('image/webp', quality)
    if (dataUrl.length <= maxImageDataLength) return dataUrl

    if (quality > 0.5) {
      quality -= 0.08
    } else {
      maxSide = Math.round(maxSide * 0.82)
    }
  }

  throw new Error('사진 용량이 큽니다. 조금 더 작은 이미지로 다시 등록해주세요.')
}

class RequestTimeoutError extends Error {
  constructor(label: string) {
    super(`${label} 요청 시간이 초과되었습니다.`)
    this.name = 'RequestTimeoutError'
  }
}

const withTimeout = async <T,>(promise: Promise<T>, label: string, ms = 15000) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new RequestTimeoutError(label)), ms)
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

const toForm = (restaurant: Restaurant): RestaurantForm => ({
  name: restaurant.name,
  category: restaurant.category,
  area: restaurant.area,
  address: restaurant.address,
  naverMapUrl: restaurant.naverMapUrl,
  imageUrl1: restaurant.imageUrls[0] ?? '',
  imageUrl2: restaurant.imageUrls[1] ?? '',
  imageUrl3: restaurant.imageUrls[2] ?? '',
  recommendedMenu: restaurant.recommendedMenu,
  memo: restaurant.memo,
  tags: restaurant.tags.join(', '),
  isVisible: restaurant.isVisible,
  sortOrder: restaurant.sortOrder,
})

const getErrorMessage = (error: unknown) => {
  if (error instanceof RequestTimeoutError) {
    return `${error.message} Firestore Database가 생성됐는지, Rules가 게시됐는지, 네트워크가 Firebase를 막고 있지 않은지 확인해주세요.`
  }

  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Firebase 권한이 거부되었습니다. Firestore Rules가 적용됐는지, 관리자 이메일이 맞는지 확인해주세요.'
    }
    if (error.code === 'failed-precondition') {
      return 'Firestore 설정 또는 인덱스가 필요합니다. Firebase Console의 안내를 확인해주세요.'
    }
    if (error.code === 'unavailable') {
      return 'Firebase에 연결할 수 없습니다. 네트워크 또는 Firebase 상태를 확인해주세요.'
    }
    return `${error.code}: ${error.message}`
  }

  if (error instanceof Error) return error.message
  return '알 수 없는 오류가 발생했습니다.'
}

const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const startOfWeek = () => {
  const date = startOfDay()
  const day = date.getDay() || 7
  date.setDate(date.getDate() - day + 1)
  return date
}
const startOfMonth = () => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [visits, setVisits] = useState<VisitEvent[]>([])
  const [form, setForm] = useState<RestaurantForm>(emptyRestaurantForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [careerOpen, setCareerOpen] = useState(false)
  const [careerBusy, setCareerBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })
  }, [])

  const refreshRestaurants = async () => {
    try {
      const items = await withTimeout(fetchAdminRestaurants(), '맛집 목록 불러오기', 10000)
      setRestaurants(items)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const refreshVisits = async () => {
    try {
      const since = new Date()
      since.setDate(since.getDate() - 31)
      const snapshot = await withTimeout(
        getDocs(query(collection(db, 'visit_events'), where('visitedAt', '>=', Timestamp.fromDate(since)))),
        '방문 통계 불러오기',
        10000,
      )
      setVisits(snapshot.docs.map((item) => item.data() as VisitEvent))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const refreshCareerSettings = async () => {
    try {
      const settings = await withTimeout(fetchCareerSettings(), '경력 페이지 설정 불러오기', 10000)
      setCareerOpen(settings.isOpen)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  useEffect(() => {
    if (!user) return
    setError('')
    void refreshRestaurants()
    void refreshVisits()
    void refreshCareerSettings()
  }, [user])

  const stats = useMemo(() => {
    const countUniqueSince = (since: Date) =>
      new Set(
        visits
          .filter((event) => event.visitedAt && event.visitedAt.toDate() >= since)
          .map((event) => event.visitorId),
      ).size

    const pageCounts = visits.reduce<Record<string, number>>((acc, event) => {
      acc[event.path] = (acc[event.path] ?? 0) + 1
      return acc
    }, {})

    return {
      today: countUniqueSince(startOfDay()),
      week: countUniqueSince(startOfWeek()),
      month: countUniqueSince(startOfMonth()),
      pages: Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    }
  }, [visits])

  const updateField = <K extends keyof RestaurantForm>(key: K, value: RestaurantForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const resetForm = () => {
    setForm(emptyRestaurantForm)
    setEditingId(null)
  }

  const imageValues = imageFields.map((field) => form[field]).filter(Boolean)

  const setImageValues = (values: string[]) => {
    setForm((current) => ({
      ...current,
      imageUrl1: values[0] ?? '',
      imageUrl2: values[1] ?? '',
      imageUrl3: values[2] ?? '',
    }))
  }

  const handlePhotoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (selectedFiles.length === 0) return

    const remainingSlots = maxRestaurantImages - imageValues.length
    if (remainingSlots <= 0) {
      setError('사진은 최대 3장까지 등록할 수 있습니다.')
      return
    }

    setPhotoBusy(true)
    setError('')
    setNotice('')

    try {
      const files = selectedFiles.slice(0, remainingSlots)
      const compressedImages = []
      for (const file of files) {
        compressedImages.push(await compressRestaurantImage(file))
      }
      setImageValues([...imageValues, ...compressedImages].slice(0, maxRestaurantImages))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setPhotoBusy(false)
    }
  }

  const handlePhotoRemove = (index: number) => {
    setImageValues(imageValues.filter((_, photoIndex) => photoIndex !== index))
  }

  const handleCareerToggle = async () => {
    const nextOpen = !careerOpen
    setCareerBusy(true)
    setError('')
    setNotice('')

    try {
      await withTimeout(updateCareerSettings(nextOpen), '경력 페이지 설정 저장', 15000)
      setCareerOpen(nextOpen)
      setNotice(nextOpen ? '경력 페이지를 공개했습니다.' : '경력 페이지를 닫았습니다.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCareerBusy(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')

    try {
      const request = editingId ? updateRestaurant(editingId, form) : createRestaurant(form)
      await withTimeout(request, '맛집 저장', 15000)
      resetForm()
      setNotice('맛집이 저장되었습니다. 목록을 새로고침합니다.')
      void refreshRestaurants()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const handleRemove = async (id: string) => {
    setError('')
    setNotice('')
    try {
      await withTimeout(removeRestaurant(id), '맛집 삭제', 15000)
      setNotice('맛집이 삭제되었습니다.')
      void refreshRestaurants()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (authLoading) {
    return <main className="admin-page"><div className="empty-state">관리자 상태를 확인하는 중입니다.</div></main>
  }

  if (!user) {
    return (
      <main className="admin-page">
        <div className="empty-state">
          로그인이 필요합니다.
          <a className="primary-link" href="/admin/login">로그인하기</a>
        </div>
      </main>
    )
  }

  const emailMismatch = user.email && user.email !== adminEmail

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <span>Admin dashboard</span>
          <h1>관리자 화면</h1>
          <p>방문자 흐름과 맛집 리스트를 한 곳에서 관리합니다.</p>
        </div>
        <button type="button" onClick={() => signOut(auth)}>
          <LogOut size={15} aria-hidden="true" />
          로그아웃
        </button>
      </div>

      {emailMismatch && (
        <div className="admin-alert">
          현재 로그인 이메일은 {user.email}입니다. 관리자 권한은 {adminEmail} 기준으로 설정되어 있습니다.
        </div>
      )}
      {error && <div className="admin-alert error">{error}</div>}
      {notice && <div className="admin-alert success">{notice}</div>}

      <section className="admin-stat-grid" aria-label="Visit statistics">
        <article>
          <BarChart3 size={18} aria-hidden="true" />
          <span>오늘</span>
          <strong>{stats.today}</strong>
        </article>
        <article>
          <BarChart3 size={18} aria-hidden="true" />
          <span>이번 주</span>
          <strong>{stats.week}</strong>
        </article>
        <article>
          <BarChart3 size={18} aria-hidden="true" />
          <span>이번 달</span>
          <strong>{stats.month}</strong>
        </article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span>Career page</span>
            <h2>경력 페이지 공개 설정</h2>
          </div>
          <a href="/career" target="_blank" rel="noreferrer">
            페이지 확인
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <div className="admin-toggle-row">
          <div>
            <strong>{careerOpen ? '공개 중' : '닫힘'}</strong>
            <span>{careerOpen ? '방문자가 경력 페이지를 볼 수 있습니다.' : '방문자가 경력 페이지에 접근할 수 없습니다.'}</span>
          </div>
          <button type="button" onClick={handleCareerToggle} disabled={careerBusy}>
            {careerBusy ? '저장 중...' : careerOpen ? '닫기' : '열기'}
          </button>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span>Popular pages</span>
            <h2>페이지별 방문</h2>
          </div>
          <button type="button" onClick={refreshVisits}>새로고침</button>
        </div>
        <div className="page-count-list">
          {stats.pages.length === 0 ? (
            <p>아직 기록된 방문이 없습니다.</p>
          ) : (
            stats.pages.map(([path, count]) => (
              <div key={path}>
                <span>{path}</span>
                <strong>{count}</strong>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span>Restaurants</span>
            <h2>맛집 관리</h2>
          </div>
          <a href="/restaurants" target="_blank" rel="noreferrer">
            공개 페이지
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>

        <form className="restaurant-form" onSubmit={handleSubmit}>
          <input placeholder="맛집 이름" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          <input placeholder="카테고리 예: 한식, 카페" value={form.category} onChange={(event) => updateField('category', event.target.value)} />
          <input placeholder="지역 예: 서울 성수" value={form.area} onChange={(event) => updateField('area', event.target.value)} />
          <input placeholder="추천 메뉴" value={form.recommendedMenu} onChange={(event) => updateField('recommendedMenu', event.target.value)} />
          <input className="wide" placeholder="주소" value={form.address} onChange={(event) => updateField('address', event.target.value)} />
          <input className="wide" placeholder="네이버지도 링크" value={form.naverMapUrl} onChange={(event) => updateField('naverMapUrl', event.target.value)} required />
          <div className="photo-upload-field">
            <div className="photo-upload-control">
              <strong>맛집 사진</strong>
              <label className="photo-picker-button">
                <ImagePlus size={14} aria-hidden="true" />
                {photoBusy ? '사진 처리 중...' : '사진 선택'}
                <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} disabled={photoBusy || imageValues.length >= maxRestaurantImages} />
              </label>
            </div>
            {imageValues.length > 0 && (
              <div className="photo-preview-grid">
                {imageValues.map((url, index) => (
                  <div className="photo-preview-item" key={`${url.slice(0, 48)}-${index}`}>
                    <img src={url} alt={`맛집 사진 ${index + 1}`} />
                    <button type="button" onClick={() => handlePhotoRemove(index)} aria-label={`맛집 사진 ${index + 1} 삭제`}>
                      <X size={13} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <textarea className="wide" placeholder="메모" value={form.memo} onChange={(event) => updateField('memo', event.target.value)} />
          <input placeholder="태그, 쉼표로 구분" value={form.tags} onChange={(event) => updateField('tags', event.target.value)} />
          <input type="number" placeholder="정렬 순서" value={form.sortOrder} onChange={(event) => updateField('sortOrder', Number(event.target.value))} />
          <label className="check-field">
            <input type="checkbox" checked={form.isVisible} onChange={(event) => updateField('isVisible', event.target.checked)} />
            공개
          </label>
          <div className="form-actions">
            <button type="submit" disabled={busy || photoBusy}>
              {editingId ? <Save size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
              {busy ? '저장 중...' : photoBusy ? '사진 처리 중...' : editingId ? '수정 저장' : '맛집 추가'}
            </button>
            {editingId && <button type="button" onClick={resetForm}>취소</button>}
          </div>
        </form>

        <div className="admin-table">
          {restaurants.length === 0 ? (
            <div className="empty-state">아직 등록된 맛집이 없습니다.</div>
          ) : (
            restaurants.map((restaurant) => (
              <div className="admin-table-row" key={restaurant.id}>
                <div>
                  <strong>{restaurant.name}</strong>
                  <span>{restaurant.area} · {restaurant.category} · {restaurant.isVisible ? '공개' : '비공개'}</span>
                </div>
                <div>
                  <a href={restaurant.naverMapUrl} target="_blank" rel="noreferrer" title="네이버지도 열기">
                    <Eye size={14} aria-hidden="true" />
                  </a>
                  <button type="button" onClick={() => {
                    setEditingId(restaurant.id)
                    setForm(toForm(restaurant))
                  }}>
                    수정
                  </button>
                  <button type="button" className="danger" onClick={() => handleRemove(restaurant.id)}>
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
