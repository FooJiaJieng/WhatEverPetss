import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    ScrollView,
    Image,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    Modal,
    Dimensions,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constant/Colors'
import moment from 'moment';
import { CommonStore } from '../../store/CommonStore';
import { CollectionFunc } from '../../util/CollectionFunc';

const StoreServiceScreen = () => {

const [filterType, setFilterType] = useState('');
const [storeService, setStoreService] = useState([]);

const userSelected = CommonStore.useState(s => s.userSelected);
const storeSelected = CommonStore.useState(s => s.storeSelected);    
//const storeSelectedService = CommonStore.useState(s => s.storeSelectedService);
const userOrderSelected = CommonStore.useState(s => s.userOrderSelected);
const userReceiptSelected = CommonStore.useState(s => s.userReceiptSelected);
const serviceList = CommonStore.useState(s => s.serviceList);


useEffect(() => {
    var selectedStoreServiceTemp = [];
    for (var i = 0; i < serviceList.length; i++) {
        if (serviceList[i].sellerID === storeSelected.uniqueID) {
            const selectedStoreService = serviceList[i]
            selectedStoreServiceTemp.push(selectedStoreService);
        }

    }
    //Selected Store Service is Stored here
    setStoreService(selectedStoreServiceTemp)
},[storeSelected, userReceiptSelected, userSelected])

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
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Deposit: RM {item.serviceDeposit}
            </Text>
        </TouchableOpacity>
    )
};

  return (
    <View style={{ backgroundColor: Colors.white, padding: 10 }}>
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
            data={storeService.filter((item) => {
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
  )
}

export default StoreServiceScreen

const styles = StyleSheet.create({
    ServicesCat: {
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
    ServicesCatText: {
        fontSize: 15,
    },
})