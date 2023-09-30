import { Alert, Linking, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'

import { useCallback, useEffect, useState } from 'react'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'

const useTakePicture = () => {
  const [isImgLoading, setIsImgLoading] = useState(false)
  const [image, setImage] = useState('')

  // Function to show permission alert
  const showPermissionAlert = useCallback(() => {
    // Display an alert to inform the user about the need for camera permissions
    Alert.alert(
      'Kameraga ruxsat',
      'Iltimos qurilma sozlamariga kirib dasturga kameradan foydalanishga ruxsat bering.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open Settings',
          onPress: openSettings
        }
      ]
    )
  }, [])

  // Function to request camera permission
  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const res = await Camera.requestCameraPermissionsAsync() // Request camera permissions using Camera from expo-camera

      if (res.status !== 'granted') {
        showPermissionAlert()
      }
    }
  }, [showPermissionAlert])

  useEffect(() => {
    // Request camera permissions when the component mounts
    requestCameraPermission()
  }, [requestCameraPermission])

  // Function to open app settings
  const openSettings = () => {
    Linking.openSettings()
  }

  const handleTakePicture = async () => {
    if (image) {
      await sendAuthenticatedRequest('/deleteImage', 'POST', { image })
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.6
    })

    setIsImgLoading(true)

    if (!result.assets) {
      setIsImgLoading(false)
      return setImage(null)
    }

    let uri = result.assets[0]?.uri

    const formData = new FormData()

    let type, name

    if (uri.endsWith('.jpg')) {
      type = 'image/jpg'
      name = 'image.jpg'
    } else if (uri.endsWith('.jpeg')) {
      type = 'image/jpeg'
      name = 'image.jpeg'
    }

    formData.append('image', {
      name,
      type,
      uri
    })

    const res = await sendAuthenticatedRequest('/upload', 'POST', formData)

    if (res.status === 'success') {
      setImage(res.data.imageUrl)
    }

    setIsImgLoading(false)
  }

  return { image, setImage, isImgLoading, handleTakePicture }
}

export default useTakePicture
