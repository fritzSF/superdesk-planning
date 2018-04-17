import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {get} from 'lodash';

import * as selectors from '../../../selectors';
import * as actions from '../../../actions';
import {assignmentUtils, gettext} from '../../../utils';
import {ASSIGNMENTS} from '../../../constants';

import {AssignmentPreviewHeader} from './AssignmentPreviewHeader';
import {AssignmentPreview} from './AssignmentPreview';
import {PlanningPreview} from './PlanningPreview';
import {EventPreview} from './EventPreview';
import {ToggleBox, Button} from '../../UI';
import {ContentBlock, ContentBlockInner} from '../../UI/SidePanel';

class AssignmentPreviewContainerComponent extends React.Component {
    getItemActions() {
        const {
            reassign,
            editAssignmentPriority,
            completeAssignment,
            assignment,
            hideItemActions,
            session,
            privileges,
            startWorking,
            removeAssignment,
            lockedItems,
            openArchivePreview,
            revertAssignment,
        } = this.props;

        if (hideItemActions) {
            return [];
        }

        const itemActionsCallBack = {
            [ASSIGNMENTS.ITEM_ACTIONS.REASSIGN.label]: reassign.bind(null, assignment),
            [ASSIGNMENTS.ITEM_ACTIONS.EDIT_PRIORITY.label]: editAssignmentPriority.bind(null, assignment),
            [ASSIGNMENTS.ITEM_ACTIONS.COMPLETE.label]: completeAssignment.bind(null, assignment),
            [ASSIGNMENTS.ITEM_ACTIONS.START_WORKING.label]: startWorking.bind(null, assignment),
            [ASSIGNMENTS.ITEM_ACTIONS.REMOVE.label]: removeAssignment.bind(null, assignment),
            [ASSIGNMENTS.ITEM_ACTIONS.PREVIEW_ARCHIVE.label]: openArchivePreview.bind(null, assignment),
            [ASSIGNMENTS.ITEM_ACTIONS.CONFIRM_AVAILABILITY.label]: completeAssignment.bind(null, assignment),
            [ASSIGNMENTS.ITEM_ACTIONS.REVERT_AVAILABILITY.label]: revertAssignment.bind(null, assignment),
        };

        return assignmentUtils.getAssignmentActions(assignment,
            session,
            privileges,
            lockedItems,
            itemActionsCallBack);
    }

    render() {
        const {
            assignment,
            showFulfilAssignment,
            onFulFilAssignment,
            users,
            desks,
            planningItem,
            eventItem,
            urgencyLabel,
            priorities,
            urgencies,
            keywords,
            formProfile,
            agendas
        } = this.props;

        if (!assignment) {
            return null;
        }

        const planning = get(assignment, 'planning', {});
        const assignedTo = get(assignment, 'assigned_to', {});
        const state = get(assignedTo, 'state');
        const itemActions = this.getItemActions();

        return (
            <div className="AssignmentPreview">
                <AssignmentPreviewHeader
                    assignment={assignment}
                    planning={planning}
                    priorities={priorities}
                    itemActions={itemActions}
                    users={users}
                    desks={desks}
                />

                {showFulfilAssignment && state === ASSIGNMENTS.WORKFLOW_STATE.ASSIGNED &&
                    <ContentBlock className="AssignmentPreview__fulfil" padSmall={true} flex={true}>
                        <ContentBlockInner grow={true}>
                            <Button
                                color="primary"
                                text={gettext('Fulfil Assignment')}
                                onClick={onFulFilAssignment.bind(null, assignment)}
                            />
                        </ContentBlockInner>
                    </ContentBlock>
                }

                <ContentBlock className="AssignmentPreview__coverage" padSmall={true}>
                    <AssignmentPreview
                        assignment={assignment}
                        keywords={keywords}
                        coverageFormProfile={formProfile.coverage}
                        planningFormProfile={formProfile.planning}
                        planningItem={planningItem}
                    />
                </ContentBlock>

                <ContentBlock className="AssignmentPreview__planning" padSmall={true}>
                    <ToggleBox
                        title={gettext('Planning')}
                        isOpen={false}
                        style="toggle-box--circle"
                        scrollInView={true}
                        noMargin={true}
                    >
                        <PlanningPreview
                            urgencyLabel={urgencyLabel}
                            item={planningItem}
                            formProfile={formProfile.planning}
                            agendas={agendas}
                            urgencies={urgencies}
                        />
                    </ToggleBox>
                </ContentBlock>

                {eventItem &&
                    <ContentBlock className="AssignmentPreview__event" padSmall={true}>
                        <ToggleBox
                            title={gettext('Event')}
                            isOpen={false}
                            style="toggle-box--circle"
                            scrollInView={true}
                        >
                            <EventPreview
                                item={eventItem}
                                formProfile={formProfile.event}
                            />
                        </ToggleBox>
                    </ContentBlock>
                }
            </div>
        );
    }
}

AssignmentPreviewContainerComponent.propTypes = {
    assignment: PropTypes.object.isRequired,
    onFulFilAssignment: PropTypes.func,
    startWorking: PropTypes.func.isRequired,
    reassign: PropTypes.func,
    completeAssignment: PropTypes.func,
    editAssignmentPriority: PropTypes.func,
    removeAssignment: PropTypes.func,
    session: PropTypes.object,
    users: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    desks: PropTypes.array,
    planningItem: PropTypes.object,
    eventItem: PropTypes.object,
    urgencyLabel: PropTypes.string,
    priorities: PropTypes.array,
    urgencies: PropTypes.array,
    privileges: PropTypes.object,
    keywords: PropTypes.array,
    formProfile: PropTypes.object,
    lockedItems: PropTypes.object,
    agendas: PropTypes.array,
    openArchivePreview: PropTypes.func,
    revertAssignment: PropTypes.func,
    hideItemActions: PropTypes.bool,
    showFulfilAssignment: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    assignment: selectors.getCurrentAssignment(state),
    session: selectors.getSessionDetails(state),
    users: selectors.getUsers(state),
    desks: selectors.getDesks(state),

    planningItem: selectors.getCurrentAssignmentPlanningItem(state),
    eventItem: selectors.getCurrentAssignmentEventItem(state),

    priorities: get(state, 'vocabularies.assignment_priority'),
    urgencyLabel: selectors.vocabs.urgencyLabel(state),
    urgencies: selectors.getUrgencies(state),
    privileges: selectors.getPrivileges(state),
    keywords: get(state, 'vocabularies.keywords', []),
    formProfile: selectors.forms.profiles(state),
    lockedItems: selectors.locks.getLockedItems(state),
    agendas: selectors.getAgendas(state),
});

const mapDispatchToProps = (dispatch) => ({
    startWorking: (assignment) => dispatch(actions.assignments.ui.openSelectTemplateModal(assignment)),
    reassign: (assignment) => dispatch(actions.assignments.ui.reassign(assignment)),
    completeAssignment: (assignment) => dispatch(actions.assignments.ui.complete(assignment)),
    revertAssignment: (assignment) => dispatch(actions.assignments.ui.revert(assignment)),
    editAssignmentPriority: (assignment) => dispatch(actions.assignments.ui.editPriority(assignment)),
    onFulFilAssignment: (assignment) => dispatch(actions.assignments.ui.onAssignmentFormSave(assignment)),
    removeAssignment: (assignment) => dispatch(actions.assignments.ui.showRemoveAssignmentModal(assignment)),
    openArchivePreview: (assignment) => dispatch(actions.assignments.ui.openArchivePreview(assignment)),
});

export const AssignmentPreviewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignmentPreviewContainerComponent);