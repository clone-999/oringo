import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr'
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import Script from 'react-load-script';
import './index.css';
import App from './app/layout/App';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './app/store/configureStore';
import ScrollToTop from './app/common/util/ScrollToTop';

const store = configureStore();

const rootEl = document.getElementById('root');

let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <div>
          <Script
            url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCutYnivMmEAA17iiRUa2nWetXHfTIiPbU&libraries=places"
          />
          <BrowserRouter>
            <ScrollToTop>
              <ReduxToastr
                position='bottom-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut'
              />
              <App />
            </ScrollToTop>
          </BrowserRouter>
      </div>
    </Provider>,
    rootEl
  );
};

if (module.hot) {
  module.hot.accept('./app/layout/App', () => {
    setTimeout(render);
  });
}

store.firebaseAuthIsReady.then(() => {
  render();
})



registerServiceWorker();
