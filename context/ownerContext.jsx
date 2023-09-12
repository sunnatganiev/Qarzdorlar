import React, { createContext, useEffect, useState } from 'react'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'

export const OwnerContext = createContext({
  isLoading: Boolean,
  users: Array,
  error: null
})

const initialState = {
  isLoading: false,
  users: [],
  error: null
}

export const OwnerProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const fetchUsers = async () => {
      setState((prev) => ({ ...prev, isLoading: true }))
      try {
        const data = await sendAuthenticatedRequest(
          '?remain[lt]=0&fields=name,phoneNumber,remain,address,reminder'
        )
        setState((prev) => ({ ...prev, users: data.data?.allDebts }))
      } catch (err) {
        console.error('Error fetching users:', err)
        setState((prev) => ({ ...prev, error: 'Error fetching users' }))
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    fetchUsers()
  }, [])

  return (
    <OwnerContext.Provider value={{ state, setState }}>
      {children}
    </OwnerContext.Provider>
  )
}
