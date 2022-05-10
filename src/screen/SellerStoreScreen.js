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
const [filterType, setFilterType] = useState('');

const serviceList = CommonStore.useState(s => s.serviceList);
const userList = CommonStore.useState(s => s.userList);
const userSelected = CommonStore.useState(s => s.userSelected);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
const serviceSelectedEdit = CommonStore.useState(s => s.serviceSelectedEdit);

useEffect(() => {
    var myServiceTemp = [];
    for (var i = 0; i < serviceList.length; i++) {
        if (serviceList[i].sellerID === userSelected.uniqueID) {
            const myService = serviceList[i]
            myServiceTemp.push(myService);
        }
    }
    setSelectedUserServiceList(myServiceTemp);
},[isLoggedIn, serviceList, userSelected])


const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
    <TouchableOpacity onPress={() => {
        //navigation.goBack();
    }}>
        
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
        <View style={{ width: '100%', paddingHorizontal: 5 }}>
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
                    <View style= {{ width: '25%' }}>
                        <Image
                            style={{
                                borderRadius: 10,
                                width: '100%',
                                height: 110,
                            }}
                            source={{uri: item.serviceImg}}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 5, width: '75%', }}>
                        <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500' }} numberOfLines={1}>
                                {item.serviceName}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', width: '30%' }}>
                                Type:
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: '500', width: '70%' }}>
                                {item.serviceType}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', width: '30%' }}>
                                Desc: 
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: '500', width: '70%' }} numberOfLines={2}>
                                {item.serviceDescription}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                            <Text style={{ fontSize: 16, fontWeight: '500', width: '30%' }}>
                                Deposit:
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: '500', width: '70%' }}>
                                RM{item.serviceDeposit}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

  return (
    <ScrollView style={{ 
        backgroundColor: Colors.white,
        height: '100%',
        paddingHorizontal: 10,
    }}>
        <View style={{
                paddingVertical: 10,
                //paddingHorizontal: 10,
                backgroundColor: Colors.white,
                //alignItems: 'center'
        }}>
            <ScrollView style={{
            }}
                horizontal={true}
            >
                <TouchableOpacity style={[
                    styles.servicesCat
                ,{
                    backgroundColor: filterType === '' ? Colors.mediumPurple : Colors.plum,
                }]}
                    onPress={() => {
                        setFilterType('');
                    }}
                >
                    <Text style={[
                        styles.servicesCatText
                    ]}>
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    styles.servicesCat
                ,{
                    backgroundColor: filterType === 'Grooming' ? Colors.mediumPurple : Colors.plum,
                }]}
                    onPress={() => {
                        setFilterType('Grooming');
                    }}
                >
                    <Text style={[
                        styles.servicesCatText
                    ]}>
                        Grooming
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[
                    styles.servicesCat
                ,{
                    backgroundColor: filterType === 'Veterinary' ? Colors.mediumPurple : Colors.plum,
                }]}
                    onPress={() => {
                        setFilterType('Veterinary');
                    }}
                >
                    <Text style={[
                        styles.servicesCatText
                    ]}>
                        Veterinary
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[
                    styles.servicesCat
                ,{
                    backgroundColor: filterType === 'Bath Only' ? Colors.mediumPurple : Colors.plum,
                }]}
                    onPress={() => {
                        setFilterType('Bath Only');
                    }}
                >
                    <Text style={[
                        styles.servicesCatText
                    ]}>
                        Bath Only
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            { selectedUserServiceList.length > 0 ?
            <FlatList
                data={selectedUserServiceList.length > 0 ? selectedUserServiceList.filter((item) => {
                    if (filterType === item.serviceType) {
                        return true
                    } else if (filterType === '') {
                        return true
                    }
                }) : null }
                renderItem={renderStoreService}
                keyExtractor={(item, index) => index.toString()}
            />
            :
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                <Text style={{ fontSize: 18, color: 'grey', fontWeight: '700' }}>
                    No Service In This Store
                </Text>
            </View>
            }
        </View>
    </ScrollView>
  )
}

export default SellerStoreScreen

const styles = StyleSheet.create({
    renderService: {
        width: '100%',
        height: 130,
        padding: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 5,
        //marginRight: 10,
        //marginLeft: 5,
        marginVertical: 5,
        marginBottom: 10,
        backgroundColor: Colors.lavenderBlush,
        shadowOffset: {
            width: 0,
            height: 5,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 1,
    },
    servicesCat: {
        height: 30,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginBottom: 8,
        marginRight: 8,
        backgroundColor: Colors.plum,
        shadowOffset: {
            width: 0,
            height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 0.1,
    },
    servicesCatText: {
        fontSize: 15,
    },
})