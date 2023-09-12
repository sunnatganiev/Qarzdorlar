import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
// import { blobToURL, fromBlob, urlToBlob } from 'image-resize-compress'

// Initialize Firebase (for Firebase Storage)

// console.log({ env: process.env })
// const firebaseConfig = {
//   apiKey: process.env.EXPO_FIREBASE_API_KEY,
//   authDomain: process.env.EXPO_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.EXPO_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.EXPO_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_FIREBASE_APP_ID
// }

const firebaseConfig = {
  apiKey: 'AIzaSyDehSSKdi-1CUSHUAL1uwwHu_rSmW3LUTI',
  authDomain: 'qarzdorlar-dbf07.firebaseapp.com',
  projectId: 'qarzdorlar-dbf07',
  storageBucket: 'qarzdorlar-dbf07.appspot.com',
  messagingSenderId: '107834105923',
  appId: '1:107834105923:web:382726c1176e2c0a2db4f6'
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
export const db = getFirestore(app)

export async function uploadImageAsync(uri) {
  try {
    const response = await fetch(uri)

    if (response.ok) {
      const blob = await response.blob()

      const storageRef = ref(
        storage,
        `images/${Date.now()}${response._bodyBlob._data.name}`
      )

      await uploadBytes(storageRef, blob)

      const imageUrl = await getDownloadURL(storageRef)
      // console.log({ imageUrl })
      return imageUrl
    }
  } catch (error) {
    console.error('Error uploading image: ', error)
    return null
  }
}

export async function deleteImageFromStorage(imageUrl) {
  try {
    // Create a reference to the image file using the URL
    const imageRef = ref(getStorage(), imageUrl)

    // Delete the image file
    await deleteObject(imageRef)

    console.log('Image deleted successfully')
  } catch (error) {
    console.error('Error deleting image: ', error)
  }
}
