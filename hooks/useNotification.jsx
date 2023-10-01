// import React from 'react'
// import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import { Alert } from 'react-native'

export default function useNotification() {
  const navigation = useNavigation()
  useEffect(() => {
    const subs1 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data.screen
        navigation.replace(screen)
      }
    )

    return () => {
      subs1.remove()
    }
  }, [navigation])

  const handleScheduleNotification = async (date) => {
    const targetDate = date.getTime() // Replace with your target date and time
    const currentTime = new Date()
    const timeDifferenceInSeconds = Math.max(
      0,
      (targetDate - currentTime.getTime()) / 1000
    )

    if (timeDifferenceInSeconds <= 0) {
      return
    }

    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Notification permission denied')
      return
    }

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Kechikgan Qarzdorlar',
        body: 'Qarzdorlaringizni ogohlantiring',
        data: { screen: 'Delayed' }
      },
      trigger: { seconds: timeDifferenceInSeconds }
    })
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false
    })
  })

  return { handleScheduleNotification }
}
