import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'

const LogoutButton = ({ navigation }) => {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('owner')
    navigation.replace('Login')
  }

  return (
    <TouchableOpacity onPress={handleLogout}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <FontAwesome name={'sign-out'} size={30} color="#28b485" />
        <Text style={{ marginLeft: 10, fontSize: 16, color: '#28b485' }}>
          Chiqish
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default LogoutButton
