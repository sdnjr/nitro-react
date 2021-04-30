import classNames from 'classnames';
import { IRoomSession, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomPreviewer, RoomSessionEvent } from 'nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { GetRoomEngine } from '../../api';
import { InventoryEvent } from '../../events';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { useRoomEngineEvent } from '../../hooks/events/nitro/room/room-engine-event';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { LocalizeText } from '../../utils/LocalizeText';
import { InventoryContextProvider } from './context/InventoryContext';
import { InventoryMessageHandler } from './InventoryMessageHandler';
import { InventoryTabs, InventoryViewProps } from './InventoryView.types';
import { initialInventoryBadge, InventoryBadgeReducer } from './reducers/InventoryBadgeReducer';
import { initialInventoryBot, InventoryBotReducer } from './reducers/InventoryBotReducer';
import { initialInventoryFurniture, InventoryFurnitureReducer } from './reducers/InventoryFurnitureReducer';
import { initialInventoryPet, InventoryPetReducer } from './reducers/InventoryPetReducer';
import { isObjectMoverRequested, setObjectMoverRequested } from './utils/InventoryUtilities';
import { InventoryBadgeView } from './views/badge/InventoryBadgeView';
import { InventoryBotView } from './views/bot/InventoryBotView';
import { InventoryFurnitureView } from './views/furniture/InventoryFurnitureView';
import { InventoryPetView } from './views/pet/InventoryPetView';

export const InventoryView: FC<InventoryViewProps> = props =>
{
    const tabs = [ InventoryTabs.FURNITURE, InventoryTabs.BOTS, InventoryTabs.PETS, InventoryTabs.BADGES ];

    const [ isVisible, setIsVisible ]   = useState(false);
    const [ currentTab, setCurrentTab ] = useState<string>(tabs[0]);
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const [ furnitureState, dispatchFurnitureState ] = useReducer(InventoryFurnitureReducer, initialInventoryFurniture);
    const [ botState, dispatchBotState ] = useReducer(InventoryBotReducer, initialInventoryBot);
    const [ petState, dispatchPetState ] = useReducer(InventoryPetReducer, initialInventoryPet);
    const [ badgeState, dispatchBadgeState ] = useReducer(InventoryBadgeReducer, initialInventoryBadge);

    const onInventoryEvent = useCallback((event: InventoryEvent) =>
    {
        switch(event.type)
        {
            case InventoryEvent.SHOW_INVENTORY:
                setIsVisible(true);
                return;
            case InventoryEvent.HIDE_INVENTORY:
                setIsVisible(false);
                return;
            case InventoryEvent.TOGGLE_INVENTORY:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(InventoryEvent.SHOW_INVENTORY, onInventoryEvent);
    useUiEvent(InventoryEvent.HIDE_INVENTORY, onInventoryEvent);
    useUiEvent(InventoryEvent.TOGGLE_INVENTORY, onInventoryEvent);

    const onRoomEngineObjectPlacedEvent = useCallback((event: RoomEngineObjectPlacedEvent) =>
    {
        if(!isObjectMoverRequested()) return;

        setObjectMoverRequested(false);

        if(!event._Str_4057) setIsVisible(true);
    }, []);

    useRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectPlacedEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                setIsVisible(false);
                return;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    useEffect(() =>
    {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));

        return () =>
        {
            setRoomPreviewer(prevValue =>
                {
                    prevValue.dispose();

                    return null;
                });
        }
    }, []);

    return (
        <InventoryContextProvider value={ { furnitureState, dispatchFurnitureState, botState, dispatchBotState, petState, dispatchPetState, badgeState, dispatchBadgeState } }>
            <InventoryMessageHandler />
            { isVisible && <DraggableWindow handle=".drag-handler">
                <div className="nitro-inventory d-flex flex-column">
                    <div className="drag-handler d-flex align-items-center bg-primary border border-bottom-0 rounded-top px-3 py-1">
                        <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                            <div className="h4 m-0 text-white text-shadow">{ LocalizeText('inventory.title') }</div>
                        </div>
                        <div className="cursor-pointer" onClick={ event => setIsVisible(false) }>
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <ul className="nav nav-tabs justify-content-center bg-secondary border-start border-end px-3 pt-1">
                        { tabs.map((name, index) =>
                            {
                                return <li key={ index } className="nav-item me-1 cursor-pointer" onClick={ event => setCurrentTab(name) } >
                                    <span className={ 'nav-link ' + classNames({ 'active': (currentTab === name) }) }>{ LocalizeText(name) }</span>
                                </li>;
                            }) }
                    </ul>
                    <div className="bg-light rounded-bottom border border-top-0 px-3 py-2 shadow overflow-hidden content-area">
                        { (currentTab === InventoryTabs.FURNITURE ) &&
                            <InventoryFurnitureView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === InventoryTabs.BOTS ) &&
                            <InventoryBotView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === InventoryTabs.PETS ) && 
                            <InventoryPetView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === InventoryTabs.BADGES ) && 
                            <InventoryBadgeView /> }
                    </div>
                </div>
            </DraggableWindow> }
        </InventoryContextProvider>
    );
}
