import React, { Component } from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import format from 'date-fns/format'

class SubscriptionListItem extends Component {
  render() {
    const {subscription} = this.props
    return (
       <Card>
          <Image src={subscription.photoURL || "/assets/user.png"} />
          <Card.Content>
            <Card.Header>{subscription.fullName}</Card.Header>
            <Card.Meta>Subscribed on {format(subscription.subscriptionDate.toDate(), 'dddd Do MMMM')} at {format(subscription.subscriptionDate.toDate(), 'HH:mm')}</Card.Meta>
            <Card.Description>{subscription.subscriptionText} Subscription</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='car' />
              From {subscription.pickUpAddress}
            </a>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='car' />
              To {subscription.dropOffAddress}
            </a>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='key' />
              {subscription.status}
            </a>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              { subscription.driverFullName || "No driver assigned yet" }
            </a>
          </Card.Content>
          { this.props.profile.isAdmin &&
              <Card.Content extra>
                  <Button as={Link} to={`/subscription/${subscription.id}`} color="teal" floated="right" content="Manage Subscription" />
              </Card.Content> }
        </Card>
    );
  }
}

export default SubscriptionListItem;
