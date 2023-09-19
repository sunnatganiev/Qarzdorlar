import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'

const LogoutButton = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert('Tizimdan chiqmoqchimisiz?', '', [
      {
        text: "Yo'q",
        style: 'cancel'
      },
      {
        text: 'Ha',
        onPress: async () => {
          await SecureStore.deleteItemAsync('owner')
          navigation.replace('Login')
        },
        style: 'default'
      }
    ])
  }

  const handleCall = async (phoneNumber) => {
    Linking.openURL('tel:+998904424999')
  }

  return (
    <>
      <TouchableOpacity style={styles.float} onPress={handleCall}>
        <MaterialIcons name="support-agent" size={24} color="#28b485" />
        <Text style={styles.label}>Murojaat uchun</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <View style={styles.float}>
          <FontAwesome name={'sign-out'} size={30} color="#28b485" />
          <Text style={styles.label}>Chiqish</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default LogoutButton

const styles = StyleSheet.create({
  float: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 20
  },
  label: { marginLeft: 10, fontSize: 16, color: '#28b485' }
})
