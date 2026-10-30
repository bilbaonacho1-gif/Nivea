/** Persistencia en sessionStorage: el progreso se conserva mientras dure la pestaña. */
const KEY = 'nivea-sun-fys:v1'

export function loadSession<T>(): T | null {
  try {
    const raw = window.sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveSession<T>(value: T) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    /* modo privado o storage bloqueado: la experiencia sigue sin persistencia */
  }
}

export function clearSession() {
  try {
    window.sessionStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
