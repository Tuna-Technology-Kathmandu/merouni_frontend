export class DotenvConfig {
  static NEXT_APP_API_BASE_URL = (() => {
    const baseUrl = process.env.NEXT_APP_API_BASE_URL || 'http://localhost:8000'
    const versionPrefix = process.env.NEXT_APP_API_VERSION_URL_PREFIX || '/api/v1'
    // Append version prefix if not already included
    return baseUrl.endsWith(versionPrefix) ? baseUrl : `${baseUrl}${versionPrefix}`
  })()
  static NEXT_APP_MEDIA_BASE_URL = "https://uploads.merouni.com/api/v1"
  static NEXT_APP_CK_EDITOR_KEY = process.env.NEXT_APP_CK_EDITOR_KEY
}