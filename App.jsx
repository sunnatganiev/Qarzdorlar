// import React, { useEffect, useState } from 'react'
// import { NavigationContainer } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import { UserProvider } from './contexts/userContext'
// import RegisterScreen from './screens/RegisterScreen'
// import LoginScreen from './screens/LoginScreen'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { Drawers } from './Navigation'
// import OTPScreen from './screens/OTPScreen'

// const Stack = createNativeStackNavigator()

// const App = () => {
//   const [hasToken, setHasToken] = useState(false)

//   useEffect(() => {
//     // Check if the user has a token (logged in)
//     AsyncStorage.getItem('authToken')
//       .then((token) => {
//         if (token) {
//           // User has a token
//           setHasToken(token)
//         } else {
//           // User doesn't have a token
//           setHasToken(false)
//         }
//       })
//       .catch((error) => {
//         console.error('Error checking token:', error)
//         setHasToken(false)
//       })
//   }, [])

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Register"
//           component={RegisterScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="OTPScreen"
//           component={OTPScreen}
//           options={{ headerShown: false }}
//         />
//         <UserProvider>
//           <Stack.Screen
//             name="Main"
//             component={Drawers}
//             options={{ headerShown: false }}
//           />
//         </UserProvider>
//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }

// export default App

import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { UserProvider } from './contexts/userContext'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Drawers } from './Navigation'
import OTPScreen from './screens/OTPScreen'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={Drawers}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
