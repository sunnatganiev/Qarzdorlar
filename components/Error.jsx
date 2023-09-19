import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Error = ({ error }) => {
  return (
    <View style={styles.error}>
      <Text style={styles.errorTitle}>{error}</Text>
    </View>
  )
}

export default Error

const styles = StyleSheet.create({
  error: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
    width: '100%',
    paddingHorizontal: 30
  },
  errorTitle: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})
