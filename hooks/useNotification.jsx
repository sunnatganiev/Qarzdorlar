// import React from 'react'
// import { View, Text, Button } from 'react-native'
import * as Notifications from 'expo-notifications'

export default function useNotification() {
  const handleScheduleNotification = async (date) => {
    try {
      const targetDate = date.getTime() // Replace with your target date and time
      const currentTime = new Date()
      const timeDifferenceInSeconds = Math.max(
        0,
        (targetDate - currentTime.getTime()) / 1000
      )

      //   console.log({ targetDate })
      //   console.log('today: ', currentTime.getTime())
      //   console.log('difference: ', targetDate - currentTime.getTime())

      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync()

      if (status !== 'granted') {
        alert('Notification permission denied')
        return
      }

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '10 seconds left',
          body: 'Here is the notification body',
          data: { data: 'goes here' }
        },
        trigger: { seconds: timeDifferenceInSeconds }
      })

      //   alert('Notification scheduled successfully!')
    } catch (error) {
      console.error('Error scheduling notification:', error)
    }
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
