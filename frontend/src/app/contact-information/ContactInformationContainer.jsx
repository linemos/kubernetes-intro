import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContactInformation from './ContactInformation';
import { fetchContactInformation } from '../../ducks';

class ContactInformationContainer extends Component {
    componentWillMount() {
        this.props.fetchContactInformation();
    }
    render() {
        return <ContactInformation {...this.props} />;
    }
}

ContactInformationContainer.propTypes = {};

const mapStateToProps = state => ({contactInformation: state.contactInformation });
const mapDispatchToProps = { fetchContactInformation };

export default connect(mapStateToProps, mapDispatchToProps)(ContactInformationContainer);
