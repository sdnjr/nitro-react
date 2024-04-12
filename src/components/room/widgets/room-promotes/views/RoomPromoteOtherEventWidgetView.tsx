import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Column, Flex, Text } from '../../../../../common';

interface RoomPromoteOtherEventWidgetViewProps
{
    eventDescription: string;
}

export const RoomPromoteOtherEventWidgetView: FC<RoomPromoteOtherEventWidgetViewProps> = props =>
{
    const { eventDescription = '' } = props;

    return (
        <>
            <Flex alignItems="center" gap={ 2 } style={ { overflowWrap: 'anywhere' } }>
                <Text variant="white">{ eventDescription }</Text>
            </Flex>
            <br /><br />
            <Column alignItems="center" gap={ 1 }>
                <div className="bg-light-dark rounded position-relative overflow-hidden w-100">
                    <div className="flex justify-center items-center size-full position-absolute">
                        <Text center variant="white">{ LocalizeText('navigator.eventinprogress') }</Text>
                    </div>
                    <Text>&nbsp;</Text>
                </div>
            </Column>
        </>
    );
};
