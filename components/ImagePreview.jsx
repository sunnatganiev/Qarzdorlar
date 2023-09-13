import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Share
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Ionicons } from '@expo/vector-icons'

const ImagePreview = ({ visible, imageUrl, onClose }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this image:',
        url: imageUrl
      })
    } catch (error) {
      console.error('Error sharing image:', error.message)
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <ImageViewer
          imageUrls={[{ url: imageUrl }]}
          enableSwipeDown={true}
          onSwipeDown={onClose}
          index={0} // Index of the initially displayed image
          renderIndicator={() => null}
        />
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>
            <Ionicons name="share-outline" size={24} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default ImagePreview

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16
  }
})
