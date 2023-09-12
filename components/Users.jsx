import { View, Text, Image, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext'

const Users = ({ item }) => {
  const { userId, setUserId } = useContext(UserType)

  const sendFollow = async (currentUserId, selectedUserId) => {
    try {
      const response = await getch(`${process.env.EXPO_PUBLIC_IP}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON
      })
    } catch (error) {
      console.log('error message, ', error)
    }
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: 'contain'
          }}
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/149/149071.png'
          }}
        />
        <Text style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>
          {item?.name}
        </Text>
        <Pressable
          onPress={() => sendFollow(userId, item._id)}
          style={{
            borderColor: '#d0d0d0',
            borderWidth: 1,
            padding: 10,
            marginLeft: 10,
            width: 100,
            borderRadius: 7
          }}
        >
          <Text
            style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}
          >
            Follow
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Users
