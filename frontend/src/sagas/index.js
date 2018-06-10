
/*
import { take, put, call, fork, select } from 'redux-saga/effects'
import * as actions from '../actions'
import {
    personalDataSelector,
    workDataSelector,
    educationDataSelector
} from '../ducks/selectors';

const checkStatusCode = (response) => {
    if (response.status >= 200 && response.status < 300 && response.ok) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
};

const config = {
    method: 'GET',
    credentials: 'same-origin'
};

export function fetchContactInformation(dispatch) {
    return fetch('/api/me', config)
        .then(response => checkStatusCode(response))
        .then(response => response.json())
        .then(result => dispatch(actions.receiveContactInformation(result)))
        .catch(() => 'error');
}

export function fetchWork(dispatch) {
    return fetch('/api/work', config)
        .then(response => response.json())
        .then(result => dispatch(actions.receiveWorkData(result)))
        .catch(() => 'error');
}

export function fetchEducation(dispatch) {
    return fetch('/api/education', config)
        .then(response => response.json())
        .then(result => dispatch(actions.receiveWorkData(result)))
        .catch(() => 'error');
}

export function* getPersonalData(dataSetId) {
    yield put(actions.requestStatistics(dataSetId));
    const statistics = yield call(fetchPersonalData, dataSetId);
    // if (statistics === 'error') {
    //     yield put(actions.failedStatistics(dataSetId))
    // } else {
    yield put(actions.receiveStatistics(dataSetId, statistics))
}

export function* getWorkData(dataSetId) {
    yield put(actions.requestStatistics(dataSetId));
    const statistics = yield call(fetchWork, dataSetId);
    yield put(actions.receiveStatistics(dataSetId, statistics))
}

export function* getEducationData(dataSetId) {
    yield put(actions.requestStatistics(dataSetId));
    const statistics = yield call(fetchEducation, dataSetId);
    yield put(actions.receiveStatistics(dataSetId, statistics))
}
/*
export function* nextDataSetIdChange() {
    while (true) {
        const prevDataSetId = yield select(selectedDataSetIdSelector);
        yield take(actions.SELECT_DATA_SET_ID);

        const newDataSetId = yield select(selectedDataSetIdSelector);
        const dataSetByDataSetId = yield select(dataSetByDataSetIdSelector);
        if (prevDataSetId !== newDataSetId && !dataSetByDataSetId[newDataSetId]) {
            yield fork(getStatistics, newDataSetId);
        }
    }
}

*/

export function* startup() {
    const personalData = yield select(personalDataSelector);
    yield fork(getPersonalData, personalData);
    const workData = yield select(workDataSelector);
    yield fork(getWorkData, workData);
    const educationData = yield select(educationDataSelector);
    yield fork(getEducationData, educationData);
}

export default function* root() {
    yield fork(startup);
}
