import { http } from './http'

export const UsersApi = {
  list: () => http('/users'),
  create: (data) => http('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => http(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => http(`/users/${id}`, { method: 'DELETE' }),
}
