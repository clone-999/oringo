/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withFirestore } from 'react-redux-firebase';

import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Segment, Form, Button, Grid, Header, Icon, Image } from 'semantic-ui-react';
import {
  combineValidators,
  isRequired
} from 'revalidate';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { createDriver, updateDriver } from '../driverActions';
import TextInput from '../../../app/common/form/TextInput';
import PlaceInput from '../../../app/common/form/PlaceInput';

const mapState = (state, ownProps) => {
  let driver = {};

  if (state.firestore.ordered.drivers && state.firestore.ordered.drivers[0]) {
    driver = state.firestore.ordered.drivers[0];
  }

  return {
    initialValues: driver,
    driver,
    loading: state.async.loading
  };
};

const actions = {
  createDriver,
  updateDriver
};

const validate = combineValidators({
  address: isRequired({ message: 'Your address is required' }),
  carType: isRequired({ message: 'Please the car type' }),
  prefferedRoute: isRequired({ message: 'Please provide your preffered' }),
  garantor: isRequired({ message: 'Your garantor is required' }),
  guarantorPhone: isRequired({ message: 'Guarantor phone number is required' }),
  driverLicence: isRequired({ message: 'Your driver licence is required' }),
  bankName: isRequired({ message: 'Your bank name is required' }),
  accountName: isRequired({ message: 'Your account name is required' }),
  accountNumber: isRequired({ message: 'Your account number is required' }),
  city: isRequired('city'),
  venue: isRequired('venue')
});

class DriverForm extends Component {
  state = {
      cityLatLng: {},
      location: {},
      scriptLoaded: true,
      files: [],
      fileName: '',
      cropResult: null,
      image: null
  };

  cancelCrop = () => {
      this.setState({
        files: [],
        image: null
      });
   };

   cropImage = () => {
      if (typeof this.refs.cropper.getCroppedCanvas() === 'undefined') {
        return;
      }

      this.refs.cropper.getCroppedCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          cropResult: imageUrl,
          image: blob
        });
      }, 'image/jpeg');
    };

    onDrop = files => {
      this.setState({
        files,
        fileName: files[0].name
      });
    };

  async componentDidMount() {
    const {firestore, match} = this.props;
    await firestore.setListener(`drivers/${match.params.id}`);
  }

  async componentWillUnmount() {
    const {firestore, match} = this.props;
    await firestore.unsetListener(`drivers/${match.params.id}`);
  }

  handleScriptLoaded = () => this.setState({ scriptLoaded: true });

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('city', selectedCity);
      });
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          location: latlng
        });
      })
      .then(() => {
        this.props.change('address', selectedVenue);
      });
  };

  onFormSubmit = values => {
    values.location = this.state.location;
    if (this.props.initialValues.id) {
      if (Object.keys(values.location).length === 0) {
        values.location = this.props.driver.location
      }
      this.props.updateDriver(values, this.state.image, this.props.driver.locationId, this.props.driver.imageName, this.props.driver.imagePath);
      //this.props.history.goBack();
    } else {
        if (!this.state.image) {
            alert('you must upload your driver licence in order to continue');
        } else {
            this.props.createDriver(values, this.state.image, this.props.history.push);
        }
      //this.props.history.push('/drivers');
    }
  };

  render() {
    const { invalid, submitting, pristine, loading } = this.props;
    return (
        <Segment>
            <Header sub content="Upload Driver Licence" />
              <Grid>
                <Grid.Row />
                <Grid.Column width={4}>
                  <Header color="teal" sub content="Step 1 - Add Photo" />
                  <Dropzone onDrop={this.onDrop} multiple={false}>
                    <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                      <Icon name="upload" size="huge" />
                      <Header content="Drop image here or click to upload" />
                    </div>
                  </Dropzone>
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                  <Header sub color="teal" content="Step 2 - Resize image" />
                  {this.state.files[0] && (
                    <Cropper
                      style={{ height: 200, width: '100%' }}
                      ref="cropper"
                      src={this.state.files[0].preview}
                      aspectRatio={1}
                      viewMode={0}
                      dragMode="move"
                      guides={false}
                      scalable={true}
                      cropBoxMovable={true}
                      cropBoxResizable={true}
                      crop={this.cropImage}
                    />
                  )}
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                  <Header sub color="teal" content="Step 3 - Preview and Upload" />
                    <div>
                      <Image
                        style={{ minHeight: '200px', minWidth: '200px' }}
                        src={this.state.cropResult || this.props.driver.imagePath}
                      />
                      <Button.Group>
                        <Button
                          disabled={loading}
                          onClick={this.cancelCrop}
                          style={{ width: '100px' }}
                          icon="close"
                        />
                      </Button.Group>
                    </div>

                </Grid.Column>
              </Grid>
          <Grid>

            <Grid.Column width={10}>
              <Segment>
                <Header sub color="teal" content="Driver Details" />
                <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                  <Field
                    name="address"
                    type="text"
                    component={TextInput}
                    placeholder="Enter your address"
                  />
                  <Field
                    name="carType"
                    type="text"
                    component={TextInput}
                    placeholder="Your car type"
                  />
                  <Field
                    name="garantor"
                    type="text"
                    component={TextInput}
                    placeholder="Your garantor's full name"
                  />
                  <Field
                    name="guarantorPhone"
                    type="text"
                    component={TextInput}
                    placeholder="Enter your guarantor's phone number"
                  />
                  <Field
                    name="driverLicence"
                    type="text"
                    component={TextInput}
                    placeholder="Your driver licence number"
                  />
                  <Field
                    name="bankName"
                    type="text"
                    component={TextInput}
                    placeholder="Enter your bank name"
                  />
                  <Field
                    name="accountName"
                    type="text"
                    component={TextInput}
                    placeholder="Your account name"
                  />
                  <Field
                    name="accountNumber"
                    type="text"
                    component={TextInput}
                    placeholder="Your account number"
                  />
                  <Header sub color="teal" content="Driver Location details" />
                  <Field
                    name="city"
                    type="text"
                    component={PlaceInput}
                    options={{ types: ['(cities)'] }}
                    placeholder="Driver city"
                    onSelect={this.handleCitySelect}
                  />
                  {this.state.scriptLoaded && (
                    <Field
                      name="address"
                      type="text"
                      component={PlaceInput}
                      options={{
                        location: new google.maps.LatLng(this.state.cityLatLng),
                        radius: 1000,
                        types: ['establishment']
                      }}
                      placeholder="Driver address"
                      onSelect={this.handleVenueSelect}
                    />
                  )}
                  {this.state.scriptLoaded && (
                    <Field
                      name="prefferedRoute"
                      type="text"
                      component={PlaceInput}
                      options={{
                        location: new google.maps.LatLng(this.state.cityLatLng),
                        radius: 1000,
                        types: ['establishment']
                      }}
                      placeholder="Your preffered route"
                    />
                  )}
                  <Button
                    loading={loading}
                    disabled={invalid || submitting || pristine}
                    positive
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button disabled={loading} onClick={this.props.history.goBack} type="button">
                    Cancel
                  </Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
      </Segment>
    );
  }
}

export default withFirestore(
  connect(mapState, actions)(
    reduxForm({ form: 'driverForm', enableReinitialize: true, validate })(
      DriverForm
    )
  )
);
