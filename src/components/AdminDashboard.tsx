import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore'
import { ArrowUpRight, BarChart3, Eye, LogOut, Plus, Save, Trash2 } from 'lucide-react'
import { auth, db } from '../lib/firebase'
import { createRestaurant, fetchAdminRestaurants, removeRestaurant, updateRestaurant } from '../lib/restaurants'
import { emptyRestaurantForm, type Restaurant, type RestaurantForm } from '../types/restaurant'

type VisitEvent = {
  path: string
  visitorId: string
  deviceType: string
  visitedAt?: Timestamp
}

const toForm = (restaurant: Restaurant): RestaurantForm => ({
  name: restaurant.name,
  category: restaurant.category,
  area: restaurant.area,
  address: restaurant.address,
  naverMapUrl: restaurant.naverMapUrl,
  recommendedMenu: restaurant.recommendedMenu,
  memo: restaurant.memo,
  tags: restaurant.tags.join(', '),
  isVisible: restaurant.isVisible,
  sortOrder: restaurant.sortOrder,
})

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

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })
  }, [])

  const refreshRestaurants = async () => {
    const items = await fetchAdminRestaurants()
    setRestaurants(items)
  }

  const refreshVisits = async () => {
    const since = new Date()
    since.setDate(since.getDate() - 31)
    const snapshot = await getDocs(query(collection(db, 'visit_events'), where('visitedAt', '>=', Timestamp.fromDate(since))))
    setVisits(snapshot.docs.map((item) => item.data() as VisitEvent))
  }

  useEffect(() => {
    if (!user) return
    refreshRestaurants()
    refreshVisits()
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    try {
      if (editingId) await updateRestaurant(editingId, form)
      else await createRestaurant(form)
      resetForm()
      await refreshRestaurants()
    } finally {
      setBusy(false)
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
          <textarea className="wide" placeholder="메모" value={form.memo} onChange={(event) => updateField('memo', event.target.value)} />
          <input placeholder="태그, 쉼표로 구분" value={form.tags} onChange={(event) => updateField('tags', event.target.value)} />
          <input type="number" placeholder="정렬 순서" value={form.sortOrder} onChange={(event) => updateField('sortOrder', Number(event.target.value))} />
          <label className="check-field">
            <input type="checkbox" checked={form.isVisible} onChange={(event) => updateField('isVisible', event.target.checked)} />
            공개
          </label>
          <div className="form-actions">
            <button type="submit" disabled={busy}>
              {editingId ? <Save size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
              {editingId ? '수정 저장' : '맛집 추가'}
            </button>
            {editingId && <button type="button" onClick={resetForm}>취소</button>}
          </div>
        </form>

        <div className="admin-table">
          {restaurants.map((restaurant) => (
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
                <button type="button" className="danger" onClick={() => removeRestaurant(restaurant.id).then(refreshRestaurants)}>
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
