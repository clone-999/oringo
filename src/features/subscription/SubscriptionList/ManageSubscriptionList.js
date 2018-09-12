import React, { Component } from 'react';
import SubscriptionListItem from './SubscriptionListItem';
import InfiniteScroll from 'react-infinite-scroller';

class ManageSubscriptionList extends Component {
  render() {
    const { subscriptions, getNextSubscriptions, loading, moreSubscriptions } = this.props;
    return (
      <div>
        {subscriptions &&
          subscriptions.length !== 0 && (
            <InfiniteScroll
              pageStart={0}
              loadMore={getNextSubscriptions}
              hasMore={!loading && moreSubscriptions}
              initialLoad={false}
            >
              {subscriptions && subscriptions.map(subscription => <SubscriptionListItem key={subscription.id} subscription={subscription} profile={this.props.profile} />)}
            </InfiniteScroll>
          )}
      </div>
    );
  }
}

export default ManageSubscriptionList;
