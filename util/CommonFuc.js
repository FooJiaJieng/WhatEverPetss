// import { collection, getDocs, getFirestore, onSnapshot} from 'firebase/firestore/lite';
// import { CommonStore } from '../store/CommonStore';
// import { db } from '../constants/key';

// export const GetData = () => {


//     const userCol = collection(db, 'User');
//     const userSnapshot = getDocs(userCol);
//     const userList = userSnapshot.docs.map((doc) => ({...doc.data()}));

//     CommonStore.update(s => {
//         s.userList = userList;
//     });
// }
