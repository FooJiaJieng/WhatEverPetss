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
    Alert,
    Modal,
    Dimensions,
    Platform,
    ActivityIndicator,
  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constant/Colors';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { CommonStore } from '../../store/CommonStore';

//Firebase
import { authentication, db } from '../../constants/key';
import { collection, getDocs, setDoc, doc, updateDoc, increment } from 'firebase/firestore';

const ServiceDetailsScreen = props => {

const [storeName, setStoreName] = useState([]);
const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedServiceDate, setSelectedServiceDate] = useState(Date.now());
const [selectedServiceStartTime, setSelectedServiceStartTime] = useState('');
const [selectedServiceEndTime, setSelectedServiceEndTime] = useState('');
const [selectedServiceSlot, setSelectedServiceSlot] = useState(0);
const [serviceTimeInfo, setServiceTimeInfo] = useState([
  {
      availableSlot: 0,
      startTime: "06:00",
      endTime: "18:30",
      endTimePickerVisible: false,
  },
]);

const [date, setDate] = useState(moment().add(1, 'days').calendar());

const serviceSelected = CommonStore.useState(s => s.serviceSelected);
const userList = CommonStore.useState(s => s.userList);
const userSelected = CommonStore.useState(s => s.userSelected);
const order = CommonStore.useState(s => s.order);
const userOrderSelected = CommonStore.useState(s => s.userOrderSelected);



useEffect(() => {
  setServiceTimeInfo(serviceSelected.serviceTimeInfo);
},[serviceSelected])
console.log(serviceTimeInfo);

//Update Available Slot
const updateAvailableSlot = async () => {
  const userRef = doc(db, 'Service', serviceSelected.uniqueID);
  await updateDoc(userRef, {
      serviceTimeInfo: serviceTimeInfo,
  });
}

//Deduct User Wallet
const deductUserWallet = async () => {
  const userRef = doc(db, 'User', userSelected.uniqueID);
  await updateDoc(userRef, {
      walletAmount: increment(-serviceSelected.serviceDeposit),
  });
}

const createServiceOrder = async () => {

  if(userSelected.walletAmount >= serviceSelected.serviceDeposit) {
    
    updateAvailableSlot();
    deductUserWallet();
    
    var body = {
      uniqueID: uuidv4(),
      orderID: (`${(userSelected.userName).slice(0,3)}${(userOrderSelected.length + 1).toString().padStart(4, '0')}`),
      serviceImg: serviceSelected.serviceImg,
      serviceName: serviceSelected.serviceName,
      serviceDescription: serviceSelected.serviceDescription,
      serviceType: serviceSelected.serviceType,
      serviceDeposit: serviceSelected.serviceDeposit,
      serviceDuration: serviceSelected.serviceDuration,
      serviceDate: selectedServiceDate,
      serviceStartTime: selectedServiceStartTime,
      serviceEndTime: selectedServiceEndTime,
      createdAt: Date.now(),
      sellerID: serviceSelected.sellerID,
      sellerContactNo: serviceSelected.serviceStoreContactNo,
      userID: userSelected.uniqueID,
      userName: userSelected.userName,
      userContactNo: userSelected.contactNo,
      orderStatus: 'ORDERED',
    }

    await setDoc(doc(db, 'Order', body.uniqueID), body).then(() => {
      navigation.goBack();
      console.log(body)
      Alert.alert('Success', 'Order Added Successfully')
    })
  } else {
    Alert.alert('Alert', 'Insufficient Wallet Amount',
    [
    { text: 'Top Up', onPress: () => {
        navigation.navigate('BuyerProfile');
      }
    },
    {
      text: 'Cancel', onPress: () => { }
    }
    ],
    );
  }
}


const renderServiceTimeInfo = ({item, index}) => {
  return (
    <TouchableOpacity
      disabled={serviceTimeInfo[index].availableSlot < 1 ? true : false}
      style={ serviceTimeInfo[index].availableSlot < 1 ? styles.pickTimeFull : styles.pickTime}
      onPress={() => {
        setShowDatePicker(true);
        setSelectedServiceStartTime(serviceTimeInfo[index].startTime)
        setSelectedServiceEndTime(serviceTimeInfo[index].endTime)
        const value = 1;
        setServiceTimeInfo(
            serviceTimeInfo.map((serviceInfo, i) =>
              i === index
                ? {
                    ...serviceInfo,
                    availableSlot: serviceInfo.availableSlot - value,
                    isChanged: true,
                  }
                : serviceInfo,
            ),
        );
      }}
    >
      <View style={{ }}>
        { serviceTimeInfo[index].availableSlot < 1 ?
          <Text style={{ fontWeight:'600', color: 'grey' }}>
            {serviceTimeInfo[index].startTime} - {serviceTimeInfo[index].endTime}
          </Text>
        :
          <Text style={{ fontWeight:'600' }}>
            {serviceTimeInfo[index].startTime} - {serviceTimeInfo[index].endTime}
          </Text>
        }
      </View>
      <View style={{  }}>
        { serviceTimeInfo[index].availableSlot < 1 ?
          <Text style={{ fontWeight:'600', color: 'grey' }}>
            Slot Full
          </Text>
        :
          <Text style={{ fontWeight:'600' }}>
            Slot Left: {serviceTimeInfo[index].availableSlot}
          </Text>
        }
      </View>
    </TouchableOpacity>
  )
}

const { navigation, route } = props;

navigation.setOptions({
  headerLeft: () => (
    <TouchableOpacity style={{
    }} 
    onPress={() => { 
        props.navigation.goBack();
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
          {serviceSelected.serviceStoreName}
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
    }}
    >
      <DateTimePicker
        isVisible={showDatePicker}
        mode={'date'}
        display={'default'}
        minimumDate={Date.now()}
        
        onConfirm={(date) => {
          setShowDatePicker(false)
          setSelectedServiceDate(date.toDateString())
          console.log(date.toDateString())
        }}
        onCancel={() => {
          setShowDatePicker(false)
        }}
      />
      <View style={{ 
        backgroundColor: Colors.white,
        //height: '100%',
        padding: 10,
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
                source={{uri: serviceSelected.serviceImg}}
            />
          </View>
          <View style={styles.view}>
              <Text style={{
                fontSize: 24,
                fontWeight: '600',
              }}>
                {serviceSelected.serviceName}
              </Text>
          </View>
          <View style={styles.view}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Contact Number:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '400' }}>
                
              </Text>
          </View>
          <View style={styles.view}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Service Type:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '400' }}>
                {serviceSelected.serviceType}
              </Text>
          </View>
          <View style={styles.view}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Description:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '400' }}>
                {serviceSelected.serviceDescription}
              </Text>
          </View>
          <View style={styles.view}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: 'red' }}>
              (Full Payment Will Only Be Made After Service)
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Deposit:{' '}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '500' }}>
                RM {serviceSelected.serviceDeposit}
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              Time Available:
            </Text>
          </View>
          <View style={{ marginTop: 5, }}>
            <FlatList
                data={serviceTimeInfo}
                extraData={serviceTimeInfo}
                renderItem={renderServiceTimeInfo}
                keyExtractor={(item, index) => String(index)}
                style={{ margin: -10 }}
                numColumns={2}
            />
          </View>
        </View>
        <View style={{ paddingVertical: 20 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '500',
          }}>
            Service Reservation Selected
          </Text>
          <View style={{ flexDirection: 'row', paddingTop: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: '500', width: 145, }}>
              Date Selected:
            </Text>
            <Text style={{ fontSize: 17, fontWeight: '500', width: 145, marginLeft: 15 }}>
              Time Selected:
            </Text>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 3 }}>
            <View style={styles.selectedDateTime}>
              <Text style={styles.selectedDateTimeText}>
                {selectedServiceDate ? moment(selectedServiceDate).format('DD-MMM-YYYY') : 'Select A Date' }
              </Text>
            </View>
            <View style={[styles.selectedDateTime,{ marginLeft: 15 }]}>
              <Text style={styles.selectedDateTimeText}>
                {selectedServiceStartTime} - {selectedServiceEndTime}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomBar}>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '600' }}>
              Total: RM {serviceSelected.serviceDeposit}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.makeReservation}
            onPress={() => {
              Alert.alert(
                'Alert',
                'Confirm Order?',
                [
                  { text: 'OK', onPress: () => {
                    createServiceOrder()
                    } 
                  },
                  {
                   text: 'Cancel', onPress: () => {} 
                  }
                ],
              );
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
              Make Reservation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  view: {
    paddingVertical: 5,
  },
  pickTime: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  },
  pickTimeFull: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    margin: 10,
    //borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  },
  selectedDateTime: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 35,
    width: 145,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  },
  selectedDateTimeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomBar: {
    width: '100%',
    height: 60,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  },
  makeReservation: {
    borderWidth: 1,
    borderRadius: 10,
    flexWrap: 'wrap',
    padding: 5,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 5,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 2,
  }
});
export default ServiceDetailsScreen