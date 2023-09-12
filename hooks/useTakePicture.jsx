import { Alert, Linking, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'

import { useCallback, useEffect, useState } from 'react'
import { deleteImageFromStorage, uploadImageAsync } from '../firebase'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

const useTakePicture = () => {
  const [isImgLoading, setIsImgLoading] = useState(false)
  const [image, setImage] = useState('')
  // const [permission, requestPermission] = Camera.useCameraPermissions()

  // Function to show permission alert
  const showPermissionAlert = useCallback(() => {
    // Display an alert to inform the user about the need for camera permissions
    Alert.alert(
      'Camera Permission Required',
      'Please enable camera permissions in settings to use this feature.',
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
        console.log('Camera permission denied')
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
      await deleteImageFromStorage(image)
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.6
    })

    setIsImgLoading(true)

    if (!result.assets) {
      setIsImgLoading(false)
      return setImage(null)
    }

    let url = result.assets[0]?.uri

    if (Platform.OS === 'ios') {
      const manipResult = await manipulateAsync(
        result.assets[0]?.uri,
        [{ resize: { width: 1500, height: 2000 } }],
        {
          compress: 0.05,
          format: SaveFormat.JPEG
        }
      )

      url = manipResult?.uri
    }

    // console.log(result.assets[0]?.uri)

    const imgUri = await uploadImageAsync(url)

    // console.log({ imgUri })
    setImage(imgUri)
    setIsImgLoading(false)
  }

  return { image, setImage, isImgLoading, handleTakePicture }
}

export default useTakePicture
