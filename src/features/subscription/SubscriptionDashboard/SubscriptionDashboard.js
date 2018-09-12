import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getSubscriptionsForDashboard } from '../subscriptionActions';
import SubscriptionList from '../SubscriptionList/SubscriptionList';
import UserSideBar from '../../nav/SideBar/UserSideBar';

const mapState = state => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    subscriptions: state.subscription.subscriptions
});

const actions = {
  getSubscriptionsForDashboard
};

class SubscriptionDashboard extends Component {

    state = {
        contextRef: {}
    };

    componentDidMount() {
        this.props.getSubscriptionsForDashboard();
    }

    handleContextRef = contextRef => this.setState({contextRef})

    render() {
        const { subscriptions, profile } = this.props;

        return (
            <Segment>
                <Grid>
                    <Grid.Column width={12}>
                      <div ref={this.handleContextRef}>
                      <SubscriptionList
                        profile={profile}
                        subscriptions={subscriptions}
                      />
                      </div>
                    </Grid.Column>

                    <Grid.Column width={4}>
                        <UserSideBar auth={this.props.auth} profile={this.props.profile} contextRef={this.state.contextRef} />
                    </Grid.Column>
                </Grid>
            </Segment>
        )
    }
}

export default connect(mapState, actions)(SubscriptionDashboard);
