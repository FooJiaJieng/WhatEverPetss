import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Image, TextInput} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonStore } from '../../store/CommonStore';
import Colors from '../constant/Colors';


const SellerProfileScreen = props => {


const userType = CommonStore.useState(s => s.userType);
const userSelected = CommonStore.useState(s => s.userSelected);
const serviceSelectedEdit = CommonStore.useState(s => s.serviceSelectedEdit);


const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
      <View>
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
          Seller Profile
        </Text>
      </View>
    ),
    headerRight: () => (
      <View/>
    ),
  });

    return (
        <ScrollView
            style={{
                backgroundColor: 'white',
            }}
        >
          <View>
            <View style={{
              height: 170,
            }}>
                <View style={{
                  backgroundColor: 'green',
                  width: '100%',
                  height: '100%',
                }}>
                  
                </View>
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  top: 110,
                  //backgroundColor: 'blue',
                  paddingHorizontal: 5,
                  marginLeft: 10,
                  alignItems: 'center',
                }}
                  onPress={() => {
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
                           navigation.navigate('SellerStore')
                         }}
                    >
                        <Text
                            style={styles.FunctionText}
                        >
                            My Store
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
