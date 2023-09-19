import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native'
// import uuid from 'react-native-uuid'
import React, { useState } from 'react'

import { LinearGradient } from 'expo-linear-gradient'
import { PhoneInput } from 'react-native-international-phone-number'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import AddBorrow from '../components/AddBorrow'
import Spinner from '../components/Spinner'

const NewBorrowerScreen = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const newBorrower = { setName, setPhone, setAddress, name, phone, address }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <KeyboardViewWrapper>
      <LinearGradient
        start={[0, 0]}
        end={[1, 1]}
        colors={['#F2F2F2', '#DBDBDB']}
      >
        <View style={{ marginVertical: 25 }}>
          <Text style={styles.title}>Yangi Qarzdor</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps={'handled'}
        >
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
            onChangePhoneNumber={setPhone}
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

          {/* AddBorrow Space */}
          <AddBorrow setIsLoading={setIsLoading} newBorrower={newBorrower} />
        </ScrollView>
      </LinearGradient>
    </KeyboardViewWrapper>
  )
}

export default NewBorrowerScreen

const styles = StyleSheet.create({
  spinner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24
  },

  inputView: {
    alignItems: 'start',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 25,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  btnView: {
    backgroundColor: '#55c57a',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reminderView: {
    width: '100%',
    backgroundColor: '#55c57a',
    borderRadius: 12,
    marginVertical: 10
  },
  reminderText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 10
  },
  input: { fontSize: 20, width: '100%' },
  phoneInput: {
    paddingVertical: 0,
    paddingHorizontal: 6,
    height: 50,
    alignItems: 'center'
  },
  float: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40
  },
  label: { fontSize: 20, fontWeight: 'bold' },
  image: { height: 400, width: '100%' }
})
