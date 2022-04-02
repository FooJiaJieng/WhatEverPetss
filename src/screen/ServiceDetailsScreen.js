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
import { CommonStore } from '../../store/CommonStore';

//Firebase
import { authentication, db } from '../../constants/key';
import { collection, getDocs, setDoc, doc, updateDoc, increment } from 'firebase/firestore';

const ServiceDetailsScreen = props => {

const serviceSelected = CommonStore.useState(s => s.serviceSelected);

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
    <View>
      <Text>ServiceDetailsScreen</Text>
    </View>
  )
}

export default ServiceDetailsScreen