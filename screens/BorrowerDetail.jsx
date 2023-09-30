import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
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
import { useUserContext } from '../contexts/userContext'
import { useDebtUsers } from '../hooks/useDebtUsers'
import Spinner from '../components/Spinner'

const BorrowerDetail = ({ route }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userId] = useState(route.params.id)
  const isFocused = useIsFocused()
  const { fetchUsers } = useUserContext()
  const { LINK_TYPES } = useDebtUsers()
  let daysLeft
  let badgeColor = '#28b485'

  const navigator = useNavigation()

  const handleCall = async (phoneNumber) => {
    Linking.openURL(`tel:+998${phoneNumber.replaceAll(' ', '')}`)
  }

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const res = await sendAuthenticatedRequest(`/${userId}`)

        const newUser = res.data.oneUser
        setUser(newUser)
      }

      fetchUser()
    }, [userId, isFocused, isLoading])
  )

  const formatMovementDate = function (date) {
    // LEC 12) add locale
    const calcDaysPassed = (date1, date2) =>
      Math.round((date1 - date2) / (60 * 60 * 24 * 1000))

    const now = new Date()
    const dayLeft = calcDaysPassed(new Date(date), now)

    if (dayLeft >= 1 && dayLeft <= 3) {
      badgeColor = '#ff7730'
    } else if (dayLeft <= 0) {
      badgeColor = '#f73d09'
    } else {
      badgeColor = '#28b485'
    }

    if (dayLeft === 0) return 'Bugun'
    if (dayLeft === 1) return 'Ertaga'
    if (dayLeft > 1) return `${dayLeft} kun qoldi`
    if (dayLeft < 0) return `${dayLeft} kun o'tib ketdi`
  }

  if (user?.remain !== 0) {
    daysLeft = formatMovementDate(user?.reminder)
  }

  const handlePayAll = async () => {
    const pay = async () => {
      setIsLoading(true)

      const transactions = [...user.transactions, { amount: -user.remain }]
      const body = {
        transactions,
        remain: 0
      }

      const res = await sendAuthenticatedRequest(`/${user._id}`, 'PATCH', body)

      if (res.status === 'success') {
        await fetchUsers(LINK_TYPES.ALL_USERS)
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
    return <Spinner />
  }

  return (
    <SafeAreaView style={{ paddingBottom: 50 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigator.goBack()}>
          <Entypo name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.phone}>
              {user.address} +998 {user.phoneNumber}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigator.navigate('TransactionScreen', { user, type: 'edit' })
            }
          >
            <Feather name="edit" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ height: '100%', marginBottom: 300 }}>
        {!route.params.type && (
          <View style={styles.container}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                {user.remain !== 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: `${badgeColor}`,
                      paddingHorizontal: 10,
                      paddingVertical: 1,
                      width: 'auto',
                      borderBottomRightRadius: 10
                    }}
                  >
                    <Text style={styles.badgeText}>{daysLeft}</Text>
                  </View>
                )}

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('en-US').format(user.remain)}{' '}
                    SO&apos;M
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent:
                      route.params.archive || user.remain === 0
                        ? 'center'
                        : 'space-between'
                  }}
                >
                  {!route.params.archive && user.remain !== 0 && (
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity
                        style={styles.iconBox}
                        onPress={() =>
                          navigator.navigate('TransactionScreen', {
                            user,
                            type: 'receive'
                          })
                        }
                      >
                        <FontAwesome5 name="minus" size={20} color="black" />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          marginTop: 5
                        }}
                      >
                        Olish
                      </Text>
                    </View>
                  )}

                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      style={styles.iconBox}
                      onPress={() =>
                        navigator.navigate('TransactionScreen', { user })
                      }
                    >
                      <FontAwesome5 name="plus" size={20} color="black" />
                    </TouchableOpacity>
                    <Text
                      style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5 }}
                    >
                      Qo&apos;shish
                    </Text>
                  </View>
                  {!route.params.archive && user.remain !== 0 && (
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity
                        style={{
                          ...styles.iconBox,
                          backgroundColor: '#28b485'
                        }}
                        onPress={handlePayAll}
                      >
                        <FontAwesome5 name="check" size={20} color="#fff" />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          marginTop: 5
                        }}
                      >
                        To&apos;lash
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        )}

        {user?.phoneNumber && (
          <View>
            <TouchableOpacity
              style={styles.btnView}
              onPress={() => handleCall(user.phoneNumber)}
            >
              <Feather name="phone-call" size={24} color="white" />
              <Text style={styles.btnText}>Qo&apos;ng&apos;iroq qilish</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tarix */}
        <View>
          <Text style={styles.historyLabel}>Tarix</Text>
          <View style={[styles.container, styles.historyContainer]}>
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
  },
  btnView: {
    backgroundColor: '#55c57a',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row'
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center'
  },
  editBtn: {
    padding: 10,
    backgroundColor: '#d0d0d0',
    borderRadius: 100,
    marginLeft: 10
  },
  name: { fontSize: 30, fontWeight: 'bold', textAlign: 'right' },
  phone: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'gray',
    marginTop: 6
  },
  historyLabel: {
    margin: 20,
    marginBottom: -12,
    fontSize: 18,
    fontWeight: 'bold'
  },
  historyContainer: {
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginBottom: 70
  }
})
