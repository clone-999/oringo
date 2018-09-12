import { toastr } from 'react-redux-toastr';
import cuid from 'cuid';
import {reset} from 'redux-form';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import firebase from '../../app/config/firebase';
import request from '../../app/common/util/request';
import { updateRoleType } from '../user/userActions';

const newLocation = (location, id) => {
    return {
      data:{
          driverId: id,
          coordinate: {
              type: "Point",
              coordinates: [
                  location.longitude,
                  location.latitude
              ]
          }
      }
    }
  };

const createLocation = (location, driverId, dispatch, push) => {
    const changeLocation = newLocation(location, driverId);
    console.log('changeLocation', changeLocation);
     request.post("https://oringo-api.herokuapp.com/api/driverLocation")
      .send(changeLocation)
      .finish((error, res)=>{
          if (res) {
              const firestore = firebase.firestore();
              const driverRef = firestore.collection('drivers');
              driverRef.doc(driverId).update({
                    locationId: res.body._id
                })
                .then(function() {
                    console.log('Driver updated after creating location', res);
                    dispatch(updateRoleType(driverId));

                    toastr.success('Success', 'Driver has been created');
                    dispatch(reset('driverForm'));
                    dispatch(asyncActionFinish());
                    push(`/driver/${driverId}`);
                })
                .catch(function(error) {
                    console.log('Error updating driver after adding location', error);
                });
          } else {
              console.log('Error adding location', error);
          }

      });
};

const updateLocation = (location, driverId, dispatch, locationId) => {

    const changeLocation = newLocation(location, driverId);

    console.log({ changeLocation });

    request.put("https://oringo-api.herokuapp.com/api/driverLocation/" + locationId)
  	.send(changeLocation)
  	.finish((error, res)=>{
          if (res) {
              return console.log('Location created with id: ', res.body._id);
          } else {
              return console.log('Error adding location', error);
          }
  	});
};

export const createDriver = (driver, file, push) => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());
    const user = firebase.auth().currentUser;
    let firestore = firebase.firestore();
    let userDocRef = firestore.collection('users').doc(user.uid);
    let userr = await userDocRef.get();
    firestore = getFirestore();
    let downloadURL = "";
    let imageLink = "";
    try {
        if (file) {
            const imageName = cuid();
            const path = "images/drivers";
            const options = {
              name: imageName
            };
            imageLink = path + "/" + imageName +".jpg";
            // upload the file to fb storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options);
            // get url of image
            downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
        }

        const savedDriver = await firestore.add(`drivers`, {
              fullName: userr.data().displayName,
              email: userr.data().email,
              phoneNumber: userr.data().phoneNumber,
              photoURL: userr.data().photoURL,
              city: driver.city,
              address: driver.address,
              carType: driver.carType,
              userId: user.uid,
              prefferedRoute: driver.prefferedRoute,
              garantor: driver.garantor,
              guarantorPhone: driver.guarantorPhone,
              driverLicence: driver.driverLicence,
              bankName: driver.bankName,
              accountName: driver.accountName,
              accountNumber: driver.accountNumber,
              publish: true,
              imagePath: downloadURL,
              imageName: imageLink,
              location: driver.location,
              locationId: null
        });
        createLocation(driver.location, savedDriver.id, dispatch, push);
    } catch (error) {
      toastr.error('Oops', 'Something went wrong with creating driver');
      console.log(error);
    }
  };
};

export const updateDriver = (driver, file, locationId, imageName, imagePath) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());
    const firestore = firebase.firestore();
    const user = firebase.auth().currentUser;
    let userDocRef = firestore.collection('users').doc(user.uid);
    let userr = await userDocRef.get();
    let batch = firebase.firestore().batch();
    let downloadURL = imagePath;
    let imageLink = imageName;
    try {
        if (imageName) {
            // Delete image
        }
        if (file) {
            const imageName = cuid();
            const path = "images/drivers";
            const options = {
              name: imageName
            };
            imageLink = path + "/" + imageName +".jpg";
            // upload the file to fb storage
            let uploadedFile = await firebase.uploadFile(imageLink, file, null, options);
            // get url of image
            downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
        }
        batch.update(userDocRef, {
            isDriverComplete: true,
        });
        let driverDocRef = firestore.collection('drivers').doc(driver.id);
          await batch.update(driverDocRef, {
              fullName: userr.data().displayName,
              email: userr.data().email,
              phoneNumber: userr.data().phoneNumber,
              photoURL: userr.data().photoURL,
              city: driver.city,
              address: driver.address,
              carType: driver.carType,
              userId: user.uid,
              prefferedRoute: driver.prefferedRoute,
              garantor: driver.garantor,
              guarantorPhone: driver.guarantorPhone,
              driverLicence: driver.driverLicence,
              bankName: driver.bankName,
              accountName: driver.accountName,
              accountNumber: driver.accountNumber,
              publish: true,
              imagePath: downloadURL,
              imageName: imageLink,
              location: driver.location,
              locationId: locationId,
              isDriverComplete: true
        });

        updateLocation(driver.location, driver.id, dispatch, locationId);

        batch.commit().then(function () {
            dispatch(asyncActionFinish());
        });

        toastr.success('Success', 'Driver has been updated');
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
      toastr.error('Oops', 'Something went wrong');
    }
  };
};
