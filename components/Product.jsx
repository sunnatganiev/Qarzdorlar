import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import NumberInput from './NumberInput'
import KeyboardViewWrapper from './KeyboardViewWrapper'

const Product = ({ product: initialProduct, setProducts, removeProduct }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [product, setProduct] = useState(initialProduct)
  const [totalPrice, setTotalPrice] = useState(0)
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  const handleRemoveProduct = () => {
    Alert.alert("Maxsulotni o'chirmoqchimisiz?", '', [
      {
        text: "Yo'q",
        style: 'cancel'
      },
      {
        text: 'Ha',
        onPress: () => {
          removeProduct(product._id || product.id, totalPrice)
        },
        style: 'default'
      }
    ])
  }

  useEffect(() => {
    if (price >= 1) {
      if (quantity === 1 || !Number(quantity)) {
        setTotalPrice(price)
        return
      } else {
        setTotalPrice(() => {
          const total = +price * +quantity
          return total
        })
      }
    }
  }, [price, quantity])

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }

  const handleAddProduct = () => {
    setIsExpanded(false)

    setProducts({ ...product, price, quantity, totalPrice })
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      <View style={styles.inputView}>
        <TouchableOpacity
          onPress={toggleAccordion}
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <Text style={styles.accordionTitle}>
            {product.name || 'Maxsulot yasash'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'flex-end'
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                marginRight: 10,
                color: '#28b485'
              }}
            >
              {new Intl.NumberFormat('en-US').format(totalPrice)}
            </Text>
            {isExpanded ? (
              <Entypo name="chevron-up" size={24} color="black" />
            ) : (
              <Entypo name="chevron-down" size={24} color="black" />
            )}
          </View>
        </TouchableOpacity>
        {isExpanded ? (
          <View
            style={{
              marginTop: 10,
              width: '100%',
              gap: 10
            }}
          >
            <Text style={styles.label}>Nomi</Text>
            <View style={styles.accordion}>
              <TextInput
                value={product.name}
                onChangeText={(text) => setProduct({ ...product, name: text })}
                placeholderTextColor={'gray'}
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Narxi</Text>
            <View style={styles.accordion}>
              <NumberInput
                placeholderTextColor={'gray'}
                style={styles.input}
                keyboardType="numeric"
                onChange={(text) => setPrice(text || 1)}
                changedValue={price}
              />
            </View>

            <Text style={styles.label}>Miqdori</Text>
            <View style={styles.accordion}>
              <TextInput
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                style={styles.input}
                value={`${quantity}`}
                onChangeText={(text) => setQuantity(text)}
              />
            </View>
            <View
              style={{
                backgroundColor: '#55c57a',
                borderRadius: 100,
                paddingHorizontal: 10,
                alignSelf: 'flex-end'
              }}
            >
              <Pressable
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  zIndex: 20
                }}
                onPress={handleAddProduct}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Qo&apos;shish
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
      <Pressable onPress={handleRemoveProduct}>
        <Feather name="trash-2" size={24} color="#e93535" />
      </Pressable>
    </View>
  )
}

export default Product

const styles = StyleSheet.create({
  inputView: {
    alignItems: 'start',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    width: '90%'
  },
  accordion: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d0d0d0',
    padding: 10,
    borderRadius: 8
  },
  accordionTitle: {
    fontSize: 20,
    width: '40%'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  input: { fontSize: 20, width: '100%' }
})
