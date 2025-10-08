import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const History: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Este es el historial de entrenamientos</Text>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  }
});
