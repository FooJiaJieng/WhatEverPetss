import { authentication, db } from '../constants/key';
import { collection, doc, getDoc, getDocs, onSnapshot, query } from "firebase/firestore";
import { CommonStore } from '../store/CommonStore';

export const CollectionFunc = async () => {

    //User
    const userRef = query(collection(db, 'User'));

    onSnapshot(userRef, (qSnapshot) => {
        const userTemp = [];
        qSnapshot.forEach((doc) => {
            userTemp.push({...doc.data(), docID: doc.id });
        })
        CommonStore.update(s => {
            s.userList = userTemp;
        });
    });

    //Service
    const serviceRef = query(collection(db, 'Service'));

    onSnapshot(serviceRef, (qSnapshot) => {
        const serviceTemp = [];
        qSnapshot.forEach((doc) => {
            serviceTemp.push({...doc.data(), docID: doc.id });
        })
        CommonStore.update(s => {
            s.serviceList = serviceTemp;
        });
    });

    //Orders
    const orderRef = query(collection(db, 'Order'));

    onSnapshot(orderRef, (qSnapshot) => {
        const orderTemp = [];
        qSnapshot.forEach((doc) => {
            orderTemp.push({...doc.data(), docID: doc.id });
        })
        CommonStore.update(s => {
            s.order = orderTemp;
        });
    });
}