import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, MapPin, Search, Utensils } from 'lucide-react'
import { fetchPublicRestaurants } from '../lib/restaurants'
import type { Restaurant } from '../types/restaurant'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [category, setCategory] = useState('전체')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicRestaurants()
      .then(setRestaurants)
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const values = restaurants.map((item) => item.category).filter(Boolean)
    return ['전체', ...Array.from(new Set(values))]
  }, [restaurants])

  const visibleRestaurants = category === '전체'
    ? restaurants
    : restaurants.filter((item) => item.category === category)

  return (
    <main className="listing-shell restaurant-page">
      <div className="section-label">
        <span>Food list</span>
        <a href="/admin/login">
          Admin
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>

      <div className="section-title-row">
        <h2>맛집 리스트</h2>
        <p>직접 저장한 맛집을 지역, 메뉴, 네이버지도 링크와 함께 정리하는 공간입니다.</p>
      </div>

      <div className="restaurant-toolbar" aria-label="Restaurant filters">
        {categories.map((item) => (
          <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">
          <Search size={22} aria-hidden="true" />
          맛집을 불러오는 중입니다.
        </div>
      ) : visibleRestaurants.length === 0 ? (
        <div className="empty-state">
          <Utensils size={22} aria-hidden="true" />
          아직 등록된 맛집이 없습니다.
        </div>
      ) : (
        <div className="restaurant-grid">
          {visibleRestaurants.map((restaurant) => (
            <article className="restaurant-card" key={restaurant.id}>
              <div className="restaurant-card-top">
                <span>{restaurant.category || '맛집'}</span>
                <small>{restaurant.area}</small>
              </div>
              {restaurant.imageUrls.length > 0 && (
                <div className={`restaurant-photo-grid count-${Math.min(restaurant.imageUrls.length, 3)}`}>
                  {restaurant.imageUrls.slice(0, 3).map((url, index) => (
                    <img
                      key={`${restaurant.id}-${url}`}
                      src={url}
                      alt={`${restaurant.name} 사진 ${index + 1}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              <h3>{restaurant.name}</h3>
              <p>{restaurant.memo}</p>
              <dl>
                <div>
                  <dt>추천</dt>
                  <dd>{restaurant.recommendedMenu || '-'}</dd>
                </div>
                <div>
                  <dt>주소</dt>
                  <dd>{restaurant.address || '-'}</dd>
                </div>
              </dl>
              {restaurant.tags.length > 0 && (
                <div className="tag-row">
                  {restaurant.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              <a className="map-link" href={restaurant.naverMapUrl} target="_blank" rel="noreferrer">
                <MapPin size={15} aria-hidden="true" />
                네이버지도에서 보기
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
