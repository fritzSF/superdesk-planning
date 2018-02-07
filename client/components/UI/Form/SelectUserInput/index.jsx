import React from 'react';
import PropTypes from 'prop-types';

import {Row, LineInput, Label, Input} from '../';
import {UserAvatar} from '../../../';
import {SelectUserPopup} from './SelectUserPopup';

export class SelectUserInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredUserList: this.props.users,
            searchText: '',
            openFilterList: false,
        };

        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.filterUserList = this.filterUserList.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
    }

    openPopup() {
        this.setState({openFilterList: true});
    }

    closePopup() {
        this.setState({openFilterList: false});
    }

    filterUserList(field, value) {
        if (!value) {
            this.setState({
                filteredUserList: this.props.users,
                searchText: '',
                openFilterList: true,
            });
            return;
        }

        const filterTextNoCase = value.toLowerCase();
        const newUserList = this.props.users.filter((user) => (
            user.display_name.toLowerCase().substr(0, value.length) === filterTextNoCase ||
                user.display_name.toLowerCase().indexOf(filterTextNoCase) >= 0
        ));

        this.setState({
            filteredUserList: newUserList,
            searchText: value,
            openFilterList: true,
        });
    }

    onUserChange(newUserId) {
        this.props.onChange(this.props.field, newUserId);
        this.setState({
            openFilterList: false,
            searchText: '',
        });
    }

    render() {
        const {value, users, popupContainer, label} = this.props;
        const userList = this.state.searchText ? this.state.filteredUserList : users;

        return (
            <div>
                <Row noPadding={true}>
                    <LineInput noMargin={true}>
                        <Label text={label} />

                        {value && (
                            <div className="user-search__popup-user">
                                <UserAvatar user={value} />
                                <div className="user-search__popup-item-label">{value.display_name}</div>
                                <button type="button" onClick={this.onUserChange.bind(null, null)}>
                                    <i className="icon-close-small"/>
                                </button>
                            </div>
                        )}
                    </LineInput>
                </Row>
                <Row>
                    <LineInput isSelect={true} noLabel={!!value}>
                        <Input
                            value={this.state.searchText}
                            onChange={this.filterUserList}
                            onClick={this.openPopup}
                            placeholder="Search"
                        />

                        {this.state.openFilterList && (
                            <SelectUserPopup
                                onClose={this.closePopup}
                                target="sd-line-input__input"
                                popupContainer={popupContainer}
                                users={userList}
                                onChange={this.onUserChange}
                            />
                        )}
                    </LineInput>
                </Row>
            </div>
        );
    }
}

SelectUserInput.propTypes = {
    field: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    users: PropTypes.array,
    popupContainer: PropTypes.func,
};