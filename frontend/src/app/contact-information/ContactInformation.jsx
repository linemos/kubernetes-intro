import React from 'react';
import PT from 'prop-types';

const ContactInformation = ({ contactInformation }) => {
    if (!contactInformation) {
        return <noscript />;
    }
    return (
        <div>
            <h2>Contact information</h2>
            <div className="contact-information justify-content-between">
                <div className="contact-information-content">
                    <p><b>Name: </b>{contactInformation.name}</p>
                    <p><b>Location: </b>{contactInformation.location}</p>
                </div>
                <img
                    src={`${process.env.PUBLIC_URL}/me.jpg`}
                    className="contact-information-image"
                    role="presentation"
                    alt={`Illustration of ${contactInformation.name}`}
                />
            </div>
        </div>
    );
};

ContactInformation.propTypes = {
    contactInformation: PT.object
};

export default ContactInformation;
