import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import { isSingleValue } from '@dhis2/analytics';
import { Button, Menu, MenuItem, Divider } from '@dhis2/ui-core';
import i18n from '@dhis2/d2-i18n';
import TableIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Public';
import LaunchIcon from '@material-ui/icons/Launch';

import { ThreeDots } from './assets/icons.js';
import { pluginIsAvailable, getLink, getName } from './plugin';
import {
    CHART,
    REPORT_TABLE,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    isTrackerDomainType,
    hasMapView,
    getAppName,
} from '../../../modules/itemTypes';

import classes from './styles/NewItemHeader.module.css';

const NewItemHeader = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const {
        item,
        visualization,
        onSelectActiveType,
        d2,
        editMode,
        activeType,
    } = props;

    // if (isSingleValue(visualization.type)) {
    //     return null;
    // }

    const onViewTable = () => {
        onSelectActiveType(
            isTrackerDomainType(item.type) ? EVENT_REPORT : REPORT_TABLE
        );
        handleClose();
    };

    const onViewChart = () => {
        onSelectActiveType(
            isTrackerDomainType(item.type) ? EVENT_CHART : CHART
        );
        handleClose();
    };

    const onViewMap = () => {
        onSelectActiveType(MAP);
        handleClose();
    };

    const hasTableView = () => {
        const type = visualization.type || item.type;
        return !type.match(/^YEAR_OVER_YEAR/);
    };

    const itemHasMapView = () => {
        const type = visualization.type || item.type;
        return hasMapView(item.type) && !type.match(/^YEAR_OVER_YEAR/);
    };

    const handleClick = (_, event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div className={classes.itemHeaderWrap}>
                <p className={classes.itemTitle}>{getName(item)}</p>

                {!editMode && pluginIsAvailable(item, visualization) ? (
                    <div className={classes.itemActionsWrap}>
                        <Button small secondary onClick={handleClick}>
                            <ThreeDots />
                        </Button>
                        <Popover
                            className="item-header-options"
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                horizontal: 'left',
                                vertical: 'bottom',
                            }}
                            transformOrigin={{
                                horizontal: 'left',
                                vertical: 'top',
                            }}
                            // style={{ height: '70vh' }}
                            // PaperProps={{ style: { width: '700px' } }}
                            disableAutoFocus={true}
                            disableRestoreFocus={true}
                        >
                            <Menu>
                                <MenuItem
                                    dense
                                    label={i18n.t('View as Chart')}
                                    onClick={onViewChart}
                                    icon={<ChartIcon />}
                                />
                                {hasTableView() && (
                                    <MenuItem
                                        dense
                                        label={i18n.t('View as Table')}
                                        onClick={onViewTable}
                                        icon={<TableIcon />}
                                    />
                                )}
                                {itemHasMapView() && (
                                    <MenuItem
                                        dense
                                        label={i18n.t('View as Map')}
                                        onClick={onViewMap}
                                        icon={<MapIcon />}
                                    />
                                )}
                                <Divider />
                                <MenuItem
                                    dense
                                    icon={
                                        <LaunchIcon
                                            className={classes.launchIcon}
                                        />
                                    }
                                    label={i18n.t(
                                        `View in ${getAppName(item.type)} app`
                                    )}
                                    href={getLink(item, d2)}
                                    target="_blank"
                                />
                            </Menu>
                        </Popover>
                    </div>
                ) : null}
            </div>
        </>
    );
};

NewItemHeader.propTypes = {
    activeType: PropTypes.string,
    d2: PropTypes.object,
    editMode: PropTypes.bool,
    item: PropTypes.object,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
};

export default NewItemHeader;