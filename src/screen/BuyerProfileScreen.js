import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Image, TextInput, Alert, Modal} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constant/Colors';
import { CommonStore } from '../../store/CommonStore';
import { CollectionFunc } from '../../util/CollectionFunc';

//Firebase
import { authentication, db } from '../../constants/key';
import { signOut } from 'firebase/auth';
import { collection, setDoc, updateDoc, doc, query, onSnapshot, increment } from 'firebase/firestore';


const BuyerProfileScreen = props => {

const EDIT_PROFILE = {
  YES: 'EDIT_PROFILE.YES',
  NO: 'EDIT_PROFILE.NO',
};
const [editProfile, setEditProfile] = useState(EDIT_PROFILE.NO);

const [userName, setUserName] = useState('');
const [contactNo, setContactNo] = useState('');
const [userWallet, setUserWallet] = useState(0);

const [topUpAmount, setTopUpAmount] = useState(0);
const [topUpWallet, setTopUpWallet] = useState(false);

const userType = CommonStore.useState(s => s.userType);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
const userSelected = CommonStore.useState(s => s.userSelected);

useEffect(() => {
  CollectionFunc();
});

useEffect(() => {
    setUserName(userSelected.userName);
    setContactNo(userSelected.contactNo);
    setUserWallet(userSelected.walletAmount);
},[userSelected, topUpWallet, isLoggedIn])


//Add Wallet Amount
const topUpWalletAmount = async () => {
  const userRef = doc(db, 'User', userSelected.uniqueID);
  await updateDoc(userRef, {
    walletAmount: increment(topUpAmount)
  })

    setTopUpWallet(false);
}

//Update User Info
const updateUserInfo = async () => {
  const userRef = doc(db, 'User', userSelected.uniqueID);
  await updateDoc(userRef, {
    userName: userName,
    contactNo: contactNo,
  })
  Alert.alert('Success', 'Update Successfully');
}

const signOutUserAcc = () => {
  signOut(authentication)
  .then((re) => {
    CommonStore.update(s => {
      s.isLoggedIn = false;
    })
  })
  .catch((error) => {
    console.log(error);
  })
}

const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity style={{
      }} 
      onPress={() => { 
        editProfile === EDIT_PROFILE.NO ?
        navigation.navigate('Home') :
        setEditProfile(EDIT_PROFILE.NO);
      }}>
        <View style={{
          justifyContent: 'center',
          paddingLeft: 0,
        }}>
          <Ionicons
            name="return-up-back-sharp"
            size={30}
            color='black'
            style={{
            }}
          />
        </View>
    </TouchableOpacity>
    ),
    headerTitle: () => (
      <View style={{
        justifyContent: 'center',
      }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
          }}>
          {editProfile === EDIT_PROFILE.NO ? 'Profile' : 'Edit Profile'}
        </Text>
      </View>
    ),
    headerRight: () => (
      <View>
      { editProfile === EDIT_PROFILE.NO ?
      <TouchableOpacity style={{
      }} 
      onPress={() => {
        signOutUserAcc();
      }}>
        <View style={{
          justifyContent: 'center',
          paddingLeft: 5,
        }}>
          <Ionicons
            name='log-out-outline'
            size={30}
            style={{
            }}
          />
        </View>
      </TouchableOpacity>
      :
      null }
      </View>
    ),
  });

    return (
        <ScrollView
            style={{
                backgroundColor: 'white',
            }}
        >
          <Modal
            visible={topUpWallet}
            transparent={true}
            animationType={'slide'}
          >
            <View style={styles.modalContainer}>
              <View style={[styles.modalView,{ justifyContent: 'space-between' }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <View>
                    <Text style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      shadowOffset: {
                        width: 0,
                        height: 5,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 1,
                    }}>
                      TOP UP Amount
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    //alignItems: 'center',
                    marginTop: 15,
                    height: 65,
                  }}>
                    <TextInput 
                      style={[styles.textInput,{ fontSize: 20, fontWeight: '500' }]}
                      placeholder="Enter Top Up Amount"
                      value={topUpAmount}
                      onChangeText={text => setTopUpAmount(text)}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', width: '95%',justifyContent: 'space-between', }}>
                  <TouchableOpacity style={{ 
                    width: '45%',
                    height: 35,
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    shadowOffset: {
                      width: 0,
                      height: 5,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      elevation: 1,
                  }}
                    onPress={() => {
                      topUpWalletAmount();
                    }}
                  >
                    <Text style={{ fontSize: 16, color: Colors.black, fontWeight: 'bold' }}>
                      TOP UP
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ 
                    width: '45%',
                    height: 35,
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    shadowOffset: {
                      width: 0,
                      height: 5,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      elevation: 1,
                  }}
                    onPress={() => {
                      setTopUpWallet(false);
                    }}
                  >
                    <Text style={{ fontSize: 16, color: 'red', fontWeight: 'bold' }}>
                      LATER
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          { editProfile === EDIT_PROFILE.NO ?
          <View>
            <View style={{
              height: 100,
              paddingTop: 10,
            }}>
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  alignItems: 'center',
                }}
                  onPress={() => {
                    setEditProfile(EDIT_PROFILE.YES);
                  }}
                >
                  <Image
                    source={require('../assets/image/YuruCampCamp.png')}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      borderWidth: 1,
                      marginRight: 10,
                    }}
                  />
                  <Text style={{
                    fontSize: 17,
                  }}>
                    {userSelected.userName}
                  </Text>
                </TouchableOpacity>
            </View>

            <View style={{
              paddingHorizontal: 10,
              paddingTop: 5,
            }}>
                    <TouchableOpacity
                         style={styles.FunctionButton}
                         onPress={() => {
                           navigation.navigate('BuyerReceipt')
                         }}
                    >
                        <Text
                            style={styles.FunctionText}
                        >
                            Purchase History
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={styles.FunctionButton}
                         onPress={() => {
                           CommonStore.update(s => {
                             s.userType = 'SELLER';
                           })
                         }}
                    >
                        <Text
                            style={styles.FunctionText}
                        >
                            Switch To Seller
                        </Text>
                    </TouchableOpacity>
            </View>
          </View> 
          :
          editProfile === EDIT_PROFILE.YES ?
          <View style={{ padding: 10, paddingTop: 0, justifyContent: 'space-between', height: Dimensions.get('screen').height * 0.5 }}>
            <View>
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                  Username
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setUserName(text);
                  }}
                  value={userName}
                />
              </View>
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                  Contact Number
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setContactNo(text);
                  }}
                  value={contactNo}
                />
              </View>
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                  Wallet Amount
                </Text>
                <TouchableOpacity style={[styles.textInput,{
                    justifyContent: 'center',
                    //alignItems: 'center',
                  }]}
                  onPress={() => {
                    setTopUpWallet(true);
                  }}
                >
                  <Text style= {{ fontSize: 17, fontWeight: '500' }}>
                    {userSelected.walletAmount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
              <TouchableOpacity 
                style={{
                  //borderWidth: 1,
                  alignItem: 'center',
                  justifyContent: 'center',
                  height: 35,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  backgroundColor: Colors.azure,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 1,
                }}
                 onPress={() => {
                   updateUserInfo()
                 }}
                >
                <Text style={styles.text1}>
                  UPDATE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          null }   
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalView: {
      height: 200,
      width: 250,
      backgroundColor: Colors.lavender,
      borderRadius: 15,
      paddingVertical: 15,
      paddingHorizontal: 8,
      alignItems: 'center',
      shadowOffset: {
        width: 0,
        height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 1,
    },
    FunctionButton: {
        height: 40,
        width: '100%',
        borderColor: Colors.azure,
        borderWidth: 0.5,
        borderRadius: 10,
        backgroundColor: Colors.plum,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginVertical: 8,
        shadowOffset: {
          width: 0,
          height: 5,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 1,
    },
    FunctionText: {
        fontSize: 18,
        fontWeight: '500',
    },
    text: {
      paddingVertical: 5,
      fontSize: 17,
      fontWeight: '500',
    },
    text1: {
      paddingVertical: 5,
      fontSize: 19,
      fontWeight: '600',
    },
    textInput: {
        height: 35,
        width: '100%',
        //borderWidth: 1,
        borderRadius: 5,
        backgroundColor: Colors.white,
        paddingHorizontal: 5,
        fontSize: 17,
        //backgroundColor: Colors.white,
        shadowOffset: {
          width: 0,
          height: 5,
          },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 2,
    },
})

export default BuyerProfileScreen;
