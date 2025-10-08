import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Profile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Este es el profile</Text>
    </View>
  );
};

export default Profile;

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
