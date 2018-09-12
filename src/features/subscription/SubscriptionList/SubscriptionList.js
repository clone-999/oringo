import React, { Component } from 'react';
import SubscriptionListItem from './SubscriptionListItem';

class SubscriptionList extends Component {
  render() {
    const { subscriptions, profile } = this.props;
    return (
      <div>
          {subscriptions && subscriptions.map(subscription => <SubscriptionListItem key={subscription.id} subscription={subscription} profile={profile} />)}
      </div>
    );
  }
}

export default SubscriptionList;
