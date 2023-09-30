import { View, Text, StyleSheet, Pressable } from 'react-native'

import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'

const HistoryItem = ({ transaction: { time, amount }, transaction, user }) => {
  const navigator = useNavigation()

  return (
    <Pressable
      onPress={() =>
        navigator.navigate('TransactionDetail', { transaction, user })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#d0d0d0',
        borderStyle: 'solid',
        paddingVertical: 20
      }}
    >
      <View
        style={{
          ...styles.iconBox,
          marginRight: 13,
          width: 40,
          height: 40
        }}
      >
        {amount < 0 ? (
          <MaterialCommunityIcons
            name="database-arrow-up"
            size={24}
            color="#f7797d"
          />
        ) : (
          <MaterialCommunityIcons
            name="database-arrow-down"
            size={24}
            color="#28b485"
          />
        )}
      </View>
      <View>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: '#979090',
            marginBottom: 3
          }}
        >
          {moment(time).format('DD.MM.YYYY')}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
          {amount < 0 ? 'Berilgan' : 'Olingan'}
        </Text>
      </View>
      <View style={{ marginLeft: 'auto' }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: amount < 0 ? '#ff5630' : '#28b485',
            fontSize: 16
          }}
        >
          {new Intl.NumberFormat('en-US').format(amount)} so&apos;m
        </Text>
      </View>
    </Pressable>
  )
}

export default HistoryItem

const styles = StyleSheet.create({
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#ece8e8',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
