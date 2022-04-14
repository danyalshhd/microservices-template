import firebase from 'firebase-admin'


const initializeFirebaseSDK=(serviceAccount: any)=>{
  const rep=firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  });
  console.info("Initialized Firebase SDK");
}


export{initializeFirebaseSDK as initializeFirebaseSDK };