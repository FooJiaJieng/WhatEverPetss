import React, { Component, useReducer, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList, Image} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constant/Colors'
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import { CommonStore } from '../../store/CommonStore';
import { CollectionFunc } from '../../util/CollectionFunc';

const HomeScreen = props => {

// const [selectedUserOrderList, setSelectedUserOrderList] = useState([]);
const [searchService, setSearchService] = useState('');
const [filterType, setFilterType] = useState('');

const userSelected = CommonStore.useState(s => s.userSelected);
const userList = CommonStore.useState(s => s.userList);
const serviceList = CommonStore.useState(s => s.serviceList);
const sellerServiceList = CommonStore.useState(s => s.sellerServiceList);
const serviceSelected = CommonStore.useState(s => s.serviceSelected);
const order = CommonStore.useState(s => s.order);
const userOrderSelected = CommonStore.useState(s => s.userOrderSelected);
const userReceiptSelected = CommonStore.useState(s => s.userReceiptSelected);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
    
useEffect(() => {
    CollectionFunc();
});

// useEffect(() => {
//     var myOrderTemp = [];
//     for (var i = 0; i < order.length; i++) {
//         if (order[i].userID === userSelected.uniqueID) {
//             const myService = order[i]
//             myOrderTemp.push(myService);
//         }
//     }
//     setSelectedUserOrderList(myOrderTemp);
//     CommonStore.update(s => {
//         s.userOrderSelected = selectedUserOrderList;
//     })
// },[serviceSelected, userSelected, isLoggedIn, userReceiptSelected])

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
            Home
        </Text>
        </View>
    ),
    headerRight: () => (
    <View></View>
    ),
    });


const renderSelectedService =({item, index}) => {
    return(
        <TouchableOpacity style={{
            width: 170,
            height: 130,
            padding: 5,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 5,
            marginRight: 10,
            marginLeft: 5,
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
        }}
            onPress={() => {
                navigation.navigate('ServiceDetails');
                CommonStore.update( s => {
                    s.serviceSelected = item;
                });
                console.log(serviceSelected)
            }}
        >
            <View>
                <Image
                    source={{uri: item.serviceImg}}
                    style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    borderWidth: 1,
                    marginRight: 10,
                    }}
                />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500' }} numberOfLines={1}>
                {item.serviceName}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Type: {item.serviceType}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Deposit: RM {item.serviceDeposit}
            </Text>
        </TouchableOpacity>
    )
};

    return (
        <ScrollView
            style={{ padding: 1, backgroundColor: Colors.white }}
        >

            {/* <TouchableOpacity onPress={() => {
                //console.log(userSelected);
                //console.log(serviceList);
                console.log('order');
                console.log(selectedUserOrderList);
                //console.log(userList);
                
            }}><Text>hiiii</Text>
            </TouchableOpacity> */}

            <View style={{
                padding: 5,
                paddingHorizontal: 10,
                //backgroundColor: Colors.lavenderBlush,
            }}>
                <View style={{
                    paddingVertical: 5,
                }}>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: '600',
                        marginBottom: 5,
                    }}>
                        Hello Customer {userSelected.userName},
                    </Text>
                    <View>
                    </View>
                    {/* <TextInput
                        style={{
                            width: '100%',
                            height: 40,
                            backgroundColor: Colors.aliceBlue,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                            shadowOffset: {
                            width: 0,
                            height: 5,
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            elevation: 1,
                        }}
                        placeholder= "Let's get started, shall we?"
                        onChange={(text) => {
                            setSearchService(text)
                        }}
                        value={searchService}
                    /> */}
                </View>
                {/* <View style={{
                    paddingVertical: 5,
                    paddingTop: 10,
                }}
                >
                    <Text style={{
                        fontSize: 25,
                        fontWeight: '600',
                        marginBottom: 5,
                    }}>
                        Your Receipt
                    </Text>
                    { selectedUserOrderList.length < 1 ?
                    <View>
                        <Text>
                            - No Any Reservation Yet
                        </Text>
                    </View>    
                    :
                    <FlatList
                        data={selectedUserOrderList.slice(0).sort((a, b) => {
                             return moment(b[selectedUserOrderList.createdAt]).valueOf() - moment(a[selectedUserOrderList.createdAt]).valueOf();
                        })}
                        renderItem={renderReceipt}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                    />
                    }
                </View> */}
                <View style={{
                    paddingBottom: 5,
                }}
                >
                    <Text style={{
                        fontSize: 25,
                        fontWeight: '600',
                        //marginBottom: 5,
                    }}>
                        Services
                    </Text>
                    <View>
                        <ScrollView style={{

                        }}
                        horizontal={true}
                        >
                            <TouchableOpacity style={[
                                styles.ServicesCat
                            ]}
                                onPress={() => {
                                    setFilterType('');
                                }}
                            >
                                <Text style={[
                                    styles.ServicesCatText
                                ]}>
                                    All
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[
                                styles.ServicesCat
                            ]}
                                onPress={() => {
                                    setFilterType('Grooming');
                                }}
                            >
                                <Text style={[
                                    styles.ServicesCatText
                                ]}>
                                    Grooming
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[
                                styles.ServicesCat
                            ]}
                                onPress={() => {
                                    setFilterType('Veterinary');
                                }}
                            >
                                <Text style={[
                                    styles.ServicesCatText
                                ]}>
                                    Veterinary
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[
                                styles.ServicesCat
                            ]}
                                onPress={() => {
                                    setFilterType('Bath Only');
                                }}
                            >
                                <Text style={[
                                    styles.ServicesCatText
                                ]}>
                                    Bath Only
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <FlatList
                        // data={serviceList.filter((item) => {
                        //     if (searchService !== '') {
                        //         var searchUpperCase = searchService.toUpperCase();

                        //         if (item.servicename.toUpperCase().includes(searchUpperCase)) {
                        //         return true;
                        //         } else {
                        //         return false;
                        //         }
                        // } else {
                        //     return true;
                        //     }}
                        // )}
                        data={serviceList.filter((item) => {
                            if (filterType === item.serviceType) {
                                return true
                            } else if (filterType === '') {
                                return true
                            }
                        })}
                        renderItem={renderSelectedService}
                        keyExtractor={(item, index) => index.toString()}
                        //horizontal={true}
                        numColumns={2}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    ServicesCat: {
        height: 30,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginVertical: 8,
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

    ServicesCatText: {
        fontSize: 15,
    },
})
