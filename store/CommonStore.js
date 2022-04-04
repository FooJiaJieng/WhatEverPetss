import { Store } from 'pullstate';

export const CommonStore = new Store({

    isLoggedIn: false,
    userType: 'CUSTOMER',

    userID: '', //For register acc only
    userList: [], //Store all user data
    userSelected: {}, //Store logged in user data
    userSelectedID: '', // Store logged in user ID

    serviceList: [],
    sellerServiceList: [],
    serviceSelected: null,
    serviceSelectedEdit: null,

    order: [], //All Order
    userOrderSelected: [], //Selected User Order Bought
    userReceiptSelected: {}, //Selected User Order Bought Selected

    customerOrderList: [], //Customer All Order
    customerOrderSelected: {}, //Customer Order Selected
});

export const ServiceStatus = [
    { 
        name: 'Arrived', 
        id: 'ARRIVED',
    },
    { 
        name: 'Cancelled', 
        id: 'CANCELLED',
    },
]