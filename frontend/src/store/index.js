import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../ducks'

const isLocal = () => window.location.href.includes('localhost');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const create = () => {
    if (isLocal()) {
        createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
    }
    return createStore(reducer, applyMiddleware(thunk));
};

export default create;
