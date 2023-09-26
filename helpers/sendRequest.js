import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_BACK_END

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

  const headers = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let body

  if (data) {
    if (url === '/upload') {
      body = data
    } else {
      body = JSON.stringify(data)
    }
  }

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

    throw new Error(responseData.message)
  }

  return responseData
}
