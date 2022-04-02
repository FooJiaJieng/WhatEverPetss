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
import { CommonStore } from '../../store/CommonStore';

//Firebase
import { authentication, db } from '../../constants/key';
import { collection, getDocs, setDoc, doc, updateDoc, increment } from 'firebase/firestore';

const ServiceDetailsScreen = props => {

const [serviceSelectedTimeInfo, setServiceSelectedTimeInfo] = useState([
  {
    availableSlot: 0,
    startTime: "",
    endTime: "",
    endTimePickerVisible: false,
  },
]); 
//const [serviceSelectedTimeInfo, setServiceSelectedTimeInfo] = useState([]);

const serviceSelected = CommonStore.useState(s => s.serviceSelected);

useEffect(() => {
  var timeInfoTemp = [];

  for(var i = 0; i < serviceSelected.serviceTimeInfo.length; i++ ){
    const timeInfo = serviceSelected.serviceTimeInfo;
    timeInfoTemp.push(timeInfo);
  }

  setServiceSelectedTimeInfo(timeInfoTemp);
  console.log(serviceSelectedTimeInfo);

},[serviceSelected]);


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
          {serviceSelected.serviceName}
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
                    height: 180,
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
              <Text>
                {serviceSelected.serviceDescription}
              </Text>
          </View>
          <View style={styles.view}>
              <Text>
                Deposit: (Full Payment Will Be Made After Service)
              </Text>
              <Text>
                RM {serviceSelected.serviceDeposit}
              </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {serviceSelected.serviceTimeInfo.map((timeInfo, i) => {
              return (  
                <View style={{ marginRight: 8 }}>
                  <TouchableOpacity style={styles.pickTime}>
                    <Text>
                      {timeInfo.startTime} - {timeInfo.endTime}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

           <Text>
           </Text>
          </View>
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
    shadowOffset: {
      width: 0,
      height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 1,
  },

});
export default ServiceDetailsScreen