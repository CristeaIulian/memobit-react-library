import { type FC, type KeyboardEvent, type ReactElement, useCallback, useState } from 'react';
import { GoogleGenAI } from '@google/genai';

import { InputText } from '../InputText';
import { Button } from '../Button';
import { Card } from '../Card';
import { Loading } from '../Loading';

import './ChatBot.scss';

interface ChatBotProp {}

interface ChatBotDetails {
    key: string;
    label: string;
    apiKey: string;
    platformUrl: string;
}

type ChatBot = 'gemini';

const chatBotsList: Record<ChatBot, ChatBotDetails> = {
    gemini: {
        key: 'gemini',
        label: 'Gemini',
        apiKey: 'AIzaSyDUhWr5Hswi0Tu-y-pqA1FtsbLaKXRH-rQ',
        platformUrl: 'https://aistudio.google.com/',
    },
};

const defaultChatBot: ChatBot = 'gemini';

const getGeminiResponse = (contents: string) => {
    const ai = new GoogleGenAI({ apiKey: chatBotsList.gemini.apiKey });

    return ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
    });
};

const formatOutput = (content: string): string => {
    return content.replace(/\n/g, '<br />').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
};

const currentChatBot = chatBotsList[defaultChatBot];

export const ChatBot: FC<ChatBotProp> = ({}: ChatBotProp): ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputContent, setInputContent] = useState<string>('');
    const [outputContent, setOutputContent] = useState<string>('');

    const askChatBot = useCallback(() => {
        setIsLoading(true);

        switch (currentChatBot.key) {
            case 'gemini':
                getGeminiResponse(inputContent)
                    .then((response): void => {
                        if (response.text) {
                            setOutputContent(formatOutput(response.text));
                        }
                    })
                    .catch((error): void => {
                        console.error(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });

                break;
            default:
                console.warn(`Unknown ${currentChatBot.label} chatbot specified.`);
                break;
        }
    }, [inputContent]);

    const handleInputOnChange = useCallback((value: string) => {
        setInputContent(value);
    }, []);

    const handleInputOnKeyUp = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && inputContent) {
                askChatBot();
            }
        },
        [inputContent]
    );

    return (
        <div className="ChatBot">
            <div className="input-container">
                <InputText
                    placeholder={`${currentChatBot.label} here. What's on your mind?`}
                    onKeyUp={handleInputOnKeyUp}
                    onChange={handleInputOnChange}
                    disabled={isLoading}
                />
                <Button variant="plain" prefixIcon="🌎" onClick={() => window.open(currentChatBot.platformUrl, '_blank')}></Button>
            </div>
            {outputContent && (
                <div className="output-container">
                    <Card>
                        <div dangerouslySetInnerHTML={{ __html: outputContent }}></div>
                    </Card>
                </div>
            )}

            {isLoading && <Loading />}
        </div>
    );
};
