import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Product from './Product'
import NumberInput from './NumberInput'
import { FontAwesome } from '@expo/vector-icons'
import { CheckBox } from 'react-native-elements'
import DatePicker from './DatePicker'
import useTakePicture from '../hooks/useTakePicture'
import uuid from 'react-native-uuid'
import PropTypes from 'prop-types'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import useNotification from '../hooks/useNotification'
import { useNavigation } from '@react-navigation/native'

const initialProduct = {
  name: '',
  price: '',
  quantity: 0.0,
  totalPrice: ''
}

const AddBorrow = ({
  setModalVisible,
  setIsLoading,
  newBorrower,
  addBorrow
}) => {
  const [products, setProducts] = useState([])
  const [qoldiq, setQoldiq] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState(0)
  const { image, setImage, isImgLoading, handleTakePicture } = useTakePicture()
  const [date, setDate] = useState(new Date())
  const [isChecked, setIsChecked] = useState(false)
  const [fee, setFee] = useState(0)
  const { handleScheduleNotification } = useNotification()
  const navigator = useNavigation()

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
      setQoldiq(fee + lend)
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
    const lend = totalPriceOfProduct - paymentAmount
    setQoldiq(lend)
    setFee(lend * 0.005)
  }, [totalPriceOfProduct, paymentAmount])

  const handleAddBorrower = async () => {
    // Validation logic
    let isValid = true

    if (
      newBorrower?.name.trim() === '' ||
      !totalPriceOfProduct ||
      newBorrower?.phone.trim() === ''
    ) {
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

    setIsLoading(true)

    const transactions = [
      {
        amount: -totalPriceOfProduct,
        products,
        imageUrl: image,
        serviceFee: fee
      }
    ]

    if (paymentAmount > 0) {
      transactions.push({ amount: paymentAmount })
    }

    const reqBody = {
      name: newBorrower?.name,
      address: newBorrower?.address,
      reminder: date,
      phoneNumber: newBorrower?.phone,
      transactions,
      remain: -qoldiq
    }

    const res = await sendAuthenticatedRequest('', 'POST', reqBody)

    if (res.status === 'success') {
      handleScheduleNotification(date)
      newBorrower?.setName('')
      newBorrower?.setPhone('')
      newBorrower?.setAddress('')
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

  const handleUpdateTransaction = async () => {
    if (qoldiq < 0) {
      return Alert.alert()
    }
    setIsLoading(true)

    const transactions = [...addBorrow.user.transactions]

    transactions.push({
      amount: -Number(totalPriceOfProduct),
      products,
      imageUrl: image,
      serviceFee: fee
    })

    if (paymentAmount > 0) {
      transactions.push({ amount: paymentAmount })
    }

    const body = {
      transactions,
      remain: addBorrow.user.remain - qoldiq
    }

    const res = await sendAuthenticatedRequest(
      `/${addBorrow.user._id}`,
      'PATCH',
      body
    )

    if (res.status === 'success') {
      setTotalPriceOfProduct('')
      setPaymentAmount('')
      setQoldiq('')
      setProducts([])
      setIsLoading(false)
      navigator.navigate('BorrowerDetail', {
        refresh: true,
        id: addBorrow.user._id
      })
    }
  }

  const handleAdd = () => {
    if (addBorrow) {
      handleUpdateTransaction()
    } else {
      handleAddBorrower()
    }
  }

  return (
    <View>
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

      <DatePicker selectedDate={date} onDateChange={setDate} />

      {/* Qarzdor saqlash Butotn */}
      <View style={styles.btnView}>
        <Pressable onPress={handleAdd}>
          <Text style={styles.btnText}>Qarzdorni saqlash</Text>
        </Pressable>
      </View>
    </View>
  )
}

AddBorrow.propTypes = {
  setModalVisible: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  setName: PropTypes.func,
  setPhone: PropTypes.func,
  setAddress: PropTypes.func,
  name: PropTypes.string,
  phone: PropTypes.string,
  address: PropTypes.string
}

export default AddBorrow

const styles = StyleSheet.create({
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
  input: { fontSize: 20, width: '100%' },
  float: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40
  },
  label: { fontSize: 20, fontWeight: 'bold' },
  image: { height: 400, width: '100%' }
})
