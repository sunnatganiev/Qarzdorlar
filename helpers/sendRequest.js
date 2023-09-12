// Function to send authenticated requests
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACK_END}`
})

// Retrieving the token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    return token
  } catch (error) {
    // console.error('Error retrieving token:', error);
  }
}

export const sendAuthenticatedRequest = async (
  url = '',
  method = 'GET',
  data
) => {
  try {
    const token = await getToken()
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    const response = await api({
      method,
      url,
      data
    })

    return response.data
  } catch (error) {
    throw error.response.data.message
  }
}
