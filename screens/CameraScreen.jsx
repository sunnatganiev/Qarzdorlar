// import { View, Text, StyleSheet, Image, Platform } from 'react-native'
// import React, { useState, useEffect, useRef } from 'react'
// import { Camera, CameraType } from 'expo-camera'
// import * as ImagePicker from 'expo-image-picker'

// import * as MediaLibrary from 'expo-media-library'
// import Button from '../components/Button'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useNavigation } from '@react-navigation/native'
// import { uploadImageAsync } from '../firebase'

// const CameraScreen = () => {
//   const [hasCameraPersmission, setHasCameraPersmission] = useState(null)
//   const [image, setImage] = useState(null)
//   const [type, setType] = useState(Camera.Constants.Type.back)
//   const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
//   const cameraRef = useRef(null)
//   const navigation = useNavigation()

//   useEffect(() => {
//     const cameraPermit = async () => {
//       MediaLibrary.requestPermissionsAsync()
//       const cameraStatus = await Camera.requestCameraPermissionsAsync()
//       setHasCameraPersmission(cameraStatus.status === 'granted')
//     }

//     cameraPermit()
//   }, [])

//   const takePicture = async () => {
//     // if (cameraRef) {
//     //   try {
//     //     const data = await cameraRef.current.takePictureAsync()
//     //     setImage(data.uri)
//     //   } catch (err) {
//     //     console.log(err)
//     //   }
//     // }

//     let pickerResult = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [16, 9]
//     })

//     console.log(pickerResult)
//   }

//   const saveImage = async () => {
//     if (image) {
//       try {
//         console.log('TEst')
//         // await MediaLibrary.createAssetAsync(image)
//         const imageUri = await uploadImageAsync(image)
//         navigation.navigate('NewBorrower', { imageUri })
//         setImage(null)
//       } catch (err) {
//         console.log(err)
//       }
//     }
//   }

//   if (!hasCameraPersmission) {
//     return <Text>No access to camera</Text>
//   }

//   return (
//     <SafeAreaView style={styles.cameraContainer}>
//       {!image ? (
//         <>
//           <View style={styles.header}>
//             <Button
//               icon="flash"
//               style={flash === Camera.Constants.FlashMode.off && styles.btn}
//               color={flash !== Camera.Constants.FlashMode.off && '#ff7730'}
//               onPress={() =>
//                 setFlash(
//                   flash === Camera.Constants.FlashMode.off
//                     ? Camera.Constants.FlashMode.on
//                     : Camera.Constants.FlashMode.off
//                 )
//               }
//             />
//           </View>
//           <Camera
//             style={styles.camera}
//             type={type}
//             flashMode={flash}
//             ref={cameraRef}
//             ratio={Platform.OS === 'android' && '16:9'}
//           />
//           <View>
//             <Button
//               icon="controller-record"
//               iconSize={100}
//               onPress={takePicture}
//             />
//           </View>
//         </>
//       ) : (
//         <View style={styles.display}>
//           <Image source={{ uri: image }} style={styles.image} />
//           <View style={styles.displayFooter}>
//             <Button
//               title="Qayta urunish"
//               iconSize={24}
//               icon="retweet"
//               onPress={() => setImage(null)}
//             />
//             <Button
//               title="Saqlash"
//               iconSize={24}
//               icon="save"
//               onPress={saveImage}
//             />
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   )
// }

// export default CameraScreen

// const styles = StyleSheet.create({
//   cameraContainer: {
//     flex: 1,
//     backgroundColor: '#000'
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingLeft: 20,
//     paddingBottom: 20
//   },
//   btn: {
//     borderStyle: 'solid',
//     borderColor: Camera.Constants.FlashMode.off !== 'off' ? '#fff' : '#ff7730',
//     borderWidth: 2,
//     borderRadius: 100
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//     justifyContent: 'flex-end',
//     paddingBottom: 20
//   },
//   display: {
//     flex: 1,
//     backgroundColor: '#000',
//     alignItems: 'center'
//   },
//   displayFooter: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     paddingHorizontal: 30
//   },
//   image: { flex: 1, width: '100%' }
// })
