import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Education from './Education';
import { fetchEducation } from '../../ducks';

class EducationContainer extends Component {
    componentWillMount() {
        this.props.fetchEducation();
    }
    render() {
        return <Education {...this.props} />;
    }
}

EducationContainer.propTypes = {
    fetchEducation: PT.func.isRequired
};

const mapStateToProps = state => ({ education: state.education });
const mapDispatchToProps = { fetchEducation };

export default connect(mapStateToProps, mapDispatchToProps)(EducationContainer);
