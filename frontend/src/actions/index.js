export const CONTACT_INFORMATION_REQUEST = 'CONTACT_INFORMATION_REQUEST';
export const CONTACT_INFORMATION_SUCCESS = 'CONTACT_INFORMATION_SUCCESS';

export const WORK_DATA_REQUEST = 'WORK_DATA_REQUEST';
export const WORK_DATA_SUCCESS = 'WORK_DATA_SUCCESS';

export const EDUCATION_DATA_REQUEST = 'EDUCATION_DATA_REQUEST';
export const EDUCATION_DATA_SUCCESS = 'EDUCATION_DATA_SUCCESS';
export const STATISTICS_FAILED = 'STATISTICS_FAILED';

export const requestContactInformation = () => ({ type: CONTACT_INFORMATION_REQUEST });
export const receiveContactInformation = personalData => ({ type: CONTACT_INFORMATION_SUCCESS, personalData });
export const failedStatistics = dataSetId => ({ type: STATISTICS_FAILED, dataSetId });

export const requestWorkData = () => ({ type: WORK_DATA_REQUEST });
export const receiveWorkData = workData => ({ type: WORK_DATA_SUCCESS, workData });

export const requestEducationData = dataSetId => ({ type: EDUCATION_DATA_REQUEST, dataSetId });
export const receiveEducationData = (dataSetId, dataSet) => ({ type: EDUCATION_DATA_SUCCESS, dataSetId, dataSet });

