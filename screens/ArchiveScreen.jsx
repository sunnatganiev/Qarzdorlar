import { debounce } from 'lodash'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native'
import React, { useRef, useMemo, useCallback, useState } from 'react'
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet'

import { LinearGradient } from 'expo-linear-gradient'
import BorrowerItem from '../components/BorrowerItem'
import { EvilIcons } from '@expo/vector-icons'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import { useFocusEffect } from '@react-navigation/native'

const ArchiveScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])

  const fetchArchives = async () => {
    console.log('Fetch Archives')
    setIsLoading(true)
    try {
      const res = await sendAuthenticatedRequest('?remain[eq]=0')

      setUsers(res.data.allDebts)
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
      return fetchArchives()
    }

    try {
      const res = await sendAuthenticatedRequest(
        `/search?search=${query}&remain=0`
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

  // useEffect(() => {
  //   fetchArchives()
  // }, [])

  useFocusEffect(
    useCallback(() => {
      fetchArchives()
    }, [])
  )

  const bottomSheetModalRef = useRef(null)

  const snapPoints = useMemo(() => ['25%', '50%', '75%'], [])

  // const handlePresentModalPress = useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index)
  }, [])

  return (
    <KeyboardViewWrapper>
      <LinearGradient
        start={[0, 0]}
        end={[1, 1]}
        colors={['#F2F2F2', '#DBDBDB']}
        style={{ flex: 1 }}
      >
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <Text style={{ margin: 20, fontSize: 32, fontWeight: 'bold' }}>
              Arxiv
            </Text>
            <View style={{ ...styles.inputView, ...styles.shadow }}>
              <EvilIcons name="search" size={24} color="#d0d0d0" />
              <TextInput
                style={styles.input}
                onChangeText={(text) => searchFunc(text)}
                placeholder="Ism, Manzil, Tel Nomer"
              />
            </View>

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
                  data={[...users].reverse()}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => <BorrowerItem item={item} />}
                  contentContainerStyle={{
                    paddingBottom: 200,
                    paddingHorizontal: 20
                  }}
                />
              )}
            </View>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <View>
                <Text>Hello</Text>
              </View>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </LinearGradient>
    </KeyboardViewWrapper>
  )
}

export default ArchiveScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  shadow: {
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  }
})
