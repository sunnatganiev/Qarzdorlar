import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_BACK_END

const getToken = async () => {
  try {
    const data = JSON.parse(await SecureStore.getItemAsync('owner'))

    return data?.token
  } catch (error) {
    // Handle error if needed
    console.error('Error retrieving token:', error)
  }
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

  const requestOptions = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) })
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
