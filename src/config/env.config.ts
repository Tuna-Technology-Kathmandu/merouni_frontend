export class DotenvConfig {
  static NEXT_APP_API_BASE_URL = 'http://localhost:8000/api/v1'
  static NEXT_APP_MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
  static NEXT_APP_CK_EDITOR_KEY = process.env.NEXT_APP_CK_EDITOR_KEY
}


console.log(DotenvConfig.NEXT_APP_API_BASE_URL,"WOWO")