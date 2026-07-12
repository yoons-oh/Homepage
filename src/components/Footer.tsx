import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'

const CONTACT_EMAIL = 'yoonseukoh@gmail.com'

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.72.5.09.68-.22.68-.49v-1.74c-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05A9.35 9.35 0 0 1 12 6.94c.85 0 1.7.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.08.36.32.68.95.68 1.91v2.79c0 .27.18.59.69.49A10.22 10.22 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useTranslation()
  const contactUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(t('contact.email_subject'))}&body=${encodeURIComponent(t('contact.email_body'))}`

  return (
    <footer id="contact" className="footer-section">
      <div>
        <strong>
          yoon<span>.dev</span>
        </strong>
        <p>{t('footer.made')}</p>
        <a className="footer-email" href={contactUrl} target="_blank" rel="noreferrer">
          {CONTACT_EMAIL}
        </a>
      </div>
      <div className="footer-links">
        <a href="https://github.com/yoons-oh" target="_blank" rel="noreferrer" aria-label="GitHub">
          <GithubIcon />
        </a>
        <a
          href={contactUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Send email to ${CONTACT_EMAIL}`}
          title={`Send email to ${CONTACT_EMAIL}`}
        >
          <Mail size={18} aria-hidden="true" />
        </a>
        <span>© 2026 yoon.dev</span>
      </div>
    </footer>
  )
}
