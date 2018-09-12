import { toastr } from 'react-redux-toastr';
import {reset} from 'redux-form';
import { GET_DISTANCE_MATRIX, GET_FARE, FETCH_SUBSCRIPTIONS } from './subscriptionConstants';
import request from '../../app/common/util/request';
import calculateFare from '../../app/common/util/fareCalculator';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import firebase from '../../app/config/firebase';
import { updateSubscribe } from '../user/userActions';

export const getSelectedAddress = (selectedPickUp, selectedDropOff, subscriptionType) => {
    return async (dispatch, getState) => {
      dispatch(asyncActionStart());
      const dummyNumbers ={
		baseFare:60,
		timeRate:0.14,
		distanceRate:1,
		surge:1
	  }
      request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
		.query({
			origins: selectedPickUp.latitude + "," + selectedPickUp.longitude,
			destinations: selectedDropOff.latitude + "," + selectedDropOff.longitude,
			mode:"driving",
			key:"AIzaSyDUYbTR-3PDWPhgxjENs4yf35g2eHc641s"
		})
		.finish((error, res)=>{
            if (error) {
                console.log(error);
            } else {
                dispatch({
    				type:GET_DISTANCE_MATRIX,
    				payload:res.body
    			});
            }
		});
        setTimeout(function(){
			if(selectedPickUp && selectedDropOff){
                console.log("Error fill here", getState().subscription.distanceMatrix);
				const fare = calculateFare(
					dummyNumbers.baseFare,
					dummyNumbers.timeRate,
					getState().subscription.distanceMatrix.rows[0].elements[0].duration.value,
					dummyNumbers.distanceRate,
					getState().subscription.distanceMatrix.rows[0].elements[0].distance.value,
					dummyNumbers.surge,
                    subscriptionType
				);
				dispatch({
					type:GET_FARE,
					payload:{
                        fare,
                        distance: getState().subscription.distanceMatrix.rows[0].elements[0].distance.text,
                        duration: getState().subscription.distanceMatrix.rows[0].elements[0].duration.text
                    }
				})
			}
		},2000)
        dispatch(asyncActionFinish());
    };
}

export const createSubscription = (subscription, selectedType, pickUpLogLat, dropOffLogLat, pickUpAddress, dropOffAddress, subscriptionText, push) => {
    return async (dispatch, getState, { getFirestore }) => {
        dispatch(asyncActionStart());
        const user = firebase.auth().currentUser;
        let firestore = firebase.firestore();
        let userDocRef = firestore.collection('users').doc(user.uid);
        alert('error herer');
        let userr = await userDocRef.get();
        firestore = getFirestore();

        try {
            const savedSubscription = await firestore.add(`subscriptions`, {
                  fullName: userr.data().displayName,
                  email: userr.data().email,
                  phoneNumber: userr.data().phoneNumber,
                  photoURL: userr.data().photoURL,
                  userId: user.uid,
                  fare: subscription.fare,
                  distance: subscription.distance,
                  duration: subscription.duration,
                  subscriptionDate: new Date(Date.now()),
                  subscriptionType: selectedType,
                  pickUpLogLat,
                  dropOffLogLat,
                  pickUpAddress,
                  dropOffAddress,
                  subscriptionText,
                  status:"pending"
            });

            dispatch(updateSubscribe(savedSubscription.id));
            toastr.success('Success', 'Subscription has been created');
            dispatch(reset('SubscriptionForm'));
            dispatch(asyncActionFinish());
            push('/');
        } catch (error) {
          toastr.error('Oops', 'Something went wrong with creating subscription');
          console.log(error);
        }
    };
}

export const getSubscriptionsForDashboard = () => async (dispatch, getState) => {
    const firestore = firebase.firestore();
    const user = firebase.auth().currentUser;
    const subscriptionsRef = firestore.collection('subscriptions');
    let query;

    try {
        dispatch(asyncActionStart());
        query = subscriptionsRef
              .where('userId', '==', user.uid)
              .limit(2);

        let querySnap = await query.get();

        let subscriptions = [];

        for (let i = 0; i < querySnap.docs.length; i++) {
          let subscrpt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
          subscriptions.push(subscrpt);
        }
        console.log(subscriptions);

        dispatch({ type: FETCH_SUBSCRIPTIONS, subscriptions });
        dispatch(asyncActionFinish());
    } catch (error) {
        console.log(error);
        dispatch(asyncActionError());
    }
}

export const getAllSubscriptionsForDashboard = lastSubscription => async (dispatch, getState) => {
  const firestore = firebase.firestore();
  const subscriptionsRef = firestore.collection('subscriptions');
  try {
    dispatch(asyncActionStart());
    let startAfter =
      lastSubscription &&
      (await firestore
        .collection('subscriptions')
        .doc(lastSubscription.id)
        .get());
    let query;

    lastSubscription
      ? (query = subscriptionsRef
          .orderBy('subscriptionDate')
          .startAfter(startAfter)
          .limit(11))
      : (query = subscriptionsRef
          .orderBy('subscriptionDate')
          .limit(11));

    let querySnap = await query.get();

    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let subscriptions = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      let sbtn = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      subscriptions.push(sbtn);
    }

    dispatch({ type: FETCH_SUBSCRIPTIONS, subscriptions });

    dispatch(asyncActionFinish());
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};
