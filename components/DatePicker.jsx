import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

const DatePicker = ({ selectedDate, onDateChange }) => {
  const [show, setShow] = useState(false)
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + 3)

  const showDatepicker = () => {
    if (Platform.OS === 'ios') {
      return setShow(!show)
    }
    setShow(true)
  }

  const handleDateChange = (event, selectedDay) => {
    if (Platform.OS === 'android') {
      setShow(false)
    }

    if (selectedDay) {
      onDateChange(selectedDay)
    }
  }

  return (
    <View style={styles.inputView}>
      <Text style={styles.reminderTitle}>Eslatma vaqtini tanlang</Text>
      <TouchableOpacity onPress={showDatepicker} style={styles.reminderView}>
        <Text style={styles.reminderText}>
          {moment(selectedDate).format('DD.MM.YY')}
        </Text>
      </TouchableOpacity>

      {show && (
        <RNDateTimePicker
          testID="dateTimePicker"
          display="spinner"
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
          minimumDate={currentDate}
          locale="uz-UZ"
          textColor="black"
          positiveButton={{ label: 'OK', textColor: 'green' }}
        />
      )}
    </View>
  )
}

export default DatePicker

const styles = StyleSheet.create({
  inputView: {
    alignItems: 'start',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 25,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3
  },
  reminderView: {
    width: '100%',
    backgroundColor: '#55c57a',
    borderRadius: 12,
    marginVertical: 10
  },
  reminderText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 10
  },
  reminderTitle: { fontSize: 20, fontWeight: 'bold' }
})
