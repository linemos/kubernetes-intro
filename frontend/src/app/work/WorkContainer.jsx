import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Work from './Work';
import { fetchWork } from '../../ducks';

class WorkContainer extends Component {
    componentWillMount() {
        this.props.fetchWork();
    }
    render() {
        return <Work {...this.props} />;
    }
}

WorkContainer.propTypes = {
    fetchWork: PT.func.isRequired
};

const mapStateToProps = state => ({ work: state.work });
const mapDispatchToProps = { fetchWork };

export default connect(mapStateToProps, mapDispatchToProps)(WorkContainer);
