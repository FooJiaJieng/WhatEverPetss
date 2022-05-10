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
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../constant/Colors'
import moment from 'moment';
import { CommonStore } from '../../store/CommonStore';
import { CollectionFunc } from '../../util/CollectionFunc';

const StoreServiceScreen = props => {

const [filterType, setFilterType] = useState('');
const [storeService, setStoreService] = useState([]);

const userSelected = CommonStore.useState(s => s.userSelected);
const storeSelected = CommonStore.useState(s => s.storeSelected);    
const userOrderSelected = CommonStore.useState(s => s.userOrderSelected);
const userReceiptSelected = CommonStore.useState(s => s.userReceiptSelected);
const serviceList = CommonStore.useState(s => s.serviceList);
const serviceSelected = CommonStore.useState(s => s.serviceSelected);


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
    // CommonStore.update(s => {
    //     s.storeSelectedService = storeService;
    // })
    //console.log(storeService.length)
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
            disabled={ storeSelected.uniqueID === userSelected.uniqueID ? true : false }
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

const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity style={{
      }} 
      onPress={() => { 
        navigation.goBack()
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
              Store Service
        </Text>
      </View>
    ),
    headerRight: () => (
      <View>
      </View>
    ),
});

  return (
    <ScrollView style={{
        backgroundColor: Colors.white,
        padding: 10,
    }}>
        <View style={{ }}>
            <View style={{ width: '100%' }}>
                <Image
                    style={{
                        height: 170,
                        width: '100%',
                        borderRadius: 5,
                        borderWidth: 1,
                    }}
                    source={{uri: storeSelected.userImage}}
                />
            </View>
            <View style={{ paddingTop: 5 }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                }}>
                    {storeSelected.storeName}
                </Text>
            </View>
            <View style={{
                flexDirection: 'row',
                paddingVertical: 5,
            }}>
                <View style={{ width: '10%' }}>
                    <Feather name='phone-call' size={20} color={Colors.mediumPurple} style={{ }}/>
                </View>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    width: '89%'
                }}>
                    : {storeSelected.storeContactNo}
                </Text>
            </View>
            <View style={{
                flexDirection: 'row',
                paddingVertical: 5,
                //backgroundColor: 'red'
            }}>
                <View style={{ width: '10%' }}>
                    <Ionicons name='location-outline' size={25} color={Colors.mediumPurple} style={{ }}/>
                </View>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    width: '89%'
                }}
                >
                    : {storeSelected.storeAddress}
                </Text>
            </View>
        </View>
        <View style={{ paddingTop: 10, }}>
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
        <View style={{ height: 50 }}/>
    </ScrollView>
  )
}

export default StoreServiceScreen

const styles = StyleSheet.create({
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