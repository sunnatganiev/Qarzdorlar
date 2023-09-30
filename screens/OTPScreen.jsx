import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet, Alert, Platform, Image } from 'react-native'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { FontAwesome5 } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import OTPInput from 'react-native-otp-withpaste'
import axios from 'axios'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

const PlaceholderImage = require('../assets/logo.png')

const OTPScreen = ({ route }) => {
  const [otp, setOTP] = useState('')
  const { phoneNumber } = route.params

  const navigation = useNavigation()

  const handleOTPChange = (code) => {
    setOTP(code)
  }

  useFocusEffect(
    useCallback(() => {
      const storeCurrentUser = async (owner) => {
        try {
          await SecureStore.setItemAsync('owner', owner)
          const data = JSON.parse(await SecureStore.getItemAsync('owner'))

          if (data?.token) {
            setTimeout(() => {
              navigation.replace('Main')
            }, 400)
          }
        } catch (error) {
          Alert.alert(error.message)
        }
      }

      if (otp.length === 6) {
        // Send code to back-end
        axios
          // .post(`${process.env.EXPO_PUBLIC_BACK_END}/verify-otp`, {
          .post('https://qarzdorlar.technify.uz/api/v1/debtshouse/verify-otp', {
            phoneNumber,
            otp
          })
          .then((res) => {
            setOTP('')
            storeCurrentUser(JSON.stringify(res.data))
          })
          .catch(() => {
            Alert.alert(
              'SMS Kodni tasdiqlashda xatolik',
              'Iltimos Kodni tekshirib qaytadan kiriting'
            )
          })
      }
    }, [otp, navigation, phoneNumber])
  )

  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          marginTop: 150
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            style={{ height: 112, width: 200, resizeMode: 'contain' }}
            source={PlaceholderImage}
          />

          <Text style={styles.title}>KODNI KIRGIZING</Text>
        </View>
        {Platform.OS === 'ios' && (
          <OTPInputView
            style={styles.otpInput}
            pinCount={6}
            code={otp}
            onCodeChanged={(code) => handleOTPChange(code)}
            autoFocusOnLoad
            codeInputFieldStyle={styles.codeInput}
          />
        )}
        {Platform.OS === 'android' && (
          <View
            style={{
              height: 200,
              alignItems: 'center'
            }}
          >
            <OTPInput
              type="outline"
              onChange={(code) => {
                setOTP(code)
              }}
              onPasted={otp}
              numberOfInputs={6}
              inputStyle={{ borderWidth: 2 }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20
  },
  otpInput: {
    width: '80%',
    height: 100,
    color: '#000'
  },
  codeInput: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  }
})

export default OTPScreen
