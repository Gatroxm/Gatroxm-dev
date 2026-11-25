/**
 * Identificador anónimo del visitante para las reacciones del blog.
 * Se guarda en localStorage; no contiene datos personales y no se comparte.
 */
const STORAGE_KEY = 'gx_visitor_id';
const VALID_ID = /^[a-zA-Z0-9_-]{8,64}$/;

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().replace(/-/g, '');
    }
  } catch {
    // Sin crypto disponible: se usa el fallback de abajo.
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

export function getVisitorId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_ID.test(stored)) return stored;
    const id = randomId();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // Navegación privada o almacenamiento bloqueado: ID solo para esta página.
    return randomId();
  }
}
