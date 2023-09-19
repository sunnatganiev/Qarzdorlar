// import axios from 'axios'
// import AsyncStorage from '@react-native-async-storage/async-storage'

// const api = axios.create({
//   baseURL: `${process.env.EXPO_PUBLIC_BACK_END}`
// })

// // Retrieving the token
// const getToken = async () => {
//   try {
//     const token = await AsyncStorage.getItem('authToken')
//     const data = JSON.parse(await EncryptedStorage.getItem('owner'))

//     return token
//   } catch (error) {
//     // console.error('Error retrieving token:', error);
//   }
// }

// export const sendAuthenticatedRequest = async (
//   url = '',
//   method = 'GET',
//   data
// ) => {
//   try {
//     const token = await getToken()
//     if (token) {
//       api.defaults.headers.common.Authorization = `Bearer ${token}`
//     }

//     const response = await api({
//       method,
//       url,
//       data
//     })

//     return response.data
//   } catch (error) {
//     throw error.response.data.message
//   }
// }

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
  try {
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

    console.log({ response, responseData })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Dasturdan foydalanishni davom ettirish uchun to'lov qiling"
        )
      }
      throw new Error(responseData.message)
    }

    return responseData
  } catch (error) {
    console.log({ sendRequest: error })
    throw error
  }
}
