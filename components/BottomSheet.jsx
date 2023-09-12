import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useRef, useMemo, useCallback } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet'

const BottomSheet = () => {
  const bottomSheetModalRef = useRef(null)

  const snapPoints = useMemo(() => ['25%', '50%', '75%'], [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index)
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Button title="Open Modal" onPress={handlePresentModalPress} />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <View>
              <Text>Hello</Text>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default BottomSheet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orangered'
  }
})
