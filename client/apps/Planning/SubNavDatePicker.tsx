import * as React from 'react';
import moment from 'moment-timezone';

import {DateInputPopup} from '../../components/UI/Form/DateInput/DateInputPopup';
import {timeUtils} from '../../utils';
import {Button} from 'superdesk-ui-framework/react';

interface IProps {
    date: moment.Moment;
    onChange(newDate?: moment.Moment): void;
    defaultTimezone?: string;
    dateFormat?: string;
}

interface IState {
    popupOpen: boolean;
}

export class SubNavDatePicker extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.togglePopup = this.togglePopup.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {popupOpen: false};
    }

    togglePopup() {
        this.setState({popupOpen: !this.state.popupOpen});
    }

    getTimeZone() {
        return this.props.defaultTimezone ?? timeUtils.localTimeZone();
    }

    onChange(value: moment.Moment) {
        // If the user has selected 'Today', then set the startFilter to null
        // Otherwise set the startFilter to the supplied day
        const newMoment = moment.tz(value.clone(), this.getTimeZone());
        const currentMoment = moment.tz(moment(), this.getTimeZone());

        moment(newMoment).isSame(currentMoment, 'day') ?
            this.props.onChange(null) :
            this.props.onChange(newMoment);
    }

    render() {
        return (
            <span>
                <span className="subnav-calendar__date-picker sd-text__normal">
                    {this.props.date.format(this.props.dateFormat ?? 'LL')}
                </span>
                <Button
                    size="normal"
                    icon="calendar"
                    text="date-picker"
                    shape="round"
                    iconOnly={true}
                    onClick={this.togglePopup}
                />
                {!this.state.popupOpen ? null : (
                    <DateInputPopup
                        onChange={this.onChange}
                        close={this.togglePopup}
                        target="subnav-calendar__date-picker"
                        value={this.props.date}
                    />
                )}
            </span>
        );
    }
}
