import { View, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'

const Spinner = () => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default Spinner

const styles = StyleSheet.create({
  spinnerContainer: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
