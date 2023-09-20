import { TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useUserContext } from '../contexts/userContext'

const useSort = () => {
  const { users } = useUserContext()
  const [sorted, setSorted] = useState(false)
  const [sortedUsers, setSortedUsers] = useState(users)

  useEffect(() => {
    setSortedUsers(users)
  }, [users])

  const handleSort = () => {
    if (!sorted) {
      const updatedUsers = [...users].sort((a, b) => a.remain - b.remain)
      setSortedUsers(updatedUsers)
      setSorted(true)
    } else {
      setSortedUsers([...users])
      setSorted(false)
    }
  }

  const Sort = ({ color = '#fff' }) => (
    <TouchableOpacity onPress={handleSort} style={{ padding: 10 }}>
      {sorted ? (
        <FontAwesome name="sort-numeric-desc" size={24} color="white" />
      ) : (
        <MaterialCommunityIcons
          name="sort-calendar-ascending"
          size={24}
          color={color}
        />
      )}
    </TouchableOpacity>
  )

  return {
    Sort,
    sortedUsers,
    setSorted
  }
}

export default useSort
