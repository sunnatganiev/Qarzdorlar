import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ArchiveScreen from './screens/ArchiveScreen'
import HomeScreen from './screens/HomeScreen'
import NewBorrowerScreen from './screens/NewBorrowerScreen'
import BorrowerDetail from './screens/BorrowerDetail'
import TransactionScreen from './screens/TransactionScreen'
import TransactionDetail from './screens/TransactionDetail'
import OTPScreen from './screens/OTPScreen'
import CameraScreen from './screens/CameraScreen'

const BottomTabs = () => {
  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Qarzdorlar',
          tabBarLabelStyle: {
            color: '#28b485',
            fontSize: 12,
            fontWeight: 'bold'
          },
          tabBarStyle: {
            borderTopWidth: 0,
            borderTopColor: '#d0d0d0'
          },
          headerShown: false,
          tabBarIcon({ focused }) {
            return focused ? (
              <Ionicons name="wallet" size={24} color="#28b485" />
            ) : (
              <Ionicons name="wallet-outline" size={24} color="#28b485" />
            )
          }
        }}
      />
      <Tab.Screen
        name="NewBorrower"
        component={NewBorrowerScreen}
        options={{
          tabBarLabel: "Qarzdor Qo'shish",
          tabBarLabelStyle: {
            color: '#28b485',
            fontSize: 12,
            fontWeight: 'bold'
          },
          headerShown: false,
          tabBarIcon({ focused }) {
            return focused ? (
              <AntDesign name="pluscircle" size={33} color="#28b485" />
            ) : (
              <AntDesign name="pluscircleo" size={33} color="#28b485" />
            )
          }
        }}
      />

      <Tab.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{
          tabBarLabel: 'Arxiv',
          tabBarLabelStyle: {
            color: '#28b485',
            fontSize: 12,
            fontWeight: 'bold'
          },
          tabBarStyle: { color: 'black' },
          headerShown: false,
          tabBarIcon({ focused }) {
            return focused ? (
              <MaterialCommunityIcons
                name="archive"
                size={24}
                color="#28b485"
              />
            ) : (
              <MaterialCommunityIcons
                name="archive-outline"
                size={24}
                color="#28b485"
              />
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

const StackNavigator = () => {
  const Stack = createNativeStackNavigator()

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
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BorrowerDetail"
          component={BorrowerDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransactionScreen"
          component={TransactionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransactionDetail"
          component={TransactionDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator
