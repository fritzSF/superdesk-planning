import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export const Label = ({text, row, light, invalid}) => (
    !text ? null : (
        <label className={classNames({
            'sd-line-input__label': !row,
            'sd-line-input__invalid': !row && invalid,
            'form-label': row,
            'form-label--light': row && light,
            'form-label--invalid': row && invalid,
        })}>
            {text}
        </label>
    )
);

Label.propTypes = {
    text: PropTypes.string,
    row: PropTypes.bool,
    light: PropTypes.bool,
    invalid: PropTypes.bool,

};

Label.defaultProps = {
    row: false,
    light: false,
    invalid: false,
};
