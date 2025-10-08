import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Routines: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estas son las rutinas
    
      </Text>
    </View>
  );
};

export default Routines;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: 20
  }
});
