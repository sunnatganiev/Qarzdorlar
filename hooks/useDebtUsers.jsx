import { useState, useCallback, useMemo } from 'react'
import { sendAuthenticatedRequest } from '../helpers/sendRequest'
import { debounce } from 'lodash'

export const useDebtUsers = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])

  const LINK_TYPES = useMemo(() => {
    return {
      ALL_USERS: 'allUsers',
      ARCHIVE: 'archive',
      DELAYED: 'delayed'
    }
  }, [])

  const fetchUsers = useCallback(
    async (url) => {
      setIsLoading(true)
      const { ALL_USERS, ARCHIVE, DELAYED } = LINK_TYPES
      try {
        let link
        if (url === ALL_USERS) {
          console.log('All Users fetched')
          link = '?remain[lt]=0'
        } else if (url === ARCHIVE) {
          link = '?remain[eq]=0'
        } else if (url === DELAYED) {
          link = '/expired'
        }

        const data = await sendAuthenticatedRequest(link)
        setError('')
        setUsers(data.data?.users)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [LINK_TYPES]
  )

  const debouncedSearchFunc = debounce(async (query) => {
    setIsLoading(true)
    const type = Object.keys(query)[0]

    if (query[type] === '') {
      return fetchUsers(type)
    }

    try {
      const { ALL_USERS, ARCHIVE, DELAYED } = LINK_TYPES
      let link
      if (query[ALL_USERS]) {
        link = `/search?search=${query[ALL_USERS]}`
      } else if (query[ARCHIVE]) {
        link = `/search?search=${query[ARCHIVE]}&remain=0`
      } else if (query[DELAYED]) {
        link = `/expired?search=${query[DELAYED]}`
      }

      const res = await sendAuthenticatedRequest(link)

      if (res.status === 'success') {
        setUsers(res.data.users)
        setError('')
      } else if (res.status === 'fail') {
        setError(res.message)
      }
    } catch (err) {
      setError(err.message)
    }
    setIsLoading(false)
  }, 700)

  const searchUsers = (searchQuery) => {
    debouncedSearchFunc(searchQuery)
  }

  return { users, isLoading, error, fetchUsers, searchUsers, LINK_TYPES }
}
