import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotTeleportView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam(botName);

    useEffect(() =>
    {
        setBotName(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ save }>
            <div className="flex flex-column gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input className="form-control form-control-sm" maxLength={ 32 } type="text" value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
        </WiredActionBaseView>
    );
}
