export const route = {
  path: 'mines',
  name: 'mines-index',
  component: () => import('./views/index.vue'),
  meta: {
    game: true,
  },
}
