import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import ImagePreview from '../components/ImagePreview'
import { Ionicons } from '@expo/vector-icons'

const TransactionDetail = ({ route }) => {
  const [imgVisible, setImgVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const handleCloseImagePreview = () => setModalVisible(false)
  const navigation = useNavigation()
  const { transaction } = route.params

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
        <ScrollView>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 2
                    }}
                  >
                    {transaction.products.length
                      ? 'Men qarz berganman'
                      : 'Men olganman'}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {moment(transaction.time).format('DD.MM.YYYY')}
                  </Text>
                </View>
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
            <View style={styles.inputView}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
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

          {transaction.imageUrl && !imgVisible && (
            <View style={styles.btnWrapper}>
              <TouchableOpacity
                style={styles.btnView}
                onPress={() => setImgVisible(true)}
              >
                <Text style={styles.btnText}>Rasmni ko&apos;rish</Text>
              </TouchableOpacity>
            </View>
          )}

          {imgVisible && (
            <View style={styles.inputView}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.image}
              >
                <Image
                  source={{ uri: transaction.imageUrl }}
                  style={{ flex: 1, borderRadius: 8 }}
                  onError={(error) =>
                    console.error('Image loading error:', error)
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <ImagePreview
        visible={modalVisible}
        imageUrl={transaction.imageUrl}
        onClose={handleCloseImagePreview}
      />
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
    backgroundColor: 'rgba(238, 230, 230, 0.5)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '48%'
  },
  inputView: {
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  image: { height: 400, width: '100%', borderRadius: 8 },
  btnWrapper: { alignItems: 'center', marginTop: 30 },
  btnView: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 100,
    backgroundColor: '#28b485',
    width: 200
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  }
})
