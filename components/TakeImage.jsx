import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native'
import React, { useEffect, useState } from 'react'
import useTakePicture from '../hooks/useTakePicture'
import { FontAwesome } from '@expo/vector-icons'
import ImagePreview from './ImagePreview'

const TakeImage = ({ setImage }) => {
  const { image, isImgLoading, handleTakePicture } = useTakePicture()
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (image) {
      setImage(image)
    }
  }, [image, setImage])

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

  return (
    <View>
      {isImgLoading ? (
        <View style={styles.inputView}>
          <Text style={styles.label}>Rasm yuklanmoqda...</Text>
        </View>
      ) : (
        image && (
          <View style={styles.inputView}>
            <TouchableOpacity
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
            </TouchableOpacity>

            <ImagePreview
              visible={modalVisible}
              imageUrl={image}
              onClose={() => setModalVisible(false)}
            />
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
    </View>
  )
}

export default TakeImage

const styles = StyleSheet.create({
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
  float: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40
  },
  label: { fontSize: 20, fontWeight: 'bold' },
  image: { height: 400, width: '100%' }
})
