import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

import { useNavigation, useRoute } from '@react-navigation/native'

const DrawerHeader = () => {
  const route = useRoute()
  const navigation = useNavigation()

  if (route.name !== 'Asosiy sahifa') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="ios-menu-outline" size={35} color="#28b485" />
        </TouchableOpacity>
      </View>
    )
  }

  return null
}

export default DrawerHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 20
  },
  inputView: {
    alignItems: 'center',
    borderColor: '#d0d0d0',
    borderWidth: 0,
    borderRadius: 100,
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  input: {
    fontSize: 20,
    flex: 1,
    width: '100%',
    marginRight: -50
  }
})
