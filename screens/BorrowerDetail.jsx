import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5 } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import {
  useNavigation,
  useIsFocused,
  useFocusEffect
} from '@react-navigation/native'

import HistoryItem from '../components/HistoryItem'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'

const BorrowerDetail = ({ route }) => {
  const [user, setUser] = useState(null)
  const [remain, setRemain] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [userId] = useState(route.params.id)
  const isFocused = useIsFocused()

  const navigator = useNavigation()

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const user = await sendAuthenticatedRequest(`/${userId}`)

        const newUser = user.data.oneUser
        setUser(newUser)
        setRemain(
          newUser.transactions.reduce((sum, item) => sum + item.amount, 0)
        )
      }

      fetchUser()
    }, [userId, isFocused, isLoading])
  )

  const handlePayAll = async () => {
    const pay = async () => {
      setIsLoading(true)
      const transactions = [...user.transactions, { amount: -remain }]

      const body = {
        transactions,
        remain: transactions.reduce((sum, item) => sum + item.amount, 0)
      }

      const res = await sendAuthenticatedRequest(
        `${process.env.EXPO_PUBLIC_BACK_END}/${user._id}`,
        'PATCH',
        body
      )

      if (res.status === 'success') {
        setIsLoading(false)
      }
    }

    Alert.alert("To'liq summani qabul qildingizmi?", '', [
      {
        text: "Yo'q",
        style: 'cancel'
      },
      {
        text: 'Ha',
        onPress: async () => {
          await pay()
        },
        style: 'default'
      }
    ])
  }

  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ paddingBottom: 50 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigator.goBack()}>
          <Entypo name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text
              style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'right' }}
            >
              {user?.name}
            </Text>
            <Text
              style={{
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: 16,
                color: 'gray',
                marginTop: 6
              }}
            >
              {user.address} +998 {user.phoneNumber}
            </Text>
          </View>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: '#d0d0d0',
              borderRadius: 100,
              marginLeft: 10
            }}
            onPress={() =>
              navigator.navigate('TransactionScreen', { user, type: 'edit' })
            }
          >
            <Feather name="edit" size={20} color="black" />
          </Pressable>
        </View>
      </View>
      <ScrollView style={{ height: '100%', marginBottom: 300 }}>
        {!route.params.type && (
          <View style={styles.container}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: '#28b485',
                    paddingHorizontal: 10,
                    paddingVertical: 1,
                    width: 130,
                    borderBottomRightRadius: 10
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: '#fff',
                      textAlign: 'center'
                    }}
                  >
                    {remain < 0 ? 'Men berdim' : 'Men Oldim'}
                  </Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('en-US').format(remain)} SO'M
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Pressable
                      style={styles.iconBox}
                      onPress={() =>
                        navigator.navigate('TransactionScreen', {
                          user,
                          type: 'receive'
                        })
                      }
                    >
                      <FontAwesome5 name="minus" size={20} color="black" />
                    </Pressable>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}
                    >
                      Olish
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Pressable
                      style={styles.iconBox}
                      onPress={() =>
                        navigator.navigate('TransactionScreen', { user })
                      }
                    >
                      <FontAwesome5 name="plus" size={20} color="black" />
                    </Pressable>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}
                    >
                      Qo'shish
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Pressable
                      style={{ ...styles.iconBox, backgroundColor: '#28b485' }}
                      onPress={handlePayAll}
                    >
                      <FontAwesome5 name="check" size={20} color="#fff" />
                    </Pressable>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}
                    >
                      To'lash
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* Tarix */}
        <View>
          <Text
            style={{
              margin: 20,
              marginBottom: -12,
              fontSize: 18,
              fontWeight: 'bold'
            }}
          >
            Tarix
          </Text>
          <View
            style={{
              ...styles.container,
              paddingHorizontal: 15,
              paddingVertical: 0
            }}
          >
            {[...user.transactions].reverse().map((item, index) => (
              <HistoryItem user={user} transaction={item} key={index} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BorrowerDetail

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  header: {
    padding: 10,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#ece8e8',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
