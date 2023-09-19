import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import React, { useState, useEffect } from 'react'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import { useNavigation } from '@react-navigation/native'
import { PhoneInput } from 'react-native-international-phone-number'
import * as SecureStore from 'expo-secure-store'

const LoginScreen = () => {
  const [phone, setPhone] = useState('')
  const navigation = useNavigation()

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // await SecureStore.deleteItemAsync('owner')
        const data = JSON.parse(await SecureStore.getItemAsync('owner'))

        if (data?.token) {
          navigation.replace('Main')
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    checkLoginStatus()
  }, [navigation])

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACK_END}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: `+998${phone.replaceAll(' ', '')}`
          })
        }
      )

      const data = await response.json()

      if (data.status === 'success') {
        setPhone('')
        Keyboard.dismiss()
        return navigation.navigate('OTPScreen', {
          phoneNumber: data.phoneNumber
        })
      } else if (data.status === 'fail') {
        throw new Error(data.message)
      }
    } catch (error) {
      Alert.alert(`${error}`)
      console.error('error', { error })
    }
  }

  return (
    <KeyboardViewWrapper>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: 40
          }}
        >
          <Image
            style={{ height: 96, width: 112, resizeMode: 'contain' }}
            source={{
              uri: 'https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png'
            }}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 25
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 20 }}>
            Tizimga Kirish
          </Text>
        </View>

        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <PhoneInput
            value={phone}
            placeholder="Telefon Raqam"
            onChangePhoneNumber={setPhone}
            selectedCountry={{
              callingCode: '+998',
              cca2: 'UZ',
              flag: 'flag-uz',
              name: 'Uzbekistan'
            }}
            modalDisabled
            onChangeSelectedCountry={() => {}}
            containerStyle={{
              ...styles.shadow,
              ...styles.inputView,
              paddingVertical: 0,
              paddingHorizontal: 6,
              height: 50
            }}
          />
        </View>

        <View style={styles.btnWrapper}>
          <TouchableOpacity style={styles.btnView} onPress={handleLogin}>
            <Text style={styles.btnText}>Kirish</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 50,
            justifyContent: 'center'
          }}
        >
          <Text style={{ fontSize: 18, marginRight: 10 }}>
            Tizimda yangimisiz?
          </Text>
          <Pressable
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 100,
              backgroundColor: '#28b485'
            }}
            onPress={() => navigation.replace('Register')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Ro&apos;yxatdan o&apos;tish
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardViewWrapper>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  inputView: {
    marginTop: 10,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  btnWrapper: { alignItems: 'center', marginTop: 30 },
  btnView: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 100,
    backgroundColor: '#28b485',
    width: 200
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  }
})
