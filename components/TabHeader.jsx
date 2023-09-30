import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'

import { useNavigation, useRoute } from '@react-navigation/native'
import { useUserContext } from '../contexts/userContext'
import { useDebtUsers } from '../hooks/useDebtUsers'

const TabHeader = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [showSearchInput, setShowSearchInput] = useState(false)

  const { searchUsers } = useUserContext()
  const { LINK_TYPES } = useDebtUsers()

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput)
  }

  if (route.name === 'HomeScreen') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="ios-menu-outline" size={35} color="white" />
        </TouchableOpacity>
        {showSearchInput && (
          <View style={styles.inputView}>
            <TextInput
              placeholder="Ism, Manzil, Tel Nomer"
              placeholderTextColor="#bcb8b8"
              style={styles.input}
              onChangeText={(text) =>
                searchUsers({ [LINK_TYPES.ALL_USERS]: text })
              }
            />
          </View>
        )}

        <TouchableOpacity onPress={toggleSearchInput}>
          <FontAwesome name="search" size={25} color="white" />
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={{ margin: 20, marginTop: 40, width: 35 }}
      >
        <Ionicons name="ios-menu-outline" size={35} color="#28b485" />
      </TouchableOpacity>
    )
  }
}

export default TabHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 10
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
    fontSize: 18,
    flex: 1,
    width: '100%',
    marginRight: -40
  }
})
