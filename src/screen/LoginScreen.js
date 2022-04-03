import React, { useState, useEffect } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Alert,
} from 'react-native'
import Colors from '../constant/Colors';
import { CommonStore } from '../../store/CommonStore';
import { v4 as uuidv4 } from 'uuid';

//Firebase
import { authentication, db } from '../../constants/key';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, onSnapshot, setDoc, doc } from 'firebase/firestore';

const LoginScreen = () => {

//Login
const [userEmail, setUserEmail] = useState('');
const [userPassword, setUserPassword] = useState('');

//Register
const [regName, setRegName] = useState('');
const [regEmail, setRegEmail] = useState('');
const [regPassword, setRegPassword] = useState('');
const [regRepeatPassword, setRegRepeatPassword] = useState('');
const [regContactNo, setRegContactNo] = useState('');

//Common Store
const userList = CommonStore.useState(s => s.userList);
const userID = CommonStore.useState(s => s.userID);
const userSelected = CommonStore.useState(s => s.userSelected);
const userType = CommonStore.useState(s => s.userType);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
const userSelectedID = CommonStore.useState(s => s.userSelectedID);
const serviceList = CommonStore.useState(s => s.serviceList);
const sellerServiceList = CommonStore.useState(s => s.sellerServiceList);

//
const [userListTemp, setUserListTemp] = useState([]);
const [serviceListTemp, setServiceListTemp] = useState([]);
const [isRegisterScreen, setIsRegisterScreen] = useState(false);

const que = query(collection(db, "User"));
const getUsersInfo = onSnapshot(que, (querySnapshot) => {
  const usersInfoTemp = [];
  querySnapshot.forEach((doc) => {
    usersInfoTemp.push(doc.data());
  });
  setUserListTemp(usersInfoTemp);
})

useEffect(() => {
  getUsersInfo();
},[])

useEffect(() => {
  CommonStore.update(s => { s.userList = userListTemp })
},[userListTemp]);


const registerUserAcc = async () => {
    if (regPassword == regRepeatPassword) {
        await createUserWithEmailAndPassword(authentication, regEmail, regPassword)
            .then(async (credentials) => {
                // try {
                  var body = {
                    uniqueID: credentials.user.uid,
                    userImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png',
                    userName: regName,
                    storeName: regName,
                    userEmail: regEmail,
                    contactNo: regContactNo,
                    storeContactNo: '',
                    storeAddress: '',
                    walletAmount: 0,
                    storeWallet: 0,
                    createdAt: Date.now(),
                    isActive: true,
                  }
                  await setDoc(doc(db, 'User', credentials.user.uid), body)
                  console.log('Successfully Added')
                //   CommonStore.update(s => {
                //     s.userID = credentials.user.uid;
                //     s.userSelected = body;
                // });
                // } catch (error) {
                //     alert(error)
                // }
            })
            .catch((re) => {
                console.log(re);
            })
        Alert.alert('Congratulation', 'Your Account has been created');
        setIsRegisterScreen(false);
    } else if (regPassword != regRepeatPassword) {
        Alert.alert('Error', 'Please make sure the passwords are match');
    }
}



const loginUserAcc = () => {
    signInWithEmailAndPassword(authentication, userEmail, userPassword)
        .then((credentials) => {
            CommonStore.update(s => {
                s.isLoggedIn = true;
            });
            var userSelectedTemp = {};
            for (var i=0; i < userList.length; i++) {
              if (userList[i].uniqueID === credentials.user.uid) {
              userSelectedTemp = userList[i];
              CommonStore.update(s => {
                s.userSelected = userSelectedTemp;
                s.userSelectedID = credentials.user.uid;
                })
              }
            }
            console.log('Login Success');
            console.log(userSelected);
        })
        .catch((re) => {
            console.log(re);
        })
}



    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
        >
        {!isRegisterScreen ?    
            <SafeAreaView style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height, justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                <Text style={{ fontSize: 45, fontWeight: '700', }}>
                  WhatEverPets
                </Text>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                      <MaterialCommunityIcons name={'email'} size={27} />
                      <Text style={{ fontSize: 18, fontWeight: '700', color: 'black', paddingVertical: 5, marginLeft: 10 }}>Email</Text>
                    </View>
                    <TextInput
                        style={[styles.textInput, { fontSize: 18, }]}
                        placeholder="Email"
                        value={userEmail}
                        onChangeText={ text => setUserEmail(text)}
                    />
                </View>
                <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                      <MaterialCommunityIcons
                        name={'account-key'} size={27}
                      />
                      <Text style={{ fontSize: 18, fontWeight: '700', color: 'black', paddingVertical: 5, marginLeft: 10 }}>
                        Password
                      </Text>
                    </View>
                    <TextInput
                        style={[styles.textInput, {fontSize: 18, }]}
                        placeholder="Password"
                        value={userPassword}
                        onChangeText={ text => setUserPassword(text) }
                        secureTextEntry
                    />
                </View>
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <TouchableOpacity
                    style={[styles.loginButton]}
                    onPress={() => { 
                      loginUserAcc(); 
                      CommonStore.update(s => {
                        userType == 'CUSTOMER';
                      })
                    }}
                    >
                      <Text style={{ fontSize: 19, fontWeight: '700', color: 'black' }}>
                        LOGIN
                      </Text>
                    </TouchableOpacity>
                </View>
              </View>
              <View style={{ alignItems: 'center', paddingVertical: 10, top: -100 }}>
                <TouchableOpacity
                    onPress={() => {
                        setIsRegisterScreen(true);
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', textDecorationLine: 'underline' }}>Create An Account</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
        :
            <SafeAreaView style={[styles.container]}>
              <View style={{ paddingHorizontal: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setIsRegisterScreen(false);
                  }}
                >
                  <MaterialCommunityIcons name={'chevron-left'} size={40} />
                </TouchableOpacity>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
                  <Text style={{ fontSize: 25, fontWeight: '700', paddingVertical: 5 }}>
                    Start Your Own Account
                  </Text>
                </View>
                <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <MaterialCommunityIcons name={'account'} size={27} />
                    <Text style={{ fontSize: 18, fontWeight: '700', paddingVertical: 5, marginLeft: 10 }}>Full Name</Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { fontSize: 18 }]}
                    placeholder="Full Name"
                    value={regName}
                    onChangeText={text => setRegName(text)}
                  />
                </View>
                <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <MaterialCommunityIcons 
                      name={'email'} size={27}
                    />
                    <Text style={{ fontSize: 18, fontWeight: '700', paddingVertical: 5, marginLeft: 10 }}>
                      Email
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { fontSize: 18 }]}
                    placeholder="Email"
                    value={regEmail}
                    onChangeText={text => setRegEmail(text)}
                  />
                </View>
                <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <MaterialCommunityIcons
                      name={'account-key'} size={27}
                    />
                    <Text style={{ fontSize: 18, fontWeight: '700', paddingVertical: 5, marginLeft: 10 }}>
                      Password
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { fontSize: 18 }]}
                    placeholder="Password"
                    value={regPassword}
                    onChangeText={text => setRegPassword(text)}
                  />
                </View>
                <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <MaterialCommunityIcons 
                      name={'account-key'} size={27}
                    />
                    <Text style={{ fontSize: 18, fontWeight: '700', paddingVertical: 5, marginLeft: 10 }}>
                      Repeat Password
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { fontSize: 18 }]}
                    placeholder="Repeat Password"
                    value={regRepeatPassword}
                    onChangeText={text => setRegRepeatPassword(text)}
                  />
                </View>
                <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <MaterialCommunityIcons
                      name={'contacts'} size={27}
                    />
                    <Text style={{ fontSize: 18, fontWeight: '700', paddingVertical: 5, marginLeft: 10 }}>
                      Contact Number
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { fontSize: 18 }]}
                    placeholder="0123456789"
                    value={regContactNo}
                    onChangeText={text => setRegContactNo(text)}
                  />
                </View>

                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.registerButton]}
                    onPress={() => {
                      registerUserAcc();
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: '700' }}>
                      Register Now!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
    }
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  registerButton: {
    borderRadius: 10,
    backgroundColor: Colors.aliceBlue,
    width: 150,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  },
  textInput: {
    backgroundColor: 'white',
    height: 35,
    paddingLeft: 5,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  },
  loginButton: {
    backgroundColor: Colors.aliceBlue,
    height: 35,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  }
    
  });

export default LoginScreen

