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
    serviceCategorySelected: [],
    serviceSelected: {},
    serviceSelectedEdit: null,

    customerOrder: [],
    selectedCustomerOrder: [],

});