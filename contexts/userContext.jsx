import React, { createContext, useEffect, useContext } from 'react'
import { useDebtUsers } from '../hooks/useDebtUsers'

export const UserContext = createContext({
  isLoading: Boolean,
  users: Array,
  error: String,
  searchUsers: (searchQuery) => null,
  fetchUsers: (fetchType) => null,
  LINK_TYPES: Object
})

export const useUserContext = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const { users, isLoading, error, fetchUsers, searchUsers, LINK_TYPES } =
    useDebtUsers()

  console.log({ users })

  useEffect(() => {
    fetchUsers(LINK_TYPES.ALL_USERS)
  }, [fetchUsers, LINK_TYPES.ALL_USERS])

  const value = {
    isLoading,
    users,
    error,
    searchUsers,
    fetchUsers,
    LINK_TYPES
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
