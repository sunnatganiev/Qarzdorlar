import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import React, { useCallback, useState } from 'react'
import BorrowerItem from '../components/BorrowerItem'
import { useFocusEffect } from '@react-navigation/native'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import { useUserContext } from '../contexts/userContext'
import useSort from '../hooks/useSort'

const QarzdorlarScreen = () => {
  const [totalRemain, setTotalRemain] = useState(0)
  const { users, isLoading, error } = useUserContext()
  const { Sort, sortedUsers } = useSort(users)

  useFocusEffect(
    useCallback(() => {
      setTotalRemain(users.reduce((sum, item) => sum + item.remain, 0))
    }, [users])
  )

  return (
    <KeyboardViewWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {new Intl.NumberFormat('en-US').format(+totalRemain)} so&apos;m
        </Text>
        <Sort />
      </View>

      <View style={styles.borrowersContainer}>
        <View>
          {isLoading ? (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : error ? (
            <View style={{ padding: 20 }}>
              <Text style={styles.errorTitle}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={sortedUsers}
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
    backgroundColor: '#28b485'
  },
  header: {
    marginVertical: 20,
    paddingHorizontal: 20,
    marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  borrowersContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    width: '100%',
    height: '100%'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase'
  },
  spinnerContainer: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
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
