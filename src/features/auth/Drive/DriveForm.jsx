import React from 'react';
import { connect } from 'react-redux'
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import { combineValidators, isRequired } from 'revalidate'
import TextInput from '../../../app/common/form/TextInput';
import { becomeDriver } from '../authActions'

const actions = {
  becomeDriver
}

const validate = combineValidators({
  displayName: isRequired('displayName'),
  email: isRequired('email'),
  phoneNumber: isRequired('phoneNumber'),
  password: isRequired('password'),
  carType: isRequired('carType'),
  driverLicence: isRequired('driverLicence'),
  bankName: isRequired('bankName'),
  accountName: isRequired('accountName'),
  accountNumber: isRequired('accountNumber'),
})

const DriveForm = ({becomeDriver, handleSubmit, error, invalid, submitting}) => {
  return (
    <div>
      <Form size="large" onSubmit={handleSubmit(becomeDriver)}>
        <Segment>
          <Field
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Known As"
          />
          <Field
            name="email"
            type="text"
            component={TextInput}
            placeholder="Email"
          />
          <Field
            name="phoneNumber"
            type="text"
            component={TextInput}
            placeholder="Phone Number"
          />
          <Field
            name="password"
            type="password"
            component={TextInput}
            placeholder="Password"
          />

          <Divider horizontal>Driving Details</Divider>

          <Field
            name="carType"
            type="text"
            component={TextInput}
            placeholder="Car Type"
          />

          <Field
            name="driverLicence"
            type="text"
            component={TextInput}
            placeholder="Driver Licence"
          />

          <Divider horizontal>Bank Details</Divider>

          <Field
            name="bankName"
            type="text"
            component={TextInput}
            placeholder="Bank Name"
          />
          <Field
            name="accountName"
            type="text"
            component={TextInput}
            placeholder="Account Name"
          />
          <Field
            name="accountNumber"
            type="text"
            component={TextInput}
            placeholder="Account Number"
          />

          {error && <Label basic color='red'>{error}</Label>}

          <Button disabled={invalid || submitting} fluid size="large" color="teal">
            Become Driver
          </Button>
        </Segment>
      </Form>
    </div>
  );
};

export default connect(null, actions)(reduxForm({form: 'driveForm', validate})(DriveForm));
