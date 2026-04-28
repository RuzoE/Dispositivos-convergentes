// ─── URL BASE DEL BACKEND (Laravel) ───────────────────────
// Android Emulator → 10.0.2.2
// Celular físico → IP de tu PC (ej: 192.168.0.7)
// iOS Simulator → localhost
const BASE_URL = 'http://10.0.2.2:8000/api';

// ─── Tipos ────────────────────────────────────────────────

export type UsuarioCreate = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmarPassword: string;
};

export type UsuarioUpdate = {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
};

export type UsuarioResponse = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  created_at: string;
  updated_at: string;
};

// ─── Función general de fetch ─────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en el servidor');
  }

  return data as T;
}

// ─── CRUD DE USUARIOS ─────────────────────────────────────

// CREATE
export const registrarUsuario = (usuario: UsuarioCreate) =>
  apiFetch<UsuarioResponse>('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario),
  });

// READ — todos
export const obtenerUsuarios = () =>
  apiFetch<UsuarioResponse[]>('/usuarios');

// READ — uno
export const obtenerUsuario = (id: number) =>
  apiFetch<UsuarioResponse>(`/usuarios/${id}`);

// UPDATE
export const actualizarUsuario = (id: number, datos: UsuarioUpdate) =>
  apiFetch<UsuarioResponse>(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });

// DELETE
export const eliminarUsuario = async (id: number): Promise<void> => {

  const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar');
  }
};
