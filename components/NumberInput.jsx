import { TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'

const NumberInput = ({ changedValue, onChange, ...props }) => {
  const [number, setNumber] = useState('')

  // Format the number with grouping separator
  const formattedNumber = new Intl.NumberFormat('en-US').format(+number)

  useEffect(() => {
    setNumber(changedValue || '')
  }, [changedValue])

  const handleNumberChange = (text) => {
    // Remove commas to store the numeric value
    const numericValue = text.replaceAll(',', '')
    setNumber(numericValue)
    onChange(numericValue)
  }

  return (
    <TextInput
      {...props}
      value={formattedNumber || ''}
      onChangeText={handleNumberChange}
    />
  )
}

export default NumberInput
