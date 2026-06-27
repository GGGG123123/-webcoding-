export function publicAssetUrl(path) {
  const base = import.meta.env.BASE_URL === './' ? '/' : import.meta.env.BASE_URL

  return `${base}${path}`
}
