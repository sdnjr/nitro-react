import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerBotReachedAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam(botName);

    useEffect(() =>
    {
        setBotName(trigger.stringData);
    }, [ trigger ]);
    
    return (
        <WiredTriggerBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-column gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input className="form-control form-control-sm" maxLength={ 32 } type="text" value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
        </WiredTriggerBaseView>
    );
}
