import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Keyboard,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import NumberInput from '../components/NumberInput'
import axios from 'axios'
import Product from '../components/Product'
import uuid from 'react-native-uuid'
import { LinearGradient } from 'expo-linear-gradient'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'

const initialProduct = {
  name: '',
  price: '',
  quantity: 0.0,
  totalPrice: ''
}

const TransactionScreen = ({ route }) => {
  const { user, type, transaction } = route.params
  const [amount, setAmount] = useState('')
  const [products, setProducts] = useState(
    transaction && transaction?.products?.length !== 0
      ? transaction.products
      : []
  )
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState(
    transaction?.amount || ''
  )

  const [isLoading, setIsLoading] = useState(false)

  const navigator = useNavigation()

  const handleAddProduct = () => {
    const res = [...products, { ...initialProduct, id: uuid.v4() }]
    setProducts(res)
  }

  const removeProductHandler = (id, total) => {
    setTotalPriceOfProduct(totalPriceOfProduct - total)
    const remainedProducts = products.filter((item) => id !== item.id)
    setProducts(remainedProducts)
  }

  const handleUpdateTransaction = async () => {
    setIsLoading(true)
    console.log({ totalPriceOfProduct })
    const transactions = [
      ...user.transactions,
      {
        ...(totalPriceOfProduct
          ? { amount: -totalPriceOfProduct, products }
          : { amount: +amount })
      }
    ]

    console.log({ transactions })

    const body = {
      transactions,
      remain: transactions.reduce((sum, item) => sum + item.amount, 0)
    }

    console.log({ body })

    // const res = await sendAuthenticatedRequest(`/${user._id}`, 'PATCH', body);

    // if (res.status === 'success') {
    //   setIsLoading(false);
    //   navigator.navigate('BorrowerDetail', { refresh: true, id: user._id });
    // }
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
    <LinearGradient
      start={[0, 0]}
      end={[1, 1]}
      colors={['#F2F2F2', '#DBDBDB']}
      style={{ flex: 1 }}
    >
      <SafeAreaView>
        <ScrollView>
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{ height: '100%', paddingBottom: 30 }}
          >
            <>
              <View
                style={{
                  padding: 10,
                  paddingRight: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <TouchableOpacity onPress={() => navigator.goBack()}>
                  <Entypo name="chevron-left" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                  {user.name}
                </Text>
              </View>
              {type !== 'recieve' && (
                <View style={{ padding: 20 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    Maxsulotlar
                  </Text>

                  {products?.length ? (
                    <View
                      style={{
                        ...styles.inputView,
                        ...styles.shadow,
                        paddingRight: 10,
                        marginTop: 10
                      }}
                    >
                      {products?.map((product) => (
                        <Product
                          key={product._id || product.id}
                          item={product}
                          setTotal={setTotalPriceOfProduct}
                          setProducts={setProducts}
                          removeProduct={removeProductHandler}
                        />
                      ))}
                    </View>
                  ) : (
                    ''
                  )}
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
                        Maxsulot qo'shish
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              <View
                style={{
                  padding: 20
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                  {type === 'recieve'
                    ? "To'lov summasi"
                    : 'Qarz berish summasi'}
                </Text>
                <View style={{ ...styles.inputView, ...styles.shadow }}>
                  {products?.[0]?.totalPrice ? (
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {new Intl.NumberFormat('en-US').format(
                        totalPriceOfProduct
                      )}
                    </Text>
                  ) : (
                    <NumberInput
                      style={styles.input}
                      onChange={setTotalPriceOfProduct}
                      changedValue={totalPriceOfProduct}
                      keyboardType="numeric"
                    />
                  )}
                </View>
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
                    style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}
                  >
                    {type === 'recieve'
                      ? "To'lovni qabul qilish"
                      : 'Qarz berish'}
                  </Text>
                </Pressable>
              </View>
            </>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
  inputView: {
    alignItems: 'start',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 25,
    width: '100%'
  },
  input: { fontSize: 20, width: '100%' },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  }
})
