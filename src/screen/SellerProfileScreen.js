import React, { useState, useEffect } from 'react'
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Image, TextInput, Alert} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonStore } from '../../store/CommonStore';
import Colors from '../constant/Colors';

//Firebase
import { authentication, db } from '../../constants/key';
import { signOut } from 'firebase/auth';
import { collection, setDoc, updateDoc, doc, query, onSnapshot, increment } from 'firebase/firestore';


const SellerProfileScreen = props => {

const EDIT_SELLER_PROFILE = {
  YES: 'EDIT_SELLER_PROFILE.YES',
  NO: 'EDIT_SELLER_PROFILE.NO',
};
const [editSellerProfile, setEditSellerProfile] = useState(EDIT_SELLER_PROFILE.NO);
  
const [storeName, setStoreName] = useState('');
const [storeContactNo, setStoreContactNo] = useState('');
const [storeAddress, setStoreAddress] = useState('');
const [storeWallet, setStoreWallet] = useState(0);

const userType = CommonStore.useState(s => s.userType);
const userSelected = CommonStore.useState(s => s.userSelected);
const userSelectedID = CommonStore.useState(s => s.userSelectedID);
const userList = CommonStore.useState(s => s.userList);
const serviceSelectedEdit = CommonStore.useState(s => s.serviceSelectedEdit);

useEffect(() => {
  setStoreName(userSelected.storeName);
  setStoreContactNo(userSelected.storeContactNo);
  setStoreAddress(userSelected.storeAddress);
  setStoreWallet(userSelected.storeWallet);
},[userSelected, editSellerProfile])


useEffect(() => {
  var userSelectedTemp = {};
    for (var i=0; i < userList.length; i++) {
      if (userList[i].uniqueID === userSelectedID) {
      userSelectedTemp = userList[i];
      CommonStore.update(s => {
        s.userSelected = userSelectedTemp;
        })
      }
    }

},[editSellerProfile])

//Update Store/Seller Info
const updateStoreInfo = async () => {
  const userRef = doc(db, 'User', userSelected.uniqueID);
  await updateDoc(userRef, {
    storeName: storeName,
    storeContactNo: storeContactNo,
    storeAddress: storeAddress,
  })
  Alert.alert('Success', 'Store Update Successfully');
}


const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
      <View>
        { editSellerProfile === EDIT_SELLER_PROFILE.YES ?
        <TouchableOpacity style={{
        }} 
        onPress={() => { 
          setEditSellerProfile(EDIT_SELLER_PROFILE.NO);
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
        :
        null }
      </View>
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
          {editSellerProfile === EDIT_SELLER_PROFILE.NO ? 'Seller Profile' : 'Edit Seller Profile'}
        </Text>
      </View>
    ),
    headerRight: () => (
      <View>
      </View>
    ),
  });

    return (
        <ScrollView
            style={{
                backgroundColor: 'white',
            }}
        >
          { editSellerProfile === EDIT_SELLER_PROFILE.NO ?
          <View>
            <View style={{
              //height: 100,
              paddingTop: 10,
            }}>
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  //backgroundColor: 'blue',
                  paddingHorizontal: 5,
                  marginLeft: 10,
                  alignItems: 'center',
                }}
                  onPress={() => {
                    setEditSellerProfile(EDIT_SELLER_PROFILE.YES);
                  }}
                >
                  <Image
                    source={{uri: userSelected.userImage}}
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
                      {userSelected.storeName}
                  </Text>
                </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 1, marginTop: 10, marginHorizontal: 8 }}/>
            <View style={{
              paddingHorizontal: 10,
              paddingTop: 5,
            }}>
                {/* <TouchableOpacity
                      style={styles.FunctionButton}
                      onPress={() => {
                        navigation.navigate('SellerStore')
                      }}
                >
                    <Text
                        style={styles.FunctionText}
                    >
                        My Store
                    </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                      style={styles.FunctionButton}
                      onPress={() => {
                        navigation.navigate('CustomerOrder')
                      }}
                >
                    <Text
                        style={styles.FunctionText}
                    >
                        Customer Order
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                      style={styles.FunctionButton}
                      onPress={() => {
                      CommonStore.update(s => {
                        s.serviceSelectedEdit = null;
                      });
                        navigation.navigate('AddProduct');
                      }}
                >
                    <Text
                        style={styles.FunctionText}
                    >
                        Add Product
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                      style={styles.FunctionButton}
                      onPress={() => {
                        CommonStore.update(s => {
                            s.userType = 'CUSTOMER';
                        })
                      }}
                >
                    <Text
                        style={styles.FunctionText}
                    >
                        Switch To Customer
                    </Text>
                </TouchableOpacity>
            </View>
          </View>
          :
          editSellerProfile === EDIT_SELLER_PROFILE.YES ?
          <View style={{ padding: 10, paddingTop: 0, justifyContent: 'space-between', height: Dimensions.get('screen').height * 0.5 }}>
            <View>
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                  Store Name
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setStoreName(text);
                  }}
                  value={storeName}
                />
              </View>
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                  Store Contact Number
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setStoreContactNo(text);
                  }}
                  value={storeContactNo}
                />
              </View>
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                  Store Address
                </Text>
                <TextInput
                  style={[styles.textInput,{
                    height: 70,
                  }]}
                  multiline={true}
                  placeholder='Store Address'
                  onChangeText={(text) => {
                    setStoreAddress(text);
                  }}
                  value={storeAddress}
                />
              </View>
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                  Store Wallet Amount
                </Text>
                <TouchableOpacity style={[styles.textInput,{
                    justifyContent: 'center',
                    //alignItems: 'center',
                  }]}
                  onPress={() => {
                    //setTopUpWallet(true);
                  }}
                  disabled={true}
                >
                  <Text style= {{ fontSize: 17, fontWeight: '500' }}>
                    RM {storeWallet.toFixed(2)}
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
                   updateStoreInfo()
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

export default SellerProfileScreen;
