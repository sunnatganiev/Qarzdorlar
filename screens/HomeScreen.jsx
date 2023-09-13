import { debounce } from 'lodash'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
  Button
} from 'react-native'
import * as Linking from 'expo-linking'
import React, { useCallback, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import BorrowerItem from '../components/BorrowerItem'
import { useFocusEffect } from '@react-navigation/native'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import useNotification from '../hooks/useNotification'

const QarzdorlarScreen = () => {
  const [totalRemain, setTotalRemain] = useState(0)
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useFocusEffect(
    useCallback(() => {
      setTotalRemain(users.reduce((sum, item) => sum + item.remain, 0))
    }, [users])
  )

  const fetchUsers = async () => {
    console.log('Fetch Users')
    setIsLoading(true)
    try {
      const data = await sendAuthenticatedRequest(
        '?remain[lt]=0&fields=name,phoneNumber,remain,address,reminder'
      )
      setUsers(data.data?.allDebts)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Error fetching users')
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearchFunc = debounce(async (query) => {
    setIsLoading(true)

    if (query === '') {
      setError('')
      return await fetchUsers()
    }

    try {
      const res = await sendAuthenticatedRequest(
        `/search?search=${query}&fields=name,phoneNumber,remain,address,reminder`
      )

      if (res.status === 'success') {
        setUsers(res.data.foundedData)
        setError('')
      } else if (res.status === 'fail') {
        setError(res.message)
      }
    } catch (err) {
      console.error('Search err', err)
      setError(err)
    }
    setIsLoading(false)
  }, 700)

  const searchFunc = (text) => {
    debouncedSearchFunc(text)
  }

  useFocusEffect(
    useCallback(() => {
      fetchUsers()
    }, [])
  )

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput)
  }

  const handleLinkPress = async () => {
    const deepLink = `https://my.click.uz/clickp2p/7AFC50ED97F7AC54AD41DA6564138BE93CA2A9766225FF966D41DCB8002AFF9C`

    Linking.openURL(deepLink).catch((err) =>
      console.error('Error opening deep link:', err)
    )
  }

  return (
    <KeyboardViewWrapper style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
          Qarzdorlar
        </Text>
        <Pressable onPress={toggleSearchInput}>
          <FontAwesome name="search" size={25} color="white" />
        </Pressable>
      </View>

      {showSearchInput && (
        <View style={{ ...styles.inputView, ...styles.shadow }}>
          <TextInput
            placeholder="Ism, Manzil, Tel Nomer"
            style={styles.input}
            onChangeText={(text) => searchFunc(text)}
          />
        </View>
      )}

      <View style={{ marginVertical: 20, paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase'
          }}
        >
          {new Intl.NumberFormat('en-US').format(+totalRemain)} so&apos;m
        </Text>
      </View>

      {/* CLICK BUTTON */}
      {/* <Pressable onPress={handleLinkPress} style={styles.btnView}>
          <Text style={styles.btnText}>Click</Text>
        </Pressable> */}

      <View style={styles.borrowersContainer}>
        <View>
          {isLoading ? (
            <View
              style={{
                height: '70%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : error ? (
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                {error}
              </Text>
            </View>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => <BorrowerItem item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 200,
                paddingHorizontal: 20
              }}
            />
          )}
        </View>
      </View>
    </KeyboardViewWrapper>
  )
}

export default QarzdorlarScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#28b485',
    height: '100%'
    // paddingBottom: 0
  },
  borrowersContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    width: '100%',
    height: '100%'
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  inputView: {
    alignItems: 'center',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 100,
    margin: 20,
    marginTop: 0,
    width: '90%',
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15
  },
  input: {
    height: 30,
    fontSize: 20,
    flex: 1,
    width: '100%',
    marginRight: -50
  },
  btnView: {
    backgroundColor: '#55c57a',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
})
