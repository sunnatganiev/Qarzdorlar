import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import ArchiveScreen from './screens/ArchiveScreen'
import HomeScreen from './screens/HomeScreen'
import NewBorrowerScreen from './screens/NewBorrowerScreen'
import BorrowerDetail from './screens/BorrowerDetail'
import TransactionScreen from './screens/TransactionScreen'
import TransactionDetail from './screens/TransactionDetail'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DelayedBorrowersScreen from './screens/DelayedBorrowersScreen'
import TabHeader from './components/TabHeader'
import PaymentScreen from './screens/PaymentScreen'
import { FontAwesome } from '@expo/vector-icons'
import { UserProvider } from './contexts/userContext'
import DrawerHeader from './components/DrawerHeder'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

const BottomTabs = () => {
  const getTabBarIcon = (route, focused) => {
    let iconName

    if (route.name === 'HomeScreen') {
      iconName = focused ? 'wallet' : 'wallet-outline'
    } else if (route.name === 'NewBorrower') {
      iconName = focused ? 'add-circle' : 'add-circle-outline'
    } else if (route.name === 'Delayed') {
      iconName = focused ? 'time' : 'time-outline'
    }

    return <Ionicons name={iconName} size={focused ? 40 : 30} color="#28b485" />
  }

  const getHeader = () => <TabHeader />

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabBarIcon(route, focused),
        tabBarLabelStyle: {
          color: '#28b485',
          fontSize: 12,
          fontWeight: 'bold'
        },
        tabBarStyle: {
          backgroundColor: '#eef2f3',
          borderTopWidth: 0,
          height: 60
        },
        headerTransparent: true,
        header: () => getHeader()
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ tabBarLabel: 'Qarzdorlar' }}
      />
      <Tab.Screen
        name="NewBorrower"
        component={NewBorrowerScreen}
        options={{ tabBarLabel: "Qarzdor Qo'shish" }}
      />
      <Tab.Screen
        name="Delayed"
        component={DelayedBorrowersScreen}
        options={{ tabBarLabel: 'Kechikganlar' }}
      />
    </Tab.Navigator>
  )
}

const StackGroup = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BorrowerDetail"
        component={BorrowerDetail}
        options={{
          headerShown: false,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="TransactionScreen"
        component={TransactionScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetail}
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack.Navigator>
  )
}

export function Drawers() {
  const getTabBarIcon = (route, focused) => {
    let iconName

    if (route.name === 'Asosiy sahifa') {
      iconName = 'home'
    } else if (route.name === 'Arxiv') {
      iconName = 'archive'
    } else if (route.name === "To'lov") {
      iconName = 'money'
    }

    return (
      <FontAwesome name={iconName} size={focused ? 35 : 25} color="#28b485" />
    )
  }

  const getHeader = () => <DrawerHeader />

  return (
    <UserProvider>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused }) => getTabBarIcon(route, focused),
          drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 16,
            color: '#28b485'
          },
          header: () => getHeader(),
          headerTransparent: true
        })}
      >
        <Drawer.Screen name="Asosiy sahifa" component={StackGroup} />
        <Drawer.Screen name="Arxiv" component={ArchiveScreen} />
        <Drawer.Screen name="To'lov" component={PaymentScreen} />
      </Drawer.Navigator>
    </UserProvider>
  )
}
