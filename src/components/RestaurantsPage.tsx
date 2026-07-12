import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, MapPin, Search, Utensils } from 'lucide-react'
import { fetchPublicRestaurants } from '../lib/restaurants'
import type { Restaurant } from '../types/restaurant'

export default function RestaurantsPage() {
  const { t } = useTranslation()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicRestaurants()
      .then(setRestaurants)
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const values = restaurants.map((item) => item.category).filter(Boolean)
    return ['all', ...Array.from(new Set(values))]
  }, [restaurants])

  const visibleRestaurants = category === 'all'
    ? restaurants
    : restaurants.filter((item) => item.category === category)

  return (
    <main className="listing-shell restaurant-page">
      <div className="section-label">
        <span>{t('restaurants.label')}</span>
        <a href="/admin/login">
          {t('common.admin')}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>

      <div className="section-title-row">
        <h2>{t('restaurants.title')}</h2>
        <p>{t('restaurants.description')}</p>
      </div>

      <div className="restaurant-toolbar" aria-label={t('restaurants.filters')}>
        {categories.map((item) => (
          <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
            {item === 'all' ? t('restaurants.all') : item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">
          <Search size={22} aria-hidden="true" />
          {t('restaurants.loading')}
        </div>
      ) : visibleRestaurants.length === 0 ? (
        <div className="empty-state">
          <Utensils size={22} aria-hidden="true" />
          {t('restaurants.empty')}
        </div>
      ) : (
        <div className="restaurant-grid">
          {visibleRestaurants.map((restaurant) => (
            <article className="restaurant-card" key={restaurant.id}>
              <div className="restaurant-card-top">
                <span>{restaurant.category || t('restaurants.fallback_category')}</span>
                <small>{restaurant.area}</small>
              </div>
              {restaurant.imageUrls.length > 0 && (
                <div className={`restaurant-photo-grid count-${Math.min(restaurant.imageUrls.length, 3)}`}>
                  {restaurant.imageUrls.slice(0, 3).map((url, index) => (
                    <img
                      key={`${restaurant.id}-${url}`}
                      src={url}
                      alt={t('restaurants.photo_alt', { name: restaurant.name, index: index + 1 })}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              <h3>{restaurant.name}</h3>
              <p>{restaurant.memo}</p>
              <dl>
                <div>
                  <dt>{t('restaurants.recommended')}</dt>
                  <dd>{restaurant.recommendedMenu || '-'}</dd>
                </div>
                <div>
                  <dt>{t('restaurants.address')}</dt>
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
                {t('restaurants.map_link')}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
