import { useEffect, useState, type FormEvent } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { LockKeyhole } from 'lucide-react'
import { auth } from '../lib/firebase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) window.location.href = '/admin'
    })
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      window.location.href = '/admin'
    } catch {
      setError('로그인 정보를 확인해주세요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-auth-page">
      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <span>
          <LockKeyhole size={16} aria-hidden="true" />
          Admin
        </span>
        <h1>관리자 로그인</h1>
        <p>맛집 관리와 방문 통계를 확인하려면 관리자 계정으로 로그인하세요.</p>
        <label>
          이메일
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          비밀번호
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <strong className="form-error">{error}</strong>}
        <button type="submit" disabled={busy}>
          {busy ? '확인 중...' : '로그인'}
        </button>
      </form>
    </main>
  )
}
