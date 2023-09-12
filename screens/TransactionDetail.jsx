import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const TransactionDetail = ({ route }) => {
  const { user, transaction } = route.params
  const navigator = useNavigation()

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 1]}
      colors={
        transaction.amount < 0 ? ['#ffb900', '#ff7730'] : ['#7ed56f', '#28b485']
      }
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 20
            }}
          >
            <View>
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}
              >
                {transaction.products.length
                  ? 'Men qarz berganman'
                  : 'Men olganman'}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {moment(transaction.time).format('DD.MM.YYYY')}
              </Text>
            </View>
            <View
              style={{
                ...styles.iconBox,
                marginRight: 13,
                width: 40,
                height: 40
              }}
            >
              {transaction.products.length ? (
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
          </View>
          <View style={{ padding: 20, paddingTop: 0 }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '900',
                color: '#2c2c2c'
              }}
            >
              {new Intl.NumberFormat('en-US').format(transaction.amount)} SO'M
            </Text>
          </View>
        </View>

        {transaction.products.length !== 0 && (
          <View
            style={{
              backgroundColor: '#fff',
              paddingTop: 10,
              borderRadius: 20,
              paddingHorizontal: 20,
              flex: 1,
              marginBottom: 40,
              marginHorizontal: 20
            }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}
            >
              Maxsulotlar
            </Text>
            <ScrollView>
              {transaction.products.map((item) => (
                <View
                  key={item._id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 20,
                    borderBottomColor: '#d0d0d0',
                    borderBottomWidth: 1,
                    borderStyle: 'solid'
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#f7797d'
                    }}
                  >
                    -{new Intl.NumberFormat('en-US').format(item.totalPrice)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View
          style={{
            marginTop: 'auto',
            marginHorizontal: 20,
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}
        >
          {/* <Pressable style={styles.iconWrapper}>
            <FontAwesome name="trash" size={35} color="red" />
            <Text style={{ fontSize: 16, fontWeight: '700', color: 'red' }}>
              O'chirish
            </Text>
          </Pressable> */}
          {/* <Pressable
            style={styles.iconWrapper}
            onPress={() =>
              navigator.navigate('TransactionScreen', {
                user,
                transaction,
                ...(transaction.products.length === 0
                  ? { type: 'recieve' }
                  : null),
              })
            }
          >
            <Entypo name="edit" size={35} color="black" />
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
              O'zgartirish
            </Text>
          </Pressable> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default TransactionDetail

const styles = StyleSheet.create({
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#ece8e8',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrapper: {
    // flex: 1,
    backgroundColor: 'rgba(238, 230, 230, 0.5)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '48%'
  }
})
