import { FC } from 'react';
import { GroupRoomInformationView } from '../groups/views/room-information/GroupRoomInformationView';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { PurseView } from '../purse/PurseView';
import { RightSideProps } from './RightSideView.types';

export const RightSideView: FC<RightSideProps> = props =>
{
    return (
        <div className="nitro-right-side">
            <div className="position-relative d-flex flex-column">
                <PurseView />
                <GroupRoomInformationView />
                <NotificationCenterView />
            </div>
        </div>
    );
}
