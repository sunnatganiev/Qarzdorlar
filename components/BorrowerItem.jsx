import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const BorrowerItem = ({ item, archive }) => {
  const navigator = useNavigation()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigator.navigate('BorrowerDetail', {
          id: item._id,
          type: item.type,
          archive
        })
      }
    >
      <View style={styles.heading}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.secondaryText}>+998 {item.phoneNumber}</Text>
        <Text style={styles.secondaryText}>({item.address})</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {new Intl.NumberFormat('en-US').format(item.remain)} so&apos;m
        </Text>
        <Ionicons name="chevron-forward" size={24} color="#28b485" />
      </View>
    </TouchableOpacity>
  )
}

export default BorrowerItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0'
  },
  heading: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 18 },
  secondaryText: { fontSize: 13, color: '#878383' },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  price: { color: '#28b485', fontWeight: 'bold' }
})
