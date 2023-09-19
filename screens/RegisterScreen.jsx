import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import { Entypo } from '@expo/vector-icons'
import { PhoneInput } from 'react-native-international-phone-number'
import * as SecureStore from 'expo-secure-store'

const RegisterScreen = () => {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
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

  const handleRegister = async () => {
    if (!name || phone.length !== 11) {
      return Alert.alert("Iltimos Do'kon nomi va Telefon Raqamni to'liq yozing")
    }

    try {
      const user = { name, phoneNumber: `+998${phone.replaceAll(' ', '')}` }

      const res = await fetch(`${process.env.EXPO_PUBLIC_BACK_END}/signup`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      const data = await res.json()

      if (data.status === 'fail') {
        throw new Error(data.message)
      }

      setName('')
      setPhone('')
      navigation.navigate('OTPScreen', { phoneNumber: data.phoneNumber })
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  return (
    <KeyboardViewWrapper>
      {/* Logo */}
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Image
            style={{ height: 96, width: 112, resizeMode: 'contain' }}
            source={{
              uri: 'https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png'
            }}
          />
        </View>

        {/* Ro'yxatdan o'tish Text*/}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
            Ro&apos;yxatdan o&apos;tish
          </Text>
        </View>

        {/* Do'kon nomi Input */}
        <View
          style={{
            marginTop: 24,
            alignItems: 'center'
          }}
        >
          <View style={{ ...styles.inputView, ...styles.shadow }}>
            <Entypo
              name="shop"
              size={24}
              color="gray"
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Do'kon nomi"
              placeholderTextColor={'gray'}
              style={{ fontSize: 18, width: '100%' }}
            />
          </View>
        </View>

        {/* Telefon raqam Input */}
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

        <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={handleRegister}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 28,
              backgroundColor: '#28b485',
              borderRadius: 100
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center'
              }}
            >
              Ro&apos;yxatdan o&apos;tish
            </Text>
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
            Ro&apos;yxatdan o&apos;tganmisiz?
          </Text>
          <Pressable
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 100,
              backgroundColor: '#28b485'
            }}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Tizimga kirish
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardViewWrapper>
  )
}

export default RegisterScreen

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
  }
})
