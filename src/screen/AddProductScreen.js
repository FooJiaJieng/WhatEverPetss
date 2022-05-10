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
import DateTimePicker from 'react-native-modal-datetime-picker';
import { v4 as uuidv4 } from 'uuid';
import { CommonStore } from '../../store/CommonStore';

//Firebase
import { authentication, db } from '../../constants/key';
import { collection, getDocs, setDoc, doc, updateDoc, increment, deleteDoc, } from 'firebase/firestore';


const AddProductScreen = props => {


const userSelected = CommonStore.useState(s => s.userSelected);
const serviceSelectedEdit = CommonStore.useState(s => s.serviceSelectedEdit);

//
const [showStartTimePicker, setShowStartTimePicker] = useState(false);
const [showEndTimePicker, setShowEndTimePicker] = useState([
    {
        showTimePicker: false,
    }
])

//Service Info
const [serviceID, setServiceID] = useState('');
const [serviceName, setServiceName] = useState('');
const [serviceDescription, setServiceDescription] = useState('');
const [serviceDeposit, setServiceDeposit] = useState(0.00);
const [serviceCat, setServiceCat] = useState('');
const [serviceDuration, setServiceDuration] = useState(0);
const [serviceTimeInfo, setServiceTimeInfo] = useState([
    {
        availableSlot: 0,
        startTime: "06:00",
        endTime: "18:30",
        endTimePickerVisible: false,
    },
]);

const [isMonday, setIsMonday] = useState(false);
const [isTuesday, setIsTuesday] = useState(false);
const [isWednesday, setIsWednesday] = useState(false);
const [isThursday, setIsThursday] = useState(false);
const [isFriday, setIsFriday] = useState(false);
const [isSaturday, setIsSaturday] = useState(false);
const [isSunday, setIsSunday] = useState(false);

useEffect(() => {
    if (serviceSelectedEdit) {
        setServiceName(serviceSelectedEdit.serviceName);
        setServiceDescription(serviceSelectedEdit.serviceDescription);
        setServiceDeposit(serviceSelectedEdit.serviceDeposit);
        setServiceCat(serviceSelectedEdit.serviceType);
        setServiceDuration(serviceSelectedEdit.serviceDuration);
        setServiceTimeInfo(serviceSelectedEdit.serviceTimeInfo);
        setIsMonday(serviceSelectedEdit.isMonday);
        setIsTuesday(serviceSelectedEdit.isTuesday);
        setIsWednesday(serviceSelectedEdit.isWednesday);
        setIsThursday(serviceSelectedEdit.isThursday);
        setIsMonday(serviceSelectedEdit.isMonday);
        setIsMonday(serviceSelectedEdit.isMonday);
    } else {
        setServiceName('');
        setServiceDescription('');
        setServiceDeposit(0);
        setServiceCat('');
        setServiceDuration('');
        setServiceTimeInfo([
            {
                availableSlot: 0,
                startTime: "06:00",
                endTime: "18:30",
                endTimePickerVisible: false,
            }
        ]);
        setIsMonday(false);
        setIsTuesday(false);
        setIsWednesday(false);
        setIsThursday(false);
        setIsMonday(false);
        setIsMonday(false);
    }
},[serviceSelectedEdit, userSelected])

//Update Service
const updateExistService = async () => {
    const userRef = doc(db, 'Service', serviceSelectedEdit.uniqueID);
    await updateDoc(userRef, {
        serviceStoreName: userSelected.storeName,
        serviceStoreContactNo: userSelected.storeContactNo,
        serviceStoreAddress: userSelected.storeAddress,
        serviceName: serviceName,
        serviceDescription: serviceDescription,
        serviceType: serviceCat,
        serviceDeposit: serviceDeposit,
        serviceDuration: serviceDuration,
        serviceTimeInfo: serviceTimeInfo,
        isMonday: isMonday,
        isTuesday: isTuesday,
        isWednesday: isWednesday,
        isThursday: isThursday,
        isFriday: isFriday,
        isSaturday: isSaturday,
        isSunday: isSunday,
    })
    .then(() => {
        Alert.alert(
            'Updated',
            'Successfully Updated Service',
            [{ text: 'OK', onPress: () => {
                navigation.goBack();
            } }],
            { cancelable: false },
        );
    })
      
}

const deleteService = async() => {
    const userRef = doc(db, 'Service', serviceSelectedEdit.uniqueID);
    await deleteDoc(userRef)
        .then(() => {
            Alert.alert(
                'Delete',
                'Successfully Deleted Service',
                [{ text: 'OK', onPress: () => {
                    navigation.goBack();
                } }],
                { cancelable: false },
            );
        })
        .catch(error => {
            // show an error alert
            alert(error);
        })
    
    const userRefs = doc(db, 'User', userSelected.uniqueID);
    await updateDoc(userRefs, {
        serviceInStore: increment(-1),
    })
    .then(() => {
    })
}

const updateServiceLength = async () => {
    const userRef = doc(db, 'User', userSelected.uniqueID);
    await updateDoc(userRef, {
        serviceInStore: increment(1),
    })
    .then(() => {
    })
      
}

const createNewService = async () => {

    var body = {
        uniqueID: uuidv4(),
        serviceImg: 'https://media.istockphoto.com/photos/group-of-pets-posing-around-a-border-collie-dog-cat-ferret-rabbit-picture-id1296353202?s=170667a',
        serviceName: serviceName,
        serviceStoreContactNo: userSelected.storeContactNo,
        serviceStoreAddress: userSelected.storeAddress,
        serviceDescription: serviceDescription,
        serviceType: serviceCat,
        serviceDeposit: serviceDeposit,
        serviceDuration: serviceDuration,
        serviceTimeInfo: serviceTimeInfo,
        isMonday: isMonday,
        isTuesday: isTuesday,
        isWednesday: isWednesday,
        isThursday: isThursday,
        isFriday: isFriday,
        isSaturday: isSaturday,
        isSunday: isSunday,
        createdAt: Date.now(),
        isActive: true,
        serviceStoreName: userSelected.storeName,
        sellerID: userSelected.uniqueID,
    }

   await setDoc(doc(db, 'Service', body.uniqueID), body).then(() => {
      navigation.goBack();
      console.log(body)
      Alert.alert('Success', 'Service Added Successfully')
    })
    
}

const renderServiceTimeInfo = ({item, index}) => {
    return (
        <View style={{ flexDirection: 'row', padding: 10, paddingTop: 5, width: Dimensions.get('screen').width, alignItems: 'center' }}>
            <View style={{ width: '29%', paddingRight: 8 }}>
                <TextInput
                    style={[
                        styles.textInput1
                    ,{ width: '50%' }]}
                    placeholder={'Slot'}
                    onChangeText={(text) => {
                        setServiceTimeInfo(
                            serviceTimeInfo.map((serviceInfo, i) =>
                              i === index
                                ? {
                                    ...serviceInfo,
                                    availableSlot: text,
                                    isChanged: true,
                                  }
                                : serviceInfo,
                            ),
                        );
                    }}
                    value={serviceTimeInfo[index].availableSlot < 1 ? '0' : serviceTimeInfo[index].availableSlot}
                />
            </View>
            <View style={{ width: '29%', paddingRight: 8 }}>
                    <TextInput
                        style={[
                            styles.textInput1
                        ,{ width: '80%' }]}
                        placeholder={'Start Time'}
                        keyboardType={'numeric'}
                        onChangeText={(text)=>{
                            setServiceTimeInfo(
                                serviceTimeInfo.map((serviceInfo, i) =>
                                i === index
                                    ? {
                                        ...serviceInfo,
                                        startTime: text,
                                        isChanged: true,
                                    }
                                    : serviceInfo,
                                ),
                            );
                        }}
                        value={serviceTimeInfo[index].startTime}
                    />
            </View>
            <View style={{ width: '29%' }}>
                <TextInput
                    style={[
                        styles.textInput1
                    ,{ width: '80%' }]}
                    placeholder={'End Time'}
                    keyboardType={'numeric'}
                    onChangeText={(text)=>{
                        setServiceTimeInfo(
                            serviceTimeInfo.map((serviceInfo, i) =>
                            i === index
                                ? {
                                    ...serviceInfo,
                                    endTime: text,
                                    isChanged: true,
                                }
                                : serviceInfo,
                            ),
                        );
                    }}
                    value={serviceTimeInfo[index].endTime}
                />
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setServiceTimeInfo([
                            ...serviceTimeInfo.slice(0, index),
                            ...serviceTimeInfo.slice(index + 1),
                        ])
                    }}
                >
                    <Ionicons name='trash' size={25} color='red'/>
                </TouchableOpacity>
            </View>
        </View>
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
          {serviceSelectedEdit? 'Edit Service' : 'Add Service'}
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
            // height: Dimensions.get('screen').height,
            // justifyContent: 'space-between',
            backgroundColor: Colors.white,
    }}
    >
        <View style={{
                padding: 10,
                //paddingHorizontal: 10,
                backgroundColor: Colors.white,
        }}>
            <View style={{
                paddingVertical: 5, 
            }}>
                <Image
                    source={{ uri: 'https://media.istockphoto.com/photos/group-of-pets-posing-around-a-border-collie-dog-cat-ferret-rabbit-picture-id1296353202?s=170667a'}}
                    style={{ width: '100%', height: 140, borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 5, }}
                />
            </View>
            <View style={{
                paddingVertical: 5,
            }}>
                <Text style={[
                    styles.text
                ]}>
                    Service Name
                </Text>
                <TextInput
                    style={[
                        styles.textInput
                    ]}
                    placeholder={'Service Name'}
                    onChangeText={(text)=>{
                        setServiceName(text)
                    }}
                    value={serviceName}
                />
            </View>
            <View style={{
                paddingVertical: 5,
            }}>
                <Text style={[
                    styles.text
                ]}>
                    Description
                </Text>
                <TextInput
                    style={[
                        styles.textInput
                    ,
                    { 
                        height: 140,
                    }]}
                    multiline={true}
                    placeholder={'Description'}
                    onChangeText={(text)=>{
                        setServiceDescription(text)
                    }}
                    value={serviceDescription}
                />
            </View>
            <View style={{
                paddingVertical: 5,
            }}>
                <Text style={[
                    styles.text
                ]}>
                    Deposit
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.text}>
                        RM{' '}
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput
                        ,{ width: '40%' }]}
                        placeholder={'RM'}
                        onChangeText={(text)=>{
                            setServiceDeposit(text)
                        }}
                        value={serviceDeposit}
                    />
                </View>
            </View>
            <View style={{
                paddingVertical: 5,
            }}>
                <Text style={[
                    styles.text
                ]}>
                    Service Type
                </Text>
                <View
                    style={{ 
                        width: 190, 
                        height: 35,
                        borderRadius: 5,
                        backgroundColor: Colors.white,
                        shadowOffset: {
                        width: 0,
                        height: 5,
                        },
                        shadowOpacity: 0.4,
                        shadowRadius: 10,
                        elevation: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={{
                        inputIOS: {fontSize: 16, padding: 5, },
                        inputAndroid: {fontSize: 16, padding: 5},
                        inputAndroidContainer: {
                            width: '100%',
                        },
                        }}
                        placeholder={'Service Type'}
                        placeholderStyle={{ color: Colors.black }}
                        items={[
                            { label: 'Bath Only', value: 'Bath Only' },
                            { label: 'Grooming', value: 'Grooming' },
                            { label: 'Veterinaty', value: 'Veterinary' }
                        ]}
                        value={serviceCat}
                        onValueChange={(value) => {
                            setServiceCat(value)
                            console.log(serviceCat)
                        }}
                    />
                </View>
            </View>
            <View style={{
                paddingVertical: 5,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[
                        styles.text
                    ]}>
                        Duration For Each Service
                    </Text>
                    <Text style={{ fontWeight: '800', fontSize: 16 }}>
                        {' '}*Minutes
                    </Text>
                </View>
                <TextInput
                    style={[
                        styles.textInput
                    ,{ width: '40%' }]}
                    placeholder={'Duration (Minutes)'}
                    onChangeText={(text)=>{
                        setServiceDuration(text)
                    }}
                    value={serviceDuration}
                />
            </View>
            <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>
                    Service Booking Info
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        flexDirection: 'row',
                        paddingBottom: 5,
                        width: '29%',
                        paddingRight: 8,
                    }}>
                        <Text style={[
                            styles.text1
                        ]}>
                            Slot
                        </Text>
                        <Text style={{
                            paddingVertical: 5,
                            fontSize: 10 
                        }}>
                            {' '}*Each Time
                        </Text>
                    </View>
                    <View style={{
                        width: '29%',
                        paddingRight: 8,
                    }}>
                        <Text style={[
                            styles.text1
                        ]}>
                            Start Time
                        </Text>
                    </View>
                    <View style={{
                        width: '29%',
                    }}>
                        <Text style={[
                            styles.text1
                        ]}>
                            End Time
                        </Text>
                    </View>
                </View>
                <View style={{ minHeight: 40 }}>
                    <FlatList
                        data={serviceTimeInfo}
                        extraData={serviceTimeInfo}
                        renderItem={renderServiceTimeInfo}
                        keyExtractor={(item, index) => String(index)}
                        style={{ margin: -10 }}
                        //contentContainerStyle={{ width: Dimensions.get('screen').width }}
                    />
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                paddingTop: 10,
                            }}
                            onPress={() =>{
                                setServiceTimeInfo([
                                    ...serviceTimeInfo,
                                    {
                                        availableSlot: 0,
                                        startTime: '06:00',
                                        endTime: '18:30',
                                        endTimePickerVisible: false,
                                    }
                                ])
                                console.log(serviceTimeInfo.length)
                            }}
                        >
                            <Ionicons
                                name='md-add-circle-outline'
                                size={30}
                            />
                        </TouchableOpacity>
                </View>
            </View>
            {/* <View style={{
                paddingVertical: 5,
            }}>
                <Text style={[
                    styles.text
                ]}>
                    Available Day
                </Text>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckBox
                                onClick={()=>{
                                    if (isMonday == false) {
                                        setIsMonday(true) 
                                    } else if ( isMonday == true) {
                                        setIsMonday(false)
                                    }
                                }}
                                isChecked={isMonday}
                                checkBoxColor={'green'}
                                uncheckedCheckBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.mediumPurple}
                                style={styles.checkbox}
                        />
                        <Text style={[isMonday? styles.availableTextCheck : styles.availableTextUnCheck]}>
                            Monday
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <CheckBox
                                onClick={()=>{
                                    if (isTuesday == false) {
                                        setIsTuesday(true) 
                                    } else if ( isTuesday == true) {
                                        setIsTuesday(false)
                                    }
                                }}
                                isChecked={isTuesday}
                                checkBoxColor={'green'}
                                uncheckedCheckBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.mediumPurple}
                                style={styles.checkbox}
                        />
                        <Text style={[isTuesday? styles.availableTextCheck : styles.availableTextUnCheck]}>
                            Tuesday
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <CheckBox
                                onClick={()=>{
                                    if (isWednesday == false) {
                                        setIsWednesday(true) 
                                    } else if ( isWednesday == true) {
                                        setIsWednesday(false)
                                    }
                                }}
                                isChecked={isWednesday}
                                checkBoxColor={'green'}
                                uncheckedCheckBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.mediumPurple}
                                style={styles.checkbox}
                        />
                        <Text style={[isWednesday? styles.availableTextCheck : styles.availableTextUnCheck]}>
                            Wednesday
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <CheckBox
                                onClick={()=>{
                                    if (isThursday == false) {
                                        setIsThursday(true) 
                                    } else if ( isThursday == true) {
                                        setIsThursday(false)
                                    }
                                }}
                                isChecked={isThursday}
                                checkBoxColor={'green'}
                                uncheckedCheckBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.mediumPurple}
                                style={styles.checkbox}
                        />
                        <Text style={[isThursday? styles.availableTextCheck : styles.availableTextUnCheck]}>
                            Thursday
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <CheckBox
                                onClick={()=>{
                                    if (isFriday == false) {
                                        setIsFriday(true) 
                                    } else if ( isFriday == true) {
                                        setIsFriday(false)
                                    }
                                }}
                                isChecked={isFriday}
                                checkBoxColor={'green'}
                                uncheckedCheckBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.mediumPurple}
                                style={styles.checkbox}
                        />
                        <Text style={[isFriday? styles.availableTextCheck : styles.availableTextUnCheck]}>
                            Friday
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <CheckBox
                                onClick={()=>{
                                    if (isSaturday == false) {
                                        setIsSaturday(true) 
                                    } else if ( isSaturday == true) {
                                        setIsSaturday(false)
                                    }
                                }}
                                isChecked={isSaturday}
                                checkBoxColor={'green'}
                                uncheckedCheckBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.mediumPurple}
                                style={styles.checkbox}
                        />
                        <Text style={[isSaturday? styles.availableTextCheck : styles.availableTextUnCheck]}>
                            Saturday
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <CheckBox
                                onClick={()=>{
                                    if (isSunday == false) {
                                        setIsSunday(true) 
                                    } else if ( isSunday == true) {
                                        setIsSunday(false)
                                    }
                                }}
                                isChecked={isSunday}
                                checkBoxColor={'green'}
                                uncheckedCheckBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.mediumPurple}
                                style={styles.checkbox}
                        />
                        <Text style={[isSunday? styles.availableTextCheck : styles.availableTextUnCheck]}>
                            Sunday
                        </Text>
                    </View>
                </View>
            </View> */}
        </View>
        <View 
            style={{
                width: '100%',
                alignItems: 'center',
                padding: 5,
                marginTop: 20,
                paddingBottom: 20,
        }}>
            { serviceSelectedEdit ?
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                    width: 110,
                    height: 40,
                    //borderWidth: 1,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.aliceBlue,
                    shadowOffset: {
                        width: 0,
                        height: 5,
                        },
                        shadowOpacity: 0.4,
                        shadowRadius: 10,
                        elevation: 2,
                }}
                    onPress={() => {
                        updateExistService()
                    }}
                >
                    <Text style={ styles.text }>
                        Update
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: 110,
                    height: 40,
                    //borderWidth: 1,
                    marginLeft: 15,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.aliceBlue,
                    shadowOffset: {
                        width: 0,
                        height: 5,
                        },
                        shadowOpacity: 0.4,
                        shadowRadius: 10,
                        elevation: 2,
                }}
                    onPress={() => {
                        Alert.alert('Alert', 'Delete Selected Service?',
                            [{
                                text: 'Delete', onPress:() => {
                                    deleteService()
                                }
                            },
                            {
                                text: 'Cancel', onPress:() => {}
                            }]
                            );
                    }}
                >
                    <Text style={[styles.text,{ color: 'red', fontWeight: '600' }]}>
                        DELETE
                    </Text>
                </TouchableOpacity>
            </View>
            :
                <TouchableOpacity style={{
                    width: 130,
                    height: 40,
                    //borderWidth: 1,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.aliceBlue,
                    shadowOffset: {
                        width: 0,
                        height: 5,
                        },
                        shadowOpacity: 0.4,
                        shadowRadius: 10,
                        elevation: 2,
                }}
                    onPress={() => {
                        if (!userSelected.storeName) {
                            Alert.alert('Alert', 'Please provide your store name first at Seller Profile first.')
                        } 
                        else if (!userSelected.storeAddress) {
                            Alert.alert('Alert', 'Please provide your store address first at Seller Profile first.')
                        } 
                        else {
                        createNewService();
                        updateServiceLength();
                        }
                    }}
                >
                    <Text style={ styles.text }>
                        Upload
                    </Text>
                </TouchableOpacity>
            }
        </View>
    </ScrollView>
);

}

const styles = StyleSheet.create({
  text: {
      paddingVertical: 5,
      fontSize: 17,
      fontWeight: '500',
  },
  text1: {
    paddingVertical: 5,
    fontSize: 13,
    fontWeight: '400',
  },
  textInput: {
      height: 35,
      width: '100%',
      //borderWidth: 1,
      borderRadius: 5,
      backgroundColor: Colors.white,
      paddingHorizontal: 5,
      fontSize: 17,
      //backgroundColor: Colors.white,
      shadowOffset: {
        width: 0,
        height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 2,
  },
  textInput1: {
    height: 35,
    width: '100%',
    //borderWidth: 1,
    borderRadius: 5,
    //backgroundColor: Colors.azure,
    paddingHorizontal: 5,
    fontSize: 17,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 1,
  },
  availableTextCheck: {
      fontSize: 16,
      fontWeight: '500',
      //color: Colors.mediumPurple,
      marginLeft: 5,
  },
  availableTextUnCheck: {
    fontSize: 16,
    fontWeight: '400',
    color: 'grey',
    marginLeft: 5,

},

});

export default AddProductScreen;
