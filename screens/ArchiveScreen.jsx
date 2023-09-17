import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native'
import React, { useRef, useMemo, useCallback } from 'react'
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet'

import { LinearGradient } from 'expo-linear-gradient'
import BorrowerItem from '../components/BorrowerItem'
import { EvilIcons } from '@expo/vector-icons'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import { useFocusEffect } from '@react-navigation/native'
import { useDebtUsers } from '../hooks/useDebtUsers'

const ArchiveScreen = () => {
  const { users, isLoading, error, fetchUsers, searchUsers, LINK_TYPES } =
    useDebtUsers()

  useFocusEffect(
    useCallback(() => {
      fetchUsers(LINK_TYPES.ARCHIVE)
    }, [fetchUsers, LINK_TYPES.ARCHIVE])
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
            <Text style={styles.heading}>Arxiv</Text>
            <View style={{ ...styles.inputView, ...styles.shadow }}>
              <EvilIcons name="search" size={24} color="#d0d0d0" />
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  searchUsers({ [LINK_TYPES.ARCHIVE]: text })
                }
                placeholder="Ism, Manzil, Tel Nomer"
              />
            </View>

            <View>
              {isLoading ? (
                <View style={styles.spinner}>
                  <ActivityIndicator size="large" />
                </View>
              ) : error ? (
                <Text style={styles.errorTitle}>{error}</Text>
              ) : (
                <FlatList
                  data={[...users].reverse()}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => <BorrowerItem item={item} />}
                  contentContainerStyle={styles.listWrapper}
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
  heading: {
    margin: 20,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  spinner: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 20
  },
  listWrapper: {
    paddingBottom: 200,
    paddingHorizontal: 20
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
