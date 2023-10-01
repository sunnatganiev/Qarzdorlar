import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Product from './Product'
import NumberInput from './NumberInput'
import { CheckBox } from 'react-native-elements'
import DatePicker from './DatePicker'
import uuid from 'react-native-uuid'
import PropTypes from 'prop-types'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import useNotification from '../hooks/useNotification'
import { useNavigation } from '@react-navigation/native'
import { useUserContext } from '../contexts/userContext'
import { useDebtUsers } from '../hooks/useDebtUsers'
import TakeImage from './TakeImage'

const initialProduct = {
  name: '',
  price: '',
  quantity: 0.0,
  totalPrice: ''
}

const AddBorrow = ({ setIsLoading, newBorrower, addBorrow }) => {
  const [products, setProducts] = useState([])
  const [qoldiq, setQoldiq] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState(0)
  const [image, setImage] = useState('')
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + 3)

  const [date, setDate] = useState(currentDate)
  const [isChecked, setIsChecked] = useState(false)
  const [fee, setFee] = useState(0)
  const { handleScheduleNotification } = useNotification()
  const navigator = useNavigation()
  const { fetchUsers } = useUserContext()

  const { LINK_TYPES } = useDebtUsers()

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
    const newFee = lend * 0.005
    setFee(newFee)
    if (isChecked) {
      setQoldiq(newFee + lend)
    } else {
      setQoldiq(lend)
    }
  }, [totalPriceOfProduct, paymentAmount, isChecked])

  const handleAddBorrower = async () => {
    // Validation logic
    let isValid = true

    if (
      newBorrower?.name.trim() === '' ||
      !totalPriceOfProduct ||
      newBorrower?.phone.trim() === '' ||
      newBorrower?.address === ''
    ) {
      isValid = false
    }

    if (!isValid) {
      return Alert.alert(
        "Ism, telefon raqam yoki Jami Summa ma'lumoti kirgizilmagan",
        "Iltimos ma'lumotlarini to'liq kirgizing",
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
      phoneNumber: newBorrower?.phone,
      reminder: date,
      transactions,
      remain: -qoldiq
    }

    const res = await sendAuthenticatedRequest('', 'POST', reqBody)

    console.log({ res })

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
      setIsChecked(false)
      await fetchUsers(LINK_TYPES.ALL_USERS)
      setIsLoading(false)
      navigator.navigate('HomeScreen')
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
      remain: addBorrow.user.remain - qoldiq,
      reminder: date
    }

    const res = await sendAuthenticatedRequest(
      `/${addBorrow.user._id}`,
      'PATCH',
      body
    )

    console.log({ res })

    if (res.status === 'success') {
      setTotalPriceOfProduct('')
      setPaymentAmount('')
      setQoldiq('')
      setProducts([])
      setIsLoading(false)
      await fetchUsers(LINK_TYPES.ALL_USERS)
      navigator.navigate('BorrowerDetail', {
        refresh: true,
        id: addBorrow.user._id
      })
    }
  }

  const handleAdd = () => {
    if (newBorrower?.phone.length < 11) {
      return Alert.alert("Telefon raqam to'liq emas")
    }
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
        <Text style={styles.label}>Jami:</Text>
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
        <Text style={styles.label}>To&apos;lov: </Text>
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
            maxNumber={totalPriceOfProduct}
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

      <TakeImage setImage={setImage} />

      {/* Eslatma Vaqti */}

      <DatePicker selectedDate={date} onDateChange={setDate} />

      {/* Qarzdor saqlash Butotn */}

      <TouchableOpacity onPress={handleAdd} style={styles.btnView}>
        <Text style={styles.btnText}>Qarzdorni saqlash</Text>
      </TouchableOpacity>
    </View>
  )
}

AddBorrow.propTypes = {
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
