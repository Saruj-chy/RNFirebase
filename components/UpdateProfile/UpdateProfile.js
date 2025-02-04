/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import profile from '../Images/authen.jpg';
import firestore from '@react-native-firebase/firestore';
var SharedPreferences = require('react-native-shared-preferences');

import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';

const UpdateProfile = ({navigation, route}) => {
  const [uid, setUid] = useState('');
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [filePath, setFilePath] = useState({});

  useEffect(() => {
    SharedPreferences.getItem('uid', function (value) {
      setUid(value);

      firestore()
        .collection('Users')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.id == value) {
              setLoading(false);
              setName(documentSnapshot.data().name);
              setEmail(documentSnapshot.data().email);
              setPassword(documentSnapshot.data().password);
              setAddress(documentSnapshot.data().address);
              setDate(documentSnapshot.data().date_of_birth);
            }
          });
        });
    });
  }, []);

  const _onGetFirestoreData = () => {
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id == uid) {
            setLoading(false);
            setName(documentSnapshot.data().name);
            setEmail(documentSnapshot.data().email);
            setPassword(documentSnapshot.data().password);
            setAddress(documentSnapshot.data().address);
            setDate(documentSnapshot.data().date_of_birth);
          }
        });
      });
  };

  const _onUpdateProfile = () => {
    setUpdate(true);
  };
  const _onProfileSaved = () => {
    if (name && email && password) {
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          name: name,
          email: email,
          password: password,
          address: address,
          date_of_birth: date,
        })
        .then(() => {
          Alert.alert(
            'Success',
            'Updated Successfully',
            [
              {
                text: 'Ok',
                onPress: () => setUpdate(false),
              },
            ],
            {cancelable: false},
          );
        })
        .catch(error => {
          Alert.alert(
            'Exception',
            error,
            [
              {
                text: 'Ok',
                onPress: () => setUpdate(false),
              },
            ],
            {cancelable: false},
          );
        });
    } else {
      alert('Please fill all fields');
    }
  };
  const _onCancel = () => {
    _onGetFirestoreData();
    setUpdate(false);
  };
  const _onLogout = () => {
    navigation.navigate('register');
  };

  const _selectProfile = async () => {
    try {
      const fileDetails = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setFilePath(fileDetails);
    } catch (error) {
      setFilePath({});
    }
  };

  React.useEffect(() => {
    const backAction = () => {
      if (update) {
        setUpdate(false);
      } else {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        {!update ? (
          <View style={styles.container}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity onPress={_selectProfile}>
                {filePath.length == 1 ? (
                  <Image
                    style={styles.tinyLogo}
                    source={{uri: filePath[0].uri}}
                  />
                ) : (
                  <Image style={styles.tinyLogo} source={profile} />
                )}
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={{marginVertical: 50}}
              />
            ) : (
              <View style={{marginLeft: 30, marginTop: 50}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Text style={{fontSize: 16, color: 'white', width: 90}}>
                    Name:{' '}
                  </Text>
                  <Text style={{fontSize: 25, color: 'white'}}> {name} </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Text style={{fontSize: 16, color: 'white', width: 90}}>
                    Email{' '}
                  </Text>
                  <Text style={{fontSize: 25, color: 'white'}}> {email} </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Text style={{fontSize: 16, color: 'white', width: 90}}>
                    Password{' '}
                  </Text>
                  <Text style={{fontSize: 22, color: 'white'}}>
                    {' '}
                    {password}{' '}
                  </Text>
                </View>
                {address != null && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <Text style={{fontSize: 16, color: 'white', width: 90}}>
                      Address{' '}
                    </Text>
                    <Text style={{fontSize: 22, color: 'white'}}>
                      {' '}
                      {address}{' '}
                    </Text>
                  </View>
                )}
                {date != null && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <Text style={{fontSize: 16, color: 'white', width: 90}}>
                      Date of Birth{' '}
                    </Text>
                    <Text style={{fontSize: 22, color: 'white'}}> {date} </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.view2}>
              <Text
                onPress={_onLogout}
                style={{
                  backgroundColor: '#ffccff',
                  color: 'black',
                  padding: 10,
                }}>
                Log Out
              </Text>

              <Text
                style={{
                  backgroundColor: '#ffccff',
                  color: 'black',
                  padding: 10,
                  paddingHorizontal: 20,
                }}
                onPress={_onUpdateProfile}>
                Update
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image style={styles.tinyLogo} source={profile} />
            </View>
            <View style={{marginLeft: 30, marginTop: 20}}></View>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email Address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Password"
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Date of Birth"
              value={date}
              onChangeText={setDate}
            />
            <View style={styles.view2}>
              <Text
                onPress={_onCancel}
                style={{
                  backgroundColor: '#ffccff',
                  color: 'black',
                  padding: 10,
                }}>
                Cancel
              </Text>

              <Text
                style={{
                  backgroundColor: '#ffccff',
                  color: 'black',
                  padding: 10,
                  paddingHorizontal: 20,
                }}
                onPress={_onProfileSaved}>
                Save
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'brown',
    justifyContent: 'center',
    // alignItems: 'center',
  },

  tinyLogo: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 100,
  },

  view2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // borderWidth: 1,
    justifyContent: 'space-between',
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },

  input: {
    height: 40,
    margin: 12,
    paddingLeft: 15,

    borderWidth: 1,
    backgroundColor: 'white',
    color: 'blue',
  },
});

export default UpdateProfile;
