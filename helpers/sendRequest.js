import * as SecureStore from 'expo-secure-store'

// const BASE_URL = process.env.EXPO_PUBLIC_BACK_END
const BASE_URL = 'https://qarzdorlar.technify.uz/api/v1/debtshouse'

const getToken = async () => {
  const data = JSON.parse(await SecureStore.getItemAsync('owner'))

  return data?.token
}

export const sendAuthenticatedRequest = async (
  url = '',
  method = 'GET',
  data
) => {
  const token = await getToken()

  let headers = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let body

  if (data) {
    if (url === '/upload') {
      body = data
      headers['Content-Type'] = 'multipart/form-data'
    } else {
      body = JSON.stringify(data)
      headers['Content-Type'] = 'application/json'
    }
  }
  console.log({ headers })
  const requestOptions = {
    method,
    headers,
    ...(data && { body })
  }

  const response = await fetch(`${BASE_URL}${url}`, requestOptions)
  const responseData = await response.json()

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Dasturdan foydalanish uchun to'lov qiling")
    }

    // throw new Error(responseData.message)
    throw new Error(
      `Server Error: ${response.status} - ${responseData.message}`
    )
  }

  return responseData
}
