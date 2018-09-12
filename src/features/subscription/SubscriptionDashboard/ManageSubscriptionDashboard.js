import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getAllSubscriptionsForDashboard } from '../subscriptionActions';
import ManageSubscriptionList from '../SubscriptionList/ManageSubscriptionList';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import UserSideBar from '../../nav/SideBar/UserSideBar';

const mapState = state => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    subscriptions: state.subscription.subscriptions,
    loading: state.async.loading
});

const actions = {
  getAllSubscriptionsForDashboard
};

class ManageSubscriptionDashboard extends Component {
  state = {
    moreSubscriptions: false,
    loadingInitial: true,
    loadedSubscriptions: [],
    contextRef: {}
  };

  async componentDidMount() {
    let next = await this.props.getAllSubscriptionsForDashboard();

    if (next && next.docs && next.docs.length > 0) {
      this.setState({
        moreSubscriptions: true,
        loadingInitial: false
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subscriptions !== nextProps.subscriptions) {
      this.setState({
        loadedSubscriptions: [...this.state.loadedSubscriptions, ...nextProps.subscriptions]
      });
    }
  }

  getNextSubscriptions = async () => {
    const { subscriptions } = this.props;
    let lastSubscription = subscriptions && subscriptions[subscriptions.length - 1];
    let next = await this.props.getAllSubscriptionsForDashboard(lastSubscription);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreSubscriptions: false
      });
    }
  };

  handleContextRef = contextRef => this.setState({contextRef})

  render() {
    const { loading, profile, auth } = this.props;
    const { moreSubscriptions, loadedSubscriptions } = this.state;
    if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Column width={12}>
          <div ref={this.handleContextRef}>
              <ManageSubscriptionList
                loading={loading}
                moreSubscriptions={moreSubscriptions}
                subscriptions={loadedSubscriptions}
                profile={profile}
                getNextSubscriptions={this.getNextSubscriptions}
              />
          </div>
        </Grid.Column>
        <Grid.Column width={4}>
            <UserSideBar auth={auth} profile={profile} contextRef={this.state.contextRef} />
        </Grid.Column>
        <Grid.Column width={12}>
          <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(mapState, actions)(ManageSubscriptionDashboard);
