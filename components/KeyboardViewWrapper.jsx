import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  StatusBar
} from 'react-native'
import React from 'react'

const KeyboardViewWrapper = ({ children, style, ...otherProps }) => {
  return (
    <SafeAreaView style={{ height: '100%', ...style }}>
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default KeyboardViewWrapper

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
})
