import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native'
import uuid from 'react-native-uuid'
import React, { useEffect, useState } from 'react'
import Product from '../components/Product'
import NumberInput from '../components/NumberInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import { PhoneInput } from 'react-native-international-phone-number'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import { CheckBox } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import ImagePreview from '../components/ImagePreview'
import useTakePicture from '../hooks/useTakePicture'
import DatePicker from '../components/DatePicker'
import useNotification from '../hooks/useNotification'

const initialProduct = {
  name: '',
  price: '',
  quantity: 0.0,
  totalPrice: ''
}

const NewBorrowerScreen = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [products, setProducts] = useState([])
  const [qoldiq, setQoldiq] = useState(0)
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const navigator = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [fee, setFee] = useState(0)
  const { image, setImage, isImgLoading, handleTakePicture } = useTakePicture()
  const [date, setDate] = useState(new Date())
  const [isChecked, setIsChecked] = useState(false)
  const { handleScheduleNotification } = useNotification()

  const handlePicture = () => {
    if (image) {
      Alert.alert(
        `Yuklangan rasm o'chiriladi`,
        `Yangi rasm yuklash uchun eskisi o'chiriladi`,
        [
          {
            text: 'Bekor qilish',
            style: 'cancel'
          },
          {
            text: 'Davom etish',
            onPress: () => {
              handleTakePicture()
            },
            style: 'default'
          }
        ]
      )
    } else {
      handleTakePicture()
    }
  }

  const handleCheckboxToggle = () => {
    const lend = totalPriceOfProduct - paymentAmount
    if (!isChecked) {
      setFee(lend * 0.005)
      setQoldiq(lend * 0.005 + lend)
    } else {
      setQoldiq(lend)
    }
    setIsChecked(!isChecked)
  }

  const removeProductHandler = (id, total) => {
    setTotalPriceOfProduct(totalPriceOfProduct - total)
    const remainedProducts = products.filter((item) => id !== item.id)
    setProducts(remainedProducts)
  }

  const handleAddProduct = () => {
    const res = [...products, { ...initialProduct, id: uuid.v4() }]
    setProducts(res)
  }

  useEffect(() => {
    setQoldiq(totalPriceOfProduct - paymentAmount)
  }, [totalPriceOfProduct, paymentAmount])

  const handleAddBorrower = async () => {
    // Validation logic
    let isValid = true

    if (name.trim() === '' || !totalPriceOfProduct || phone.trim() === '') {
      isValid = false
    }

    if (!isValid) {
      return Alert.alert(
        "Ism, telefon raqam yoki Jami Summa ma'lumoti kirgizilmagan",
        "Iltimos ma'lumotlarni to'liq kirgizing",
        [
          {
            text: 'Yopish',
            style: 'cancel'
          }
        ]
      )
    }

    console.log({ qoldiq })

    setIsLoading(true)
    const reqBody = {
      name,
      address,
      reminderDays: date,
      phoneNumber: phone,
      transactions: [
        { amount: -totalPriceOfProduct, products, imageUrl: image },
        { ...(paymentAmount && { amount: paymentAmount }) }
      ],
      remain: -qoldiq
    }

    const res = await sendAuthenticatedRequest('', 'POST', reqBody)

    if (res.status === 'success') {
      handleScheduleNotification(date)
      setName('')
      setPhone('')
      setAddress('')
      setTotalPriceOfProduct('')
      setPaymentAmount('')
      setQoldiq(0)
      setProducts([])
      setDate(new Date())
      setImage('')
      setIsLoading(false)
      setIsChecked(false)
      navigator.navigate('HomeScreen', { refresh: true })
    }
  }

  const addProduct = (product) => {
    const updatedProducts = products.map((item) =>
      item.id === product.id ? product : item
    )

    const updatedTotalPriceOfProducts = updatedProducts.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    )
    setTotalPriceOfProduct(updatedTotalPriceOfProducts)
    setProducts(updatedProducts)
  }

  const handleCloseImagePreview = () => setModalVisible(false)

  if (isLoading) {
    return (
      <SafeAreaView style={styles.spinner}>
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
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps={'handled'}
        >
          <Text style={styles.title}>Qarzdor</Text>

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
            containerStyle={[styles.phoneInput, styles.inputView]}
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

          <Text style={[styles.title, { marginTop: 40 }]}>Maxsulotlar</Text>

          {products?.length ? (
            <View style={styles.inputView}>
              {products?.map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  setTotal={setTotalPriceOfProduct}
                  setProducts={addProduct}
                  removeProduct={removeProductHandler}
                />
              ))}
            </View>
          ) : (
            ''
          )}
          <View style={styles.btnView}>
            <Pressable onPress={handleAddProduct}>
              <Text style={styles.btnText}>Maxsulot yaratish</Text>
            </Pressable>
          </View>

          {/* Jami Summa Input */}
          <View style={styles.float}>
            <Text style={styles.label}>Jami Summa:</Text>
            <View
              style={{
                ...styles.inputView,
                width: '50%',
                marginTop: 0
              }}
            >
              {products?.[0]?.totalPrice ? (
                <Text style={styles.label}>
                  {new Intl.NumberFormat('en-US').format(totalPriceOfProduct)}
                </Text>
              ) : (
                <NumberInput
                  placeholder="0"
                  style={styles.input}
                  keyboardType="numeric"
                  onChange={setTotalPriceOfProduct}
                  changedValue={totalPriceOfProduct}
                />
              )}
            </View>
          </View>

          {/* To'lov Summasi Input */}
          <View style={styles.float}>
            <Text style={styles.label}>To&apos;lov Summasi: </Text>
            <View
              style={{
                ...styles.inputView,
                width: '50%',
                marginTop: 0
              }}
            >
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

          {/* Qoldid Input */}
          <View style={styles.float}>
            <Text style={styles.label}>Qarz: </Text>
            <Text style={styles.label}>
              {new Intl.NumberFormat('en-US').format(qoldiq)}
            </Text>
          </View>

          {/* Dastur haqqini qushish check boxk */}
          <View style={{ marginVertical: 30 }}>
            <CheckBox
              title="Dastur haqqini qo'shish"
              checked={isChecked}
              onPress={handleCheckboxToggle}
            />
          </View>

          {isImgLoading ? (
            <View style={styles.inputView}>
              <Text style={styles.label}>Rasm yuklanmoqda...</Text>
            </View>
          ) : (
            image && (
              <View style={styles.inputView}>
                <Pressable
                  onPress={() => setModalVisible(true)}
                  style={styles.image}
                >
                  <Image
                    source={{ uri: image }}
                    style={{ flex: 1 }}
                    onError={(error) =>
                      console.error('Image loading error:', error)
                    }
                  />
                </Pressable>
              </View>
            )
          )}
          <TouchableOpacity
            style={[styles.inputView, styles.float]}
            onPress={handlePicture}
          >
            <Text style={styles.label}>Rasm yuklash</Text>
            <FontAwesome name="camera" size={24} color="black" />
          </TouchableOpacity>

          {/* Eslatma Vaqti */}
          {/* <View style={styles.inputView}>
            <Text style={styles.label}>Eslatma vaqtini tanlang</Text>
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.reminderView}
            >
              <Text style={styles.reminderText}>
                {moment(date).format('DD.MM.YY')}
              </Text>
            </TouchableOpacity>

            {show && (
              <RNDateTimePicker
                testID="dateTimePicker"
                display="spinner"
                value={date}
                mode="date"
                onChange={onChange}
                minimumDate={new Date()}
                locale="uz-UZ"
              />
            )}
          </View> */}

          <DatePicker selectedDate={date} onDateChange={setDate} />

          {/* Qarzdor saqlash Butotn */}
          <View style={styles.btnView}>
            <Pressable onPress={handleAddBorrower}>
              <Text style={styles.btnText}>Qarzdorni saqlash</Text>
            </Pressable>
          </View>
        </ScrollView>

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

export default NewBorrowerScreen

const styles = StyleSheet.create({
  spinner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contentContainer: {
    padding: 20
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
