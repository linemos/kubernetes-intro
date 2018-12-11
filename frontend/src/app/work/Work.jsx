import React from 'react';
import PT from 'prop-types';

const Work = ({ work }) => {
    if (!work) {
        return <noscript />;
    }
    const workRows = work ?
        Object.values(work).map((elm, inc) => (
            <tr className="table-row justify-content-between" key={`work-row-${inc}`}>
                <td>{elm.yearFrom} - {elm.yearTo}</td>
                <td>{elm.place}</td>
                <td>{elm.comment}</td>
            </tr>
        )) :
        <norcript />;
    return (
        <div className="work">
            <h2>Work</h2>
            <table>
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Where</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {workRows}
                </tbody>
            </table>
        </div>
    );
};

Work.propTypes = {
    work: PT.arrayOf(PT.object)
};

export default Work;
