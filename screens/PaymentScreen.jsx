import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Linking from 'expo-linking'

import { sendAuthenticatedRequest } from '../helpers/sendRequest'

const PlaceholderImage = require('../assets/click.png')

const PaymentScreen = () => {
  const [serviceFee, setServiceFee] = useState(100000)

  const fetchServiceFee = async () => {
    try {
      const currentServiceFee = await sendAuthenticatedRequest('/payment')
      if (currentServiceFee.status === 'success') {
        setServiceFee(currentServiceFee.payment)
      } else {
        throw new Error('Error requesting Service Fee')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchServiceFee()
  }, [])

  const handlePayment = async () => {
    const deepLink = `https://my.click.uz/clickp2p/7AFC50ED97F7AC54AD41DA6564138BE93CA2A9766225FF966D41DCB8002AFF9C`

    Linking.openURL(deepLink).catch((err) =>
      console.error('Error opening deep link:', err)
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.amount}>
        <Text style={styles.amountTitle}>
          {new Intl.NumberFormat('en-US').format(serviceFee)} So&apos;m
        </Text>
      </View>
      <TouchableOpacity onPress={handlePayment} style={styles.btnView}>
        {/* <Text style={styles.btnText}>Click orqali to&apos;lash</Text> */}
        <Image source={PlaceholderImage} style={styles.image} />
      </TouchableOpacity>
    </View>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  amount: {},
  amountTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  btnView: {
    // backgroundColor: '#1A1B28',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  image: { height: 60, width: 112, resizeMode: 'contain' }
})
