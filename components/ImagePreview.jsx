import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Text
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

const ImagePreview = ({ visible, imageUrl, onClose }) => {
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
  }
})
