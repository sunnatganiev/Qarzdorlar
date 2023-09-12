import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons'

const Button = ({ title, onPress, icon, iconSize, color, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Entypo
        name={icon}
        size={iconSize ? iconSize : 28}
        color={color ? color : '#f1f1f1'}
      />
      {title && <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#f1f1f1',
    marginLeft: 10
  }
})
