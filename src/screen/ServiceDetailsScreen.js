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


const serviceSelected = CommonStore.useState(s => s.serviceSelected);
const userList = CommonStore.useState(s => s.userList);


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
            //minHeight: Dimensions.get('screen').height,
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
          setSelectedServiceDate(date)
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
          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            {serviceSelected.serviceTimeInfo.map((timeInfo, i) => {
              return (  
                <View style={{
                    backgroundColor: Colors.white,
                    borderRadius: 10,
                    marginRight: 8,
                    shadowOffset: {
                      width: 0,
                      height: 4,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      elevation: 1,
                }}>
                  <TouchableOpacity 
                    style={styles.pickTime}
                    onPress={() => {
                      setShowDatePicker(true);
                      setSelectedServiceStartTime(timeInfo.startTime)
                      setSelectedServiceEndTime(timeInfo.endTime)
                      //setSelectedServiceSlot(timeInfo.availableSlot - 1)
                    }}
                  >
                    <Text>
                      {timeInfo.startTime} - {timeInfo.endTime} 
                    </Text>
                    <Text>
                      Slot Left: {timeInfo.availableSlot}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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
                {moment(selectedServiceDate).format('DD-MMM-YYYY')}
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
            <Text>
              Amount To Pay: RM {serviceSelected.serviceDeposit}
            </Text>
          </View>
          <TouchableOpacity style={styles.makeReservation}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
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
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
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
    flexWrap: 'wrap',
  }
});
export default ServiceDetailsScreen