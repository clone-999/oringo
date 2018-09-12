import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { openModal } from '../modals/modalActions';

export const UserIsAuthenticated = connectedReduxRedirect({
    wrapperDisplayName: 'UserIsAuthenticated',
    allowRedirectBack: true,
    redirectPath: '/',
    authenticatedSelector: ({firebase: {auth, profile}}) =>
        auth.isLoaded && !auth.isEmpty,
    redirectAction: newLoc => (dispatch) => {
        dispatch(openModal('UnauthModal'))
    }
});

export const CustomerIsAuthenticated = connectedReduxRedirect({
    wrapperDisplayName: 'CustomerIsAuthenticated',
    allowRedirectBack: true,
    redirectPath: '/',
    authenticatedSelector: ({firebase: {auth, profile}}) =>
        auth.isLoaded && !auth.isEmpty && profile.isLoaded && !profile.isEmpty && profile.role === "user",
    redirectAction: newLoc => (dispatch) => {
        dispatch(openModal('UnauthCustomerModal'))
    }
});

export const DriverIsAuthenticated = connectedReduxRedirect({
    wrapperDisplayName: 'DriverIsAuthenticated',
    allowRedirectBack: true,
    redirectPath: '/',
    authenticatedSelector: ({firebase: {auth, profile}}) =>
        auth.isLoaded && !auth.isEmpty && profile.isLoaded && !profile.isEmpty && profile.role === "driver",
    redirectAction: newLoc => (dispatch) => {
        dispatch(openModal('UnauthDriverModal'))
    }
});

export const AdminIsAuthenticated = connectedReduxRedirect({
    wrapperDisplayName: 'AdminIsAuthenticated',
    allowRedirectBack: true,
    redirectPath: '/',
    authenticatedSelector: ({firebase: {auth, profile}}) =>
        auth.isLoaded && !auth.isEmpty && profile.isLoaded && !profile.isEmpty && profile.role === "admin",
    redirectAction: newLoc => (dispatch) => {
        dispatch(openModal('UnauthAdminModal'))
    }
});
