import React, { Component, useReducer, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from 'react-native-check-box';
import Colors from '../constant/Colors';
import moment from 'moment';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { CommonStore } from '../../store/CommonStore';

//Firebase
import { authentication, db } from '../../constants/key';
import { collection, getDocs, query, onSnapshot, setDoc, doc } from 'firebase/firestore';

const SellerStoreScreen = props => {

const [selectedUserServiceList, setSelectedUserServiceList] = useState({});
const [serviceListTemp, setServiceListTemp] = useState([]);

const serviceList = CommonStore.useState(s => s.serviceList);
const userList = CommonStore.useState(s => s.userList);
const userSelected = CommonStore.useState(s => s.userSelected);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
const serviceSelectedEdit = CommonStore.useState(s => s.serviceSelectedEdit);

 useEffect(() => {
    var tempMyService = [];
    for (var i = 0; i < serviceList.length; i++ ){
        if (serviceList[i].sellerID === userSelected.uniqueID) {
            const myService = serviceList[i]
            tempMyService.push(myService);
        }
    }
    setSelectedUserServiceList(tempMyService);
},[isLoggedIn, serviceList, userSelected])


const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
    <TouchableOpacity onPress={() => {
        navigation.goBack();
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
            My Store
        </Text>
        </View>
    ),
    headerRight: () => (
        <View/>
    ),
    });


const renderStoreService =({item, index}) => {
    return(
        <View style={{ width: Dimensions.get('screen').width*0.96, paddingHorizontal: 5 }}>
            <TouchableOpacity
                style={styles.renderService}
                onPress={() => {
                    navigation.navigate('AddProduct');
                    CommonStore.update(s => {
                        s.serviceSelectedEdit = item;
                    })
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Image
                            style={{
                                borderRadius: 10,
                                width: 80,
                                height: 80,
                            }}
                            source={{uri: item.serviceImg}}
                        />
                    </View>
                    <View>
                        <View>
                            <Text>
                                {item.serviceName}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                {item.serviceDescription}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                Deposit (RM): {item.serviceDeposit}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

  return (
    <View style={{ 
        backgroundColor: Colors.white,
        height: '100%',
    }}>
        <View style={{
                paddingVertical: 10,
                //paddingHorizontal: 10,
                backgroundColor: Colors.white,
                alignItems: 'center'
        }}>
            <FlatList
                data={selectedUserServiceList}
                renderItem={renderStoreService}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    </View>
  )
}

export default SellerStoreScreen

const styles = StyleSheet.create({
    renderService: {
        width: '100%',
        height: 150,
        padding: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 5,
        //marginRight: 10,
        //marginLeft: 5,
        marginVertical: 5,
        marginBottom: 10,
        backgroundColor: Colors.lavender,
        shadowOffset: {
            width: 0,
            height: 5,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 1,
    }
})