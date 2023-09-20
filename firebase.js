import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
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

      return imageUrl
    }
  } catch (error) {
    return null
  }
}

export async function deleteImageFromStorage(imageUrl) {
  // Create a reference to the image file using the URL
  const imageRef = ref(getStorage(), imageUrl)

  // Delete the image file
  await deleteObject(imageRef)
}
