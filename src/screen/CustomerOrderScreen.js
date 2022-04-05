import React, { useState, useEffect } from 'react'
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Image, TextInput, FlatList, Alert} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonStore, ServiceStatus } from '../../store/CommonStore';
import Colors from '../constant/Colors';
import { CollectionFunc } from '../../util/CollectionFunc';
import moment from 'moment';

//Firebase
import { authentication, db } from '../../constants/key';
import { collection, setDoc, updateDoc, doc, query, onSnapshot, increment } from 'firebase/firestore';


const CustomerOrderScreen = (props) => {

const VIEW_CUST_ORDER = {
    YES: 'VIEW_CUST_ORDER.YES',
    NO: 'VIEW_CUST_ORDER.NO',
};

const [viewCustOrderSelected, setViewCustOrderSelected] = useState(VIEW_CUST_ORDER.NO);
const [custOrderList, setCustOrderList] = useState([]);

const userSelected = CommonStore.useState(s => s.userSelected);
const userList = CommonStore.useState(s => s.userList);
const order = CommonStore.useState(s => s.order);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
const customerOrderList = CommonStore.useState(s => s.customerOrderList);
const customerOrderSelected = CommonStore.useState(s => s.customerOrderSelected);
   

useEffect(() => {
    CollectionFunc();
},[isLoggedIn, customerOrderSelected ]);

useEffect(() => {
    var myCustOrderTemp= [];
    for (var i = 0; i < order.length; i++) {
        if (order[i].sellerID === userSelected.uniqueID) {
            const myCustOrder = order[i]
            myCustOrderTemp.push(myCustOrder);
        }
    }
    setCustOrderList(myCustOrderTemp);
    CommonStore.update(s => {
        s.customerOrderList = custOrderList;
    })
    console.log(order)
},[userSelected, isLoggedIn, customerOrderSelected])

// const cancelOrder = async () => {
//     const orderRef = doc(db, 'Order', customerOrderSelected.uniqueID);
//     await updateDoc(orderRef, {
//         orderStatus: 'CANCELLED'
//     })
//     .then(() => {
//         Alert.alert(
//         'Cancelled',
//         'You have cancelled the service',
//         [{ text: 'OK', onPress: () => {
//             navigation.goBack();
//         } }],
//         { cancelable: false },
//     );
//     })
// }
  
// const returnMoneyToWallet = async () => {
//     const userRef = doc(db, 'User', userSelected.uniqueID);
//     await updateDoc(userRef, {
//         walletAmount: increment(userReceiptSelected.serviceDeposit),
//     })
//     .then(() => {

//     })
// }

const renderCustOrder = ({item, index}) => {
    return (
        <View style={{ padding: 10 }}>
            <TouchableOpacity 
                style={styles.renderCustOrder}
                onPress={() => {
                    setViewCustOrderSelected(VIEW_CUST_ORDER.YES)
                    CommonStore.update(s => {
                        s.customerOrderSelected = item
                    });
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '26%' }}>
                        <Image
                            style={{
                                borderWidth: 1,
                                borderRadius: 10,
                                width: '100%',
                                height: 90,
                            }}
                            source={{uri: item.serviceImg}}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 4, width: '37%' }}>
                        <View style={{
                            //width: 100,
                        }}>
                            <Text style={styles.text}>
                                Username:
                            </Text>
                            <Text style={styles.text1}
                                numberOfLines={1}
                            >
                                {item.userName}
                            </Text>
                        </View>
                        <View style={{
                            paddingTop: 5,
                        }}>
                            <Text style={styles.text}>
                                Service:
                            </Text>
                            <Text style={styles.text1}
                                numberOfLines={1}
                            >
                                {item.serviceName}
                            </Text>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 4, width: '37%' }}>
                        <View style={{
                            //width: 150,
                        }}>
                            <Text style={styles.text}>
                                Service Date:
                            </Text>
                            <Text style={styles.text1}
                                numberOfLines={1}
                            >
                                {moment(item.serviceDate).format('DD-MMM-YYYY')}
                            </Text>
                        </View>
                        <View style={{
                            paddingTop: 5,
                        }}>
                            <Text style={styles.text}>
                                Service Time:
                            </Text>
                            <Text style={styles.text1}
                                numberOfLines={1}
                            >
                                {item.serviceStartTime} - {item.serviceEndTime}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
};

const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
      <View>
        <TouchableOpacity style={{
        }} 
        onPress={() => { 
            { viewCustOrderSelected === VIEW_CUST_ORDER.NO ?
                navigation.goBack()
            :
                setViewCustOrderSelected(VIEW_CUST_ORDER.NO)
            }
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
              Customer Order
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
            padding: 10,
            paddingHorizontal: 5,
            backgroundColor: Colors.white
    }}>
     { viewCustOrderSelected === VIEW_CUST_ORDER.NO ?
        <FlatList
            data={custOrderList.slice(0).sort((a, b) => {
                return moment(b[custOrderList.createdAt]).valueOf() - moment(a[custOrderList.createdAt]).valueOf();
            })}
            renderItem={renderCustOrder}
            keyExtractor={(item, index) => index.toString()}
            style={{ margin: -10 }}
        />
     :
     viewCustOrderSelected === VIEW_CUST_ORDER.YES ?
     <View style={{ 
        backgroundColor: Colors.white,
        padding: 10
       }}>
         <View>
           <View>
             <Image
                 style={{
                     borderWidth: 1,
                     borderRadius: 10,
                     width: '100%',
                     height: 150,
                 }}
                 source={{uri: customerOrderSelected.serviceImg}}
             />
           </View>
           <View style={styles.view}>
               <Text style={{
                 fontSize: 24,
                 fontWeight: '600',
               }}>
                 {customerOrderSelected.serviceName}
               </Text>
           </View>
           <View style={styles.view}>
               <Text style={{ fontSize: 16, fontWeight: '500' }}>
                 Customer Name:
               </Text>
               <Text style={{ fontSize: 16, fontWeight: '400' }}>
                 {customerOrderSelected.userName}
               </Text>
           </View>
           <View style={styles.view}>
               <Text style={{ fontSize: 16, fontWeight: '500' }}>
                 Customer Contact:
               </Text>
               <Text style={{ fontSize: 16, fontWeight: '400' }}>
                 {customerOrderSelected.contactNo}
               </Text>
           </View>
           <View style={styles.view}>
               <Text style={{ fontSize: 16, fontWeight: '500' }}>
                 Service Type:
               </Text>
               <Text style={{ fontSize: 16, fontWeight: '400' }}>
                 {customerOrderSelected.serviceType}
               </Text>
           </View>
           <View style={styles.view}>
               <Text style={{ fontSize: 16, fontWeight: '500' }}>
                 Description:
               </Text>
               <Text style={{ fontSize: 16, fontWeight: '400' }}>
                 {customerOrderSelected.serviceDescription}
               </Text>
           </View>
           <View style={styles.view}>
             <Text style={{ fontSize: 15, fontWeight: '500', color: 'red' }}>
               (Full Payment Will Only Be Made After Service)
             </Text>
             <View style={{ flexDirection: 'row' }}>
               <Text style={{ fontSize: 16, fontWeight: '500' }}>
                 Deposit Paid:{' '}
               </Text>
               <Text style={{ fontSize: 20, fontWeight: '500' }}>
                 RM {customerOrderSelected.serviceDeposit}
               </Text>
             </View>
           </View>
           <View>
             <Text style={{ fontSize: 16, fontWeight: '500' }}>
               Date Selected:
             </Text>
             <Text style={{ fontSize: 16, fontWeight: '500' }}>
               {moment(customerOrderSelected.serviceDate).format('DD-MMM-YYYY')}
             </Text>
           </View>
           <View style={{ paddingTop: 5 }}>
             <Text style={{ fontSize: 16, fontWeight: '500' }}>
               Time Selected:
             </Text>
             <Text style={{ fontSize: 16, fontWeight: '500' }}>
               {customerOrderSelected.serviceStartTime} - {customerOrderSelected.serviceEndTime}
             </Text>
           </View>
         </View>
 
         <View style={{ marginTop: 20, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
           <View>
               <Text style={{ fontSize: 20, fontWeight: '500' }}>
                 Status:
               </Text>
               <View style={styles.cancelButton}>
                 <Text style={{ fontSize: 22, fontWeight: '600' }}>
                   {customerOrderSelected.orderStatus}
                 </Text>
               </View>
           </View>
           {/* <View>
             <Text style={{ fontSize: 20, fontWeight: '500' }}>
               {' '}
             </Text>
             <TouchableOpacity style={styles.cancelButton}
                onPress={() => {
                    cancelOrder()
                }}
             >
                <Text style={{ fontSize: 22, fontWeight: '600', color: 'red' }}>
                 Cancel Order
               </Text>
             </TouchableOpacity>
           </View> */}
         </View>
    </View>
     : null }   
    </ScrollView>
  )
}

export default CustomerOrderScreen;

const styles = StyleSheet.create({
    renderCustOrder: {
        width: '100%',
        height: 100,
        //borderWidth: 1,
        borderRadius: 10,
        //margin: 10,
        padding: 5,
        backgroundColor: Colors.plum,
        shadowOffset: {
            width: 0,
            height: 5,
            },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 2,
    },
    text: {
        fontSize: 17,
        fontWeight: '600',
    },
    text1: {
        fontSize: 16,
        fontWeight: '500',
        width: '100%',
    },
    view: {
        paddingVertical: 5,
    },
    cancelButton: {
        borderRadius: 10,
        padding: 5,
        backgroundColor: Colors.white,
        shadowOffset: {
            width: 0,
            height: 5,
            },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 2,
    }
})