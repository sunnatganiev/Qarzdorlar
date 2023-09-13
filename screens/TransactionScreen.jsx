import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput
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
import useTakePicture from '../hooks/useTakePicture'
import ImagePreview from '../components/ImagePreview'
import AddBorrow from '../components/AddBorrow'

const TransactionScreen = ({ route }) => {
  const { user, type } = route.params
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState(user.phoneNumber || '')
  const [address, setAddress] = useState(user.address || '')
  const [paymentAmount, setPaymentAmount] = useState(0)

  const navigation = useNavigation()
  const { image } = useTakePicture()

  const handleCloseImagePreview = () => setModalVisible(false)

  const handleEdit = async () => {
    setIsLoading(true)

    try {
      const body = {
        name,
        phoneNumber: phone,
        address
      }

      const res = await sendAuthenticatedRequest(`/${user._id}`, 'PATCH', body)

      if (res.status === 'success') {
        navigation.navigate('BorrowerDetail', { refresh: true, id: user._id })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
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
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
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
            <View
              style={{
                padding: 10,
                paddingRight: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Entypo name="chevron-left" size={30} color="black" />
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    textAlign: 'right'
                  }}
                >
                  {name}
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
                  {address} +998 {phone || user.phoneNumber}
                </Text>
              </View>
            </View>
            {type !== 'edit' ? (
              <>
                <View style={{ paddingHorizontal: 20 }}>
                  {type !== 'receive' ? (
                    <AddBorrow
                      setIsLoading={setIsLoading}
                      setModalVisible={setModalVisible}
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
              <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 30 }}>
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
                  <Pressable style={styles.btn} onPress={handleEdit}>
                    <Text style={styles.btnText}>Saqlash</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>

        {/* Image Preview */}
        <ImagePreview
          visible={modalVisible}
          imageUrl={image}
          onClose={handleCloseImagePreview}
        />
      </LinearGradient>
    </KeyboardViewWrapper>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
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
