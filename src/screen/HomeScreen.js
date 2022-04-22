import React, { Component, useReducer, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList, Image} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../constant/Colors'
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import { CommonStore } from '../../store/CommonStore';
import { CollectionFunc } from '../../util/CollectionFunc';

const HomeScreen = props => {

// const [selectedUserOrderList, setSelectedUserOrderList] = useState([]);
const [searchService, setSearchService] = useState('');
const [filterType, setFilterType] = useState('');
const [displayStoreWithService, setDisplayStoreWithService] = useState([]);

const userSelected = CommonStore.useState(s => s.userSelected);
const userList = CommonStore.useState(s => s.userList);
const serviceList = CommonStore.useState(s => s.serviceList);
const sellerServiceList = CommonStore.useState(s => s.sellerServiceList);
const serviceSelected = CommonStore.useState(s => s.serviceSelected);
const order = CommonStore.useState(s => s.order);
const userOrderSelected = CommonStore.useState(s => s.userOrderSelected);
const userReceiptSelected = CommonStore.useState(s => s.userReceiptSelected);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
const storeSelected = CommonStore.useState(s => s.storeSelected);    
//const storeSelectedService = CommonStore.useState(s => s.storeSelectedService);

useEffect(() => {
    CollectionFunc();
});

useEffect(() => {
    var serviceLengthTemp = []
    for (var i = 0; i < userList.length; i++) {
        if (userList[i].serviceInStore > 0) {
            const displayStore = userList[i]
            serviceLengthTemp.push(displayStore)
        }
    }
    setDisplayStoreWithService(serviceLengthTemp);
},[userSelected, isLoggedIn, userList])

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


const renderAllStore =({item, index}) => {
    return(
      <View style={{ padding: 5 }}>
        <TouchableOpacity style={{
            flexDirection: 'row',
            width: '100%',
            height: 130,
            padding: 5,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 5,
            marginVertical: 5,
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
                navigation.navigate('StoreService');
                CommonStore.update( s => {
                    s.storeSelected = item;
                });
            }}
        >
         <View style={{ width: '45%' }}>
            <View style={{ width: '100%' }}>
                <Image
                    source={{uri: item.userImage}}
                    style={{
                    //width: 50,
                    height: 60,
                    borderRadius: 5,
                    borderWidth: 1,
                    marginRight: 10,
                    }}
                />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500' }} numberOfLines={2}>
                {item.storeName}
            </Text>
         </View>
         <View style={{ width: '55%', paddingTop: 5 }}>
           <View style={{ flexDirection: 'row' }}>
             <Feather name='phone-call' size={19} color={Colors.mediumPurple} style={{ width: '15%' }}/>
             <Text style={{ fontSize: 14, fontWeight: '500', width: '85%' }}>
                : {item.storeContactNo}
             </Text>
           </View>
           <View style={{ flexDirection: 'row', paddingTop: 5 }}>
             <Ionicons name='location-outline' size={24} color={Colors.mediumPurple} style={{ width: '15%' }}/>
             <Text style={{ fontSize: 16, fontWeight: '500', width: '85%' }}>
                : {item.storeAddress}
             </Text>
           </View>
         </View>
        </TouchableOpacity>
      </View>
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
                        Welcome {userSelected.userName},
                    </Text>
                    
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
                        Stores
                    </Text>
                    <FlatList
                        data={displayStoreWithService}
                        renderItem={renderAllStore}
                        keyExtractor={(item, index) => index.toString()}
                        //horizontal={true}
                        numColumns={0}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    
})
