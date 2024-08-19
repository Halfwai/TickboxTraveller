// This file contains some generic components that are used in the app, a custom button and a custom text input

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';

export const CustomButton = (props) => (
  <TouchableOpacity
    {...props}
    style={[
      styles.customButton,
      props.style,
      props.disabled && styles.disabledButton,
    ]}
    {...props.attributes}
    onPress={props.action}
    disabled={props.disabled}>
    <Text style={styles.customButtonText}>{props.text}</Text>
  </TouchableOpacity>
);

export const Input = (props) => (
  <View style={[styles.inputContainer, { backgroundColor: props.color }]}>
    <Text>{props.title}</Text>
    <TextInput
      onChangeText={(text) => {
        props.onChange(text);
      }}
      value={props.value}
      style={styles.input}
      selectionColor={'black'}
      placeholder={props.placeholder && props.placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: '#51A6F5',
    width: '100%',
    height: 40,
    color: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  customButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'lightgray',
    height: 50,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    fontSize: 15,
    width: '70%',
    borderRadius: 10,
  },
});