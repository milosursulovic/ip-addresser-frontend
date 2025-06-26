export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token')
  const isFormData = options.body instanceof FormData

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers,
  })

  return res
}
