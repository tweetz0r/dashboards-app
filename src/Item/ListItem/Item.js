import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem as MUIListItem } from 'material-ui/List';
import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader from '../ItemHeader';
import { REPORTS, RESOURCES, USERS, itemTypeMap, orArray } from '../../util';
import { tRemoveListItemContent } from './actions';

const getItemTitle = item => {
    return itemTypeMap[item.type].pluralTitle;
};

const getContentItems = item =>
    orArray(item[itemTypeMap[item.type].propName]).filter(
        (item, index, array) =>
            array.findIndex(el => el.id === item.id) === index
    );

const getLink = (item, id, context) => {
    let url;

    switch (item.type) {
        case REPORTS:
            url = `dhis-web-reporting/getReportParams.action?mode=report&uid=${id}`;
            break;
        case RESOURCES:
            url = `api/documents/${id}/data`;
            break;
        case USERS:
            url = `dhis-web-messaging/profile.action?uid=${id}`;
            break;
        default:
            break;
    }

    return `${context.baseUrl}/${url}`;
};

const removeContent = (handler, item, contentToRemove) => () => {
    handler(item, contentToRemove);
};

const ListItem = (props, context) => {
    const { item, editMode, tRemoveListItemContent } = props;

    // avoid showing duplicates
    const contentItems = getContentItems(item);

    return (
        <Fragment>
            <ItemHeader title={getItemTitle(item)} />
            <List className="dashboard-item-content">
                {contentItems.map(contentItem => (
                    <MUIListItem
                        key={contentItem.id}
                        primaryText={
                            <a
                                style={{ textDecoration: 'none' }}
                                href={getLink(item, contentItem.id, context)}
                            >
                                {contentItem.name}
                            </a>
                        }
                        rightIconButton={
                            editMode ? (
                                <Button
                                    onClick={removeContent(
                                        tRemoveListItemContent,
                                        item,
                                        contentItem
                                    )}
                                >
                                    <SvgIcon icon="Delete" />
                                </Button>
                            ) : null
                        }
                    />
                ))}
            </List>
        </Fragment>
    );
};

ListItem.contextTypes = {
    baseUrl: PropTypes.string,
};

const ListItemContainer = connect(null, {
    tRemoveListItemContent,
})(ListItem);

export default ListItemContainer;