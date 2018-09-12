/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withFirestore } from 'react-redux-firebase';

import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Segment, Form, Button, Grid, Header, Icon, Statistic } from 'semantic-ui-react';
import {
  combineValidators,
  isRequired
} from 'revalidate';
import { getSelectedAddress, createSubscription } from '../subscriptionActions';
import PlaceInput from '../../../app/common/form/PlaceInput';
import SelectInput from '../../../app/common/form/SelectInput';
import UserSideBar from '../../nav/SideBar/UserSideBar';

const mapState = (state, ownProps) => {
  let subscription = {};

  return {
    initialValues: subscription,
    loading: state.async.loading,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    subscription: state.subscription
  };
};

const actions = {
  getSelectedAddress,
  createSubscription
};

const types = [
  { key: 20, text: 'One Month', value: 20 },
  { key: 60, text: 'Three Months', value: 60 },
  { key: 120, text: 'Six Months', value: 120 },
  { key: 240, text: 'One Year', value: 240 }
];

const validate = combineValidators({
  pickUp: isRequired({ message: 'The pick up is required' }),
  dropOff: isRequired({ message: 'The pick up is required' }),
  types: isRequired({ message: 'Please select the subscription type' })
});

class SubscriptionForm extends Component {
    state = {
        cityLatLng: {},
        selectedPickUp: {latitude: 9.065356, longitude: 7.461125},
        selectedDropOff: {latitude: 9.109890, longitude: 7.404241},
        scriptLoaded: true,
        pickUpAddress: "3 Douala Cres, Wuse, Abuja, Nigeria",
        dropOffAddress: "124 3rd Ave, Gwarinpa Estate 900211, Abuja, Nigeria",
        selectedType: 20,
        contextRef: {}
    };

    componentWillMount(){
        this.props.getSelectedAddress(this.state.selectedPickUp, this.state.selectedDropOff, this.state.selectedType);
    }

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

    handlePickUpSelect = selectedPickUp => {
      geocodeByAddress(selectedPickUp)
        .then(results => getLatLng(results[0]))
        .then(latlng => {
          this.setState({
            selectedPickUp: latlng
          });
        })
        .then(() => {
          this.props.change('pickUp', selectedPickUp);
        });
    };

    handleDropOffSelect = selectedDropOff => {
      geocodeByAddress(selectedDropOff)
        .then(results => getLatLng(results[0]))
        .then(latlng => {
          this.setState({
            selectedDropOff: latlng
          });
        })
        .then(() => {
          this.props.change('dropOff', selectedDropOff);
        });
    };

    onFormSubmit = values => {
        this.setState({
            selectedType: values.types,
            pickUpAddress: values.pickUp,
            dropOffAddress: values.dropOff
        });
        this.props.getSelectedAddress(this.state.selectedPickUp, this.state.selectedDropOff, values.types);
    }

    onSubscribe = () => {
        const { fare, distance, duration } = this.props.subscription;
        let subscriptionText;
        switch (this.state.selectedType) {
            case 20:
                subscriptionText = "One Month"
                break;
            case 60:
                subscriptionText = "Three Months"
                break;
            case 120:
                subscriptionText = "Six Months"
                break;
            default:
                subscriptionText = "One Year"
        }
        this.props.createSubscription({fare, distance, duration}, this.state.selectedType, this.state.selectedPickUp, this.state.selectedDropOff, this.state.pickUpAddress, this.state.dropOffAddress, subscriptionText, this.props.history.push);
    }

    handleContextRef = contextRef => this.setState({contextRef})

    render() {
      const { invalid, submitting, pristine, loading } = this.props;
      return (
          <Segment>
            <Grid>
              <Grid.Column width={12}>
                <Segment>
                  <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                    <Header sub color="teal" content="Subscribe Here" />
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
                        name="pickUp"
                        type="text"
                        component={PlaceInput}
                        options={{
                          location: new google.maps.LatLng(this.state.cityLatLng),
                          radius: 1000,
                          types: ['establishment']
                        }}
                        placeholder="Pick Up"
                        onSelect={this.handlePickUpSelect}
                      />
                    )}
                    {this.state.scriptLoaded && (
                        <Field
                          name="dropOff"
                          type="text"
                          component={PlaceInput}
                          options={{
                            location: new google.maps.LatLng(this.state.cityLatLng),
                            radius: 1000,
                            types: ['establishment']
                          }}
                          placeholder="Drop Off"
                          onSelect={this.handleDropOffSelect}
                        />
                    )}
                    <Field
                      name="types"
                      component={SelectInput}
                      options={types}
                      value="types"
                      placeholder="Select your types"
                    />
                    <Button
                      loading={loading}
                      disabled={invalid || submitting || pristine}
                      positive
                      type="submit"
                    >
                      Search
                    </Button>
                  </Form>
                </Segment>
                { this.props.subscription.distance &&
                    <Segment>
                      <Statistic.Group>
                        <Statistic>
                          <Statistic.Value>{this.props.subscription.duration}</Statistic.Value>
                          <Statistic.Label>DISTANCE</Statistic.Label>
                        </Statistic>

                        <Statistic>
                          <Statistic.Value text>
                            <Icon name='car' />
                            {this.props.subscription.distance}
                          </Statistic.Value>
                          <Statistic.Label>SPEED</Statistic.Label>
                        </Statistic>

                        <Statistic>
                          <Statistic.Value>
                            {this.props.subscription.fare}
                          </Statistic.Value>
                          <Statistic.Label>₦</Statistic.Label>
                        </Statistic>
                      </Statistic.Group>
                      <Grid>
                          <Grid.Column width={4}>
                          </Grid.Column>
                          <Grid.Column width={4}>
                              <br />
                              <br />
                              <Button
                                  loading={loading}
                                  positive
                                  onClick={this.onSubscribe}
                              >
                                Subscribe
                              </Button>
                          </Grid.Column>
                      </Grid>

                    </Segment>}
              </Grid.Column>

              <Grid.Column width={4}>
                  <UserSideBar auth={this.props.auth} profile={this.props.profile} contextRef={this.state.contextRef} />
              </Grid.Column>
            </Grid>
        </Segment>
      );
    }
}

export default withFirestore(
  connect(mapState, actions)(
    reduxForm({ form: 'SubscriptionForm', enableReinitialize: true, validate })(
      SubscriptionForm
    )
  )
);
