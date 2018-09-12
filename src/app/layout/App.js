import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable'
import LoadingComponent from './LoadingComponent'
import { UserIsAuthenticated, CustomerIsAuthenticated, DriverIsAuthenticated, AdminIsAuthenticated } from '../../features/auth/authWrapper';
   
const AsyncNavBar  = Loadable({
  loader: () => import('../../features/nav/NavBar/NavBar'),
  loading: LoadingComponent
})
const AsyncHomePage = Loadable({
  loader: () => import('../../features/home/HomePage'),
  loading: LoadingComponent
})
const AsyncSettingsDashboard = Loadable({
  loader: () => import('../../features/user/Settings/SettingsDashboard'),
  loading: LoadingComponent
})
const AsyncUserDetailedPage = Loadable({
  loader: () => import('../../features/user/UserDetailed/UserDetailedPage'),
  loading: LoadingComponent
})
const AsyncSubscriptionDashboard = Loadable({
  loader: () => import('../../features/subscription/SubscriptionDashboard/SubscriptionDashboard'),
  loading: LoadingComponent
})
const AsyncModalManager = Loadable({
  loader: () => import('../../features/modals/ModalManager'),
  loading: LoadingComponent
})
const AsyncNotFound = Loadable({
  loader: () => import('../../app/layout/NotFound'),
  loading: LoadingComponent
})
const AsyncDriverForm = Loadable({
  loader: () => import('../../features/driver/DriverForm/DriverForm'),
  loading: LoadingComponent
})
const AsyncSubscriptionForm = Loadable({
  loader: () => import('../../features/subscription/SubscriptionForm/SubscriptionForm'),
  loading: LoadingComponent
})
const ManageSubscriptionDashboard = Loadable({
  loader: () => import('../../features/subscription/SubscriptionDashboard/ManageSubscriptionDashboard'),
  loading: LoadingComponent
})

class App extends Component {
    render() {
        return (
            <div> 
                <AsyncModalManager/>
                <AsyncNavBar />
                <Switch>
                  <Route exact path="/" component={AsyncHomePage} />
                </Switch>
                <Container className="main">
                    <Route
                      path="/(.+)"
                      render={() => (
                          <Switch>
                            <Route path="/subscriptions" component={UserIsAuthenticated(AsyncSubscriptionDashboard)} />
                            <Route path="/profile/:id" component={UserIsAuthenticated(AsyncUserDetailedPage)} />
                            <Route path="/settings" component={UserIsAuthenticated(AsyncSettingsDashboard)} />
                            <Route path="/driver/:id" component={DriverIsAuthenticated(AsyncDriverForm)} />
                            <Route path="/addSubcription" component={UserIsAuthenticated(AsyncSubscriptionForm)} />
                            <Route path="/manageSubscriptions" component={AdminIsAuthenticated(ManageSubscriptionDashboard)} />
                            <Route path="/error" component={AsyncNotFound} />
                            <Route component={AsyncNotFound} />
                          </Switch>
                      )}
                    />
                </Container>

            </div>
        );
    }
}

export default App;
