import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from 'react-native'

import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons'
import NumberInput from '../components/NumberInput'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import { PhoneInput } from 'react-native-international-phone-number'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import AddBorrow from '../components/AddBorrow'
import { useUserContext } from '../contexts/userContext'
import { useDebtUsers } from '../hooks/useDebtUsers'
import Spinner from '../components/Spinner'

const TransactionScreen = ({ route }) => {
  const { user, type } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState(user.phoneNumber || '')
  const [address, setAddress] = useState(user.address || '')
  const [paymentAmount, setPaymentAmount] = useState(0)
  const { fetchUsers } = useUserContext()
  const { LINK_TYPES } = useDebtUsers()

  const navigation = useNavigation()

  const handleEdit = async () => {
    if (phone.length > 0 && phone.length < 11) {
      return Alert.alert("Telefon raqamni to'liq kirgizing")
    }

    setIsLoading(true)

    const body = {
      name,
      phoneNumber: phone,
      address
    }

    const res = await sendAuthenticatedRequest(`/${user._id}`, 'PATCH', body)

    if (res.status === 'success') {
      fetchUsers(LINK_TYPES.ALL_USERS)
      navigation.navigate('BorrowerDetail', { refresh: true, id: user._id })
    }

    setIsLoading(false)
  }

  const handleUpdateTransaction = async () => {
    setIsLoading(true)

    const transactions = [...user.transactions]

    if (paymentAmount > 0) {
      transactions.push({ amount: paymentAmount })
    }

    const body = {
      transactions,
      remain: addBorrow.user.remain + +paymentAmount
    }

    const res = await sendAuthenticatedRequest(
      `/${addBorrow.user._id}`,
      'PATCH',
      body
    )

    if (res.status === 'success') {
      await fetchUsers(LINK_TYPES.ALL_USERS)
      setPaymentAmount('')
      setIsLoading(false)
      navigation.navigate('BorrowerDetail', {
        refresh: true,
        id: addBorrow.user._id
      })
    }
  }

  const addBorrow = { user, type }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <KeyboardViewWrapper>
      <LinearGradient
        start={[0, 0]}
        end={[1, 1]}
        colors={['#F2F2F2', '#DBDBDB']}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={30} color="black" />
              </TouchableOpacity>
              <View>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.userInfo}>
                  {address} +998 {phone || user.phoneNumber}
                </Text>
              </View>
            </View>
            {type !== 'edit' ? (
              <>
                <View style={styles.addBorrow}>
                  {type !== 'receive' ? (
                    <AddBorrow
                      setIsLoading={setIsLoading}
                      addBorrow={addBorrow}
                    />
                  ) : (
                    <>
                      <View style={styles.float}>
                        <Text style={styles.label}>To&apos;lov Summasi: </Text>
                        <View style={[styles.inputView, styles.halfInput]}>
                          <NumberInput
                            placeholder="0"
                            placeholderTextColor={'gray'}
                            style={{ ...styles.input }}
                            keyboardType="numeric"
                            onChange={setPaymentAmount}
                            changedValue={paymentAmount}
                            maxNumber={Math.abs(user.remain)}
                          />
                        </View>
                      </View>

                      {/* CTA BUTTON */}
                      <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={handleUpdateTransaction}
                        >
                          <Text style={styles.btnText}>
                            To&apos;lovni qabul qilish
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.userInfoEdit}>
                <View style={styles.inputView}>
                  <TextInput
                    placeholder="Ism"
                    placeholderTextColor={'gray'}
                    style={styles.input}
                    onChangeText={(text) => setName(text)}
                    value={name}
                  />
                </View>

                <PhoneInput
                  value={phone}
                  placeholder="Telefon Raqam"
                  onChangePhoneNumber={(text) => setPhone(text)}
                  selectedCountry={{
                    callingCode: '+998',
                    cca2: 'UZ',
                    flag: 'flag-uz',
                    name: 'Uzbekistan'
                  }}
                  modalDisabled
                  onChangeSelectedCountry={() => {}}
                  containerStyle={[styles.inputView, styles.phoneInput]}
                  inputStyle={{ paddingHorizontal: 0 }}
                />

                <View style={styles.inputView}>
                  <TextInput
                    placeholder="Manzil"
                    placeholderTextColor={'gray'}
                    style={styles.input}
                    onChangeText={(text) => setAddress(text)}
                    value={address}
                  />
                </View>

                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity style={styles.btn} onPress={handleEdit}>
                    <Text style={styles.btnText}>Saqlash</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardViewWrapper>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
  spinner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputView: {
    alignItems: 'start',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
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
  nameText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  userInfo: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'gray',
    marginTop: 6
  },
  addBorrow: { paddingHorizontal: 20, marginBottom: 20 },
  userInfoEdit: { paddingHorizontal: 20, marginTop: 20, gap: 30 },
  halfInput: {
    width: '50%',
    marginTop: 0
  },
  phoneInput: {
    paddingVertical: 0,
    paddingHorizontal: 6,
    height: 50,
    alignItems: 'center'
  },
  input: { fontSize: 20, width: '100%' },
  btn: {
    backgroundColor: '#55c57a',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 100
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  float: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 30
  },
  label: { fontSize: 20, fontWeight: 'bold' },
  image: { height: 400, width: '100%' }
})
