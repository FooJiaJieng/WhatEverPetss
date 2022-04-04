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

//Firebase
import { authentication, db } from '../../constants/key';
import { collection, getDocs, setDoc, doc, updateDoc, increment } from 'firebase/firestore';


const BuyerReceiptScreen = props => {

const VIEW_PURCHASE_HISTORY = {
  YES: 'VIEW_PURCHASE_HISTORY.YES',
  NO: 'VIEW_PURCHASE_HISTORY.NO',
};

const [viewPurchaseHistorySelected, setViewPurchaseHistorySelected] = useState(VIEW_PURCHASE_HISTORY.NO);
const [selectedUserOrderList, setSelectedUserOrderList] = useState([]);

const userSelected = CommonStore.useState(s => s.userSelected);
const userReceiptSelected = CommonStore.useState(s => s.userReceiptSelected);
const userOrderSelected = CommonStore.useState(s => s.userOrderSelected);
const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
const serviceSelected = CommonStore.useState(s => s.serviceSelected);
const order = CommonStore.useState(s => s.order);

useEffect(() => {
  CollectionFunc();
});

useEffect(() => {
  var myOrderTemp = [];
  for (var i = 0; i < order.length; i++) {
      if (order[i].userID === userSelected.uniqueID) {
          const myService = order[i]
          myOrderTemp.push(myService);
      }
  }
  setSelectedUserOrderList(myOrderTemp);
  CommonStore.update(s => {
      s.userOrderSelected = selectedUserOrderList;
  })
},[serviceSelected, userSelected, isLoggedIn, userReceiptSelected])

const cancelOrder = async () => {
  const orderRef = doc(db, 'Order', userReceiptSelected.uniqueID);
  await updateDoc(orderRef, {
    orderStatus: 'CANCELLED'
  })
  .then(() => {
    Alert.alert(
      'Cancelled',
      'You have cancelled the service',
      [{ text: 'OK', onPress: () => {
          navigation.goBack();
      } }],
      { cancelable: false },
  );
  })
}

const returnMoneyToWallet = async () => {
  const userRef = doc(db, 'User', userSelected.uniqueID);
  await updateDoc(userRef, {
    walletAmount: increment(userReceiptSelected.serviceDeposit),
  })
  .then(() => {

  })
}

const releaseMoneyToStore = async () => {
  const userRef = doc(db, 'User', userReceiptSelected.sellerID);
  await updateDoc(userRef, {
    storeWallet: increment(userReceiptSelected.serviceDeposit),
  })
  .then(() => {

  })
}

const updateStatus = async () => {
  const orderRef = doc(db, 'Order', userReceiptSelected.uniqueID);
  await updateDoc(orderRef, {
    orderStatus: 'ARRIVED'
  })
  .then(() => {
    Alert.alert(
      'Arrived',
      'You have arrived the store',
      [{ text: 'OK', onPress: () => {
          navigation.goBack();
      } }],
      { cancelable: false },
  );
  })
}

const renderReceipt =({item, index}) => {
  return(
    <View style={{ padding: 10, paddingHorizontal: 15, marginBottom: 3 }}>
      <TouchableOpacity style={{
          width: '100%',
          height: 120,
          padding: 5,
          borderWidth: 1,
          borderColor: '#E5E5E5',
          borderRadius: 5,
          backgroundColor: Colors.lavender,
          shadowOffset: {
              width: 0,
              height: 5,
              },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 2,
      }}
          onPress={() => {
            setViewPurchaseHistorySelected(VIEW_PURCHASE_HISTORY.YES)
            CommonStore.update(s => {
                  s.userReceiptSelected = item;
              })
          }}
      >
          <View>
              {/* <Image
                  source={item.serviceImg}
                  style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  borderWidth: 1,
                  marginRight: 10,
                  }}
              /> */}
          </View>
          <Text>{moment(item.createdAt).format('DD-MMM-YYYY')}</Text>
          <Text>{item.serviceName}</Text>
          <Text>{item.serviceType}</Text>
          <Text>{moment(item.serviceDate).format('DD-MMM-YYYY')}</Text>
          <Text>{item.serviceStartTime} - {item.serviceEndTime}</Text>
          <Text>RM {item.serviceDeposit}</Text>
          <Text>{moment(item.createdAt).format('DD-MMM-YYYY hh:mm')}</Text>
          <Text>{item.orderStatus}</Text>
      </TouchableOpacity>
    </View>
  )
};

const { navigation, route } = props;

navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity style={{
      }} 
      onPress={() => { 
        { viewPurchaseHistorySelected === VIEW_PURCHASE_HISTORY.NO ?
            navigation.goBack()
        :
        viewPurchaseHistorySelected === VIEW_PURCHASE_HISTORY.YES ?
            setViewPurchaseHistorySelected(VIEW_PURCHASE_HISTORY.NO)
        :
        null
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
              Your Receipt
        </Text>
      </View>
    ),
    headerRight: () => (
        <View></View>
    ),
  });

  return (
    <ScrollView 
        contentContainerStyle={{
        minHeight: Dimensions.get('screen').height,
        //justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: 10,
        paddingHorizontal: 5,
        backgroundColor: Colors.white
    }}
    >
    { viewPurchaseHistorySelected === VIEW_PURCHASE_HISTORY.NO ?
      <FlatList
          data={selectedUserOrderList.slice(0).sort((a, b) => {
              return moment(b[selectedUserOrderList.createdAt]).valueOf() - moment(a[selectedUserOrderList.createdAt]).valueOf();
          })}
          renderItem={renderReceipt}
          keyExtractor={(item, index) => index.toString()}
          style={{ margin: -10 }}
      />
    :
    viewPurchaseHistorySelected === VIEW_PURCHASE_HISTORY.YES ?
     <View style={{ 
       backgroundColor: Colors.white,
       padding: 0
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
                source={{uri: userReceiptSelected.serviceImg}}
            />
          </View>
          <View style={styles.view}>
              <Text style={{
                fontSize: 24,
                fontWeight: '600',
              }}>
                {userReceiptSelected.serviceName}
              </Text>
          </View>
          <View style={styles.view}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Service Type:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '400' }}>
                {userReceiptSelected.serviceType}
              </Text>
          </View>
          <View style={styles.view}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Description:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '400' }}>
                {userReceiptSelected.serviceDescription}
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
                RM {userReceiptSelected.serviceDeposit}
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              Date Selected:
            </Text>
            <Text>
              {moment(userReceiptSelected.serviceDate).format('DD-MMM-YYYY')}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              Time Selected:
            </Text>
            <Text>
              {userReceiptSelected.serviceStartTime} - {userReceiptSelected.serviceEndTime}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
              <Text style={{ fontSize: 20, fontWeight: '500' }}>
                Status:
              </Text>
              <View style={styles.button}>
                <Text style={{ fontSize: 22, fontWeight: '600' }}>
                  {userReceiptSelected.orderStatus}
                </Text>
              </View>
          </View>
          { userReceiptSelected.orderStatus === 'ORDERED' ?
          <View>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>
              {' '}
            </Text>
            <TouchableOpacity style={styles.button}
              onPress={() => {
                Alert.alert(
                  'Alert',
                  'Arrived The Service Store?',
                  [
                    { text: 'OK', onPress: () => {
                      updateStatus();
                      releaseMoneyToStore();
                    } 
                    },
                    {
                     text: 'Cancel', onPress: () => {} 
                    }
                  ],
                );
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.mediumPurple }}>
                Arrive
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{ marginTop: 15 }]}
              onPress={() => {
                Alert.alert(
                  'Alert',
                  'Cancel Order?',
                  [
                    { text: 'OK', onPress: () => {
                      cancelOrder();
                      returnMoneyToWallet();
                      } 
                    },
                    {
                     text: 'Cancel', onPress: () => {} 
                    }
                  ],
                );
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '600', color: 'red' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          :
          null}
        </View>
         
     </View>
     :
     null }
    </ScrollView>
  )
}

export default BuyerReceiptScreen

const styles = StyleSheet.create({
  view: {
    paddingVertical: 5,
  },
  button: {
    width: 140,
    alignItems: 'center',
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