import { BotSkillSaveComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { BotSkillsEnum, GetRoomObjectBounds, GetRoomSession, LocalizeText, RoomWidgetUpdateRentableBotChatEvent, SendMessageComposer } from '../../../../api';
import { Button, Column, DraggableWindow, DraggableWindowPosition, Flex, Text } from '../../../../common';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';

interface AvatarInfoRentableBotChatViewProps
{
    chatEvent: RoomWidgetUpdateRentableBotChatEvent;
    onClose(): void;
}

export const AvatarInfoRentableBotChatView: FC<AvatarInfoRentableBotChatViewProps> = props =>
{
    const { chatEvent = null, onClose = null } = props;
    // eslint-disable-next-line no-template-curly-in-string
    const [ newText, setNewText ] = useState<string>(chatEvent.chat === '${bot.skill.chatter.configuration.text.placeholder}' ? '' : chatEvent.chat);
    const [ automaticChat, setAutomaticChat ] = useState<boolean>(chatEvent.automaticChat);
    const [ mixSentences, setMixSentences ] = useState<boolean>(chatEvent.mixSentences);
    const [ chatDelay, setChatDelay ] = useState<number>(chatEvent.chatDelay);

    const getObjectLocation = useMemo(() => GetRoomObjectBounds(GetRoomSession().roomId, chatEvent.objectId, chatEvent.category, 1), [ chatEvent ]);

    const formatChatString = (value: string) => value.replace(/;#;/g, ' ').replace(/\r\n|\r|\n/g, '\r');

    const save = () =>
    {
        const chatConfiguration = formatChatString(newText) + ';#;' + automaticChat + ';#;' + chatDelay + ';#;' + mixSentences;

        SendMessageComposer(new BotSkillSaveComposer(chatEvent.botId, BotSkillsEnum.SETUP_CHAT, chatConfiguration));

        onClose();
    }
    
    return (
        <DraggableWindow dragStyle={ { top: getObjectLocation.y, left: getObjectLocation.x } } handleSelector=".drag-handler" windowPosition={ DraggableWindowPosition.NOTHING }>
            <div className="nitro-context-menu bot-chat">
                <ContextMenuHeaderView className="drag-handler">
                    { LocalizeText('bot.skill.chatter.configuration.title') }
                </ContextMenuHeaderView>
                <Column className="p-1">
                    <div className="flex flex-column gap-1">
                        <Text variant="white">{ LocalizeText('bot.skill.chatter.configuration.chat.text') }</Text>
                        <textarea className="form-control form-control-sm" placeholder={ LocalizeText('bot.skill.chatter.configuration.text.placeholder') } rows={ 7 } value={ newText } onChange={ e => setNewText(e.target.value) } />
                    </div>
                    <div className="flex flex-column gap-1">
                        <Flex alignItems="center" gap={ 1 } justifyContent="between">
                            <Text fullWidth variant="white">{ LocalizeText('bot.skill.chatter.configuration.automatic.chat') }</Text>
                            <input checked={ automaticChat } className="form-check-input" type="checkbox" onChange={ event => setAutomaticChat(event.target.checked) } />
                        </Flex>
                        <Flex alignItems="center" gap={ 1 } justifyContent="between">
                            <Text fullWidth variant="white">{ LocalizeText('bot.skill.chatter.configuration.markov') }</Text>
                            <input checked={ mixSentences } className="form-check-input" type="checkbox" onChange={ event => setMixSentences(event.target.checked) } />
                        </Flex>
                        <Flex alignItems="center" gap={ 1 } justifyContent="between">
                            <Text fullWidth variant="white">{ LocalizeText('bot.skill.chatter.configuration.chat.delay') }</Text>
                            <input className="form-control form-control-sm" type="number" value={ chatDelay } onChange={ event => setChatDelay(event.target.valueAsNumber) }/>
                        </Flex>
                    </div>
                    <Flex alignItems="center" gap={ 1 } justifyContent="between">
                        <Button fullWidth variant="primary" onClick={ onClose }>{ LocalizeText('cancel') }</Button>
                        <Button fullWidth variant="success" onClick={ save }>{ LocalizeText('save') }</Button>
                    </Flex>
                </Column>
            </div>
        </DraggableWindow>
    );
}
