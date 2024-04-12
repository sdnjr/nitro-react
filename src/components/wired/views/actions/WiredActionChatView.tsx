import { FC, useEffect, useState } from 'react';
import { GetConfigurationValue, LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionChatView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () => setStringParam(message);

    useEffect(() =>
    {
        setMessage(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-column gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input className="form-control form-control-sm" maxLength={ GetConfigurationValue<number>('wired.action.chat.max.length', 100) } type="text" value={ message } onChange={ event => setMessage(event.target.value) } />
            </div>
        </WiredActionBaseView>
    );
}
