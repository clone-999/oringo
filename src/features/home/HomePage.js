import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Grid, Image, Segment, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

class HomePage extends Component {
  componentWillMount() {
    const { auth, profile, history} = this.props;
    if (profile.role === "driver" && !profile.isDriverComplete) {
      history.push('/driver/' + profile.driverId);
    }
  }
  render() {
    const { history } = this.props;
    return (
      <div>
        <Carousel showThumbs={false}>
          <div>
              <img src="/assets/1.jpg" />
              <p className="legend">Sign up to get a driver</p>
          </div>
          <div>
              <img src="/assets/3.jpg" />
              <p className="legend">Become a driver to earn more</p>
          </div>
        </Carousel>
        <br />
  
        <Container>
          <Grid stackable columns={3}>
            <Grid.Column>
              <Segment>
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </Segment>
            </Grid.Column>
          </Grid>
        </Container>
        <br />
        <br />
      </div>
    );
  }
}

export default connect(mapState)(HomePage);
