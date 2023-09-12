import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  Image
} from 'react-native'
import uuid from 'react-native-uuid'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons'
import NumberInput from '../components/NumberInput'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import Product from '../components/Product'
import { PhoneInput } from 'react-native-international-phone-number'
import { CheckBox } from 'react-native-elements'
import KeyboardViewWrapper from '../components/KeyboardViewWrapper'
import { FontAwesome } from '@expo/vector-icons'
import useTakePicture from '../hooks/useTakePicture'
import ImagePreview from '../components/ImagePreview'

const initialProduct = {
  name: '',
  price: '',
  quantity: 0.0,
  totalPrice: ''
}

const TransactionScreen = ({ route }) => {
  const { user, type } = route.params
  const [modalVisible, setModalVisible] = useState(false)
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState('')
  const [qoldiq, setQoldiq] = useState('')
  const [fee, setFee] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState(user.phoneNumber || '')
  const [address, setAddress] = useState(user.address || '')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [products, setProducts] = useState([])
  const navigation = useNavigation()
  const { image, isImgLoading, handleTakePicture } = useTakePicture()

  const [isChecked, setIsChecked] = useState(false)

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

  const handleCloseImagePreview = () => setModalVisible(false)

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

  useEffect(() => {
    setQoldiq(totalPriceOfProduct - paymentAmount)
  }, [totalPriceOfProduct, paymentAmount])

  const removeProductHandler = (id, total) => {
    setTotalPriceOfProduct(totalPriceOfProduct - total)
    const remainedProducts = products.filter((item) => id !== item.id)
    setProducts(remainedProducts)
  }

  const handleAddProduct = () => {
    const res = [...products, { ...initialProduct, id: uuid.v4() }]
    setProducts(res)
  }

  const handleUpdateTransaction = async () => {
    if (qoldiq < 0) {
      return Alert.alert()
    }
    setIsLoading(true)

    const transactions = [...user.transactions]

    if (type === 'receive') {
      transactions.push({ amount: +totalPriceOfProduct })
    } else {
      transactions.push(
        {
          amount: -Number(totalPriceOfProduct),
          products,
          imageUrl: image
        },
        { ...(paymentAmount && { amount: paymentAmount }) }
      )
    }

    const body = {
      transactions,
      remain: -qoldiq
    }

    // console.log({ body })

    const res = await sendAuthenticatedRequest(`/${user._id}`, 'PATCH', body)

    if (res.status === 'success') {
      setTotalPriceOfProduct('')
      setPaymentAmount('')
      setQoldiq('')
      setProducts([])
      setIsLoading(false)
      navigation.navigate('BorrowerDetail', { refresh: true, id: user._id })
    }
  }

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
                <View
                  style={{
                    padding: 20
                  }}
                >
                  <Text
                    style={{
                      fontSize: 35,
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    {type === 'receive' ? "To'lov summasi" : 'Qarz berish'}
                  </Text>

                  {type !== 'receive' && (
                    <>
                      {products?.length ? (
                        <View
                          style={{
                            marginTop: 30,
                            ...styles.inputView
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 25,
                              fontWeight: 'bold',
                              marginBottom: 20
                            }}
                          >
                            Maxsulotlar
                          </Text>
                          {products?.map((product) => (
                            <Product
                              key={product.id}
                              setTotal={setTotalPriceOfProduct}
                              removeProduct={removeProductHandler}
                              product={product}
                              setProducts={addProduct}
                            />
                          ))}
                        </View>
                      ) : null}

                      <View
                        style={{
                          backgroundColor: '#55c57a',
                          borderRadius: 100,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          alignSelf: 'center',
                          marginTop: 20
                        }}
                      >
                        <Pressable
                          onPress={handleAddProduct}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 8
                          }}
                        >
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 16,
                              fontWeight: 'bold'
                            }}
                          >
                            Maxsulot qo&apos;shish
                          </Text>
                        </Pressable>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: 30
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginRight: 10
                          }}
                        >
                          Jami summa:
                        </Text>
                        <View style={{ ...styles.inputView, flex: 1 }}>
                          {products?.[0]?.totalPrice ? (
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                              {new Intl.NumberFormat('en-US').format(
                                totalPriceOfProduct
                              )}
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
                    </>
                  )}

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
                  {type !== 'receive' && (
                    <>
                      <View style={{ ...styles.float }}>
                        <Text style={styles.label}>Qarz: </Text>
                        <Text style={styles.label}>
                          {new Intl.NumberFormat('en-US').format(qoldiq)}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 30 }}>
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
                    </>
                  )}
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Pressable
                    style={{
                      backgroundColor: '#55c57a',
                      paddingHorizontal: 40,
                      paddingVertical: 15,
                      borderRadius: 100
                    }}
                    onPress={handleUpdateTransaction}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 18
                      }}
                    >
                      {type === 'receive'
                        ? "To'lovni qabul qilish"
                        : 'Qarz berish'}
                    </Text>
                  </Pressable>
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
                  containerStyle={{
                    ...styles.inputView,
                    paddingVertical: 0,
                    paddingHorizontal: 6,
                    height: 50,
                    alignItems: 'center'
                  }}
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
                  <Pressable
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 28,
                      borderRadius: 100,
                      backgroundColor: '#28b485',
                      width: 200
                    }}
                    onPress={handleEdit}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center'
                      }}
                    >
                      Saqlash
                    </Text>
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
  input: { fontSize: 20, width: '100%' },

  float: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 30
  },
  label: { fontSize: 20, fontWeight: 'bold' },
  image: { height: 400, width: '100%' }
})
