import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../ducks'

const isLocal = () => window.location.href.includes('localhost');

const create = () => {
    if (isLocal()) {
        createStore(reducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
            applyMiddleware(thunk));
    }
    return createStore(reducer, applyMiddleware(thunk));
};

export default create;
