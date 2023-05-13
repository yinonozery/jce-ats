import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { InputRef, message } from 'antd';
import { Input, Tag } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { FIELD_MIN_LENGTH } from '../utils/messages';

type tagsProps = {
    tags: string[],
    setTags: Dispatch<SetStateAction<string[]>>,
}

const ChooseKeywords: React.FC<tagsProps> = (props) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    const handleClose = (removedTag: string) => {
        const newTags = props.tags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        props.setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue.length < 2) {
            message.error(FIELD_MIN_LENGTH("Keyword", 2));
            setInputVisible(false);
            return;
        }
        if (inputValue && props.tags.indexOf(inputValue) === -1) {
            props.setTags([...props.tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    const forMap = (tag: string) => {
        const tagElem = (
            <Tag
                closable
                onClose={(e: any) => {
                    e.preventDefault();
                    handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    };

    const tagChild = props.tags.map(forMap);

    const tagPlusStyle = {
        borderStyle: 'dashed',
    };

    return (
        <>
            <Tag color='blue' style={{ marginBlockEnd: '10px' }}>{props.tags.length > 0 ? props.tags.length : 'No'} Keywords</Tag>

            <div style={{ marginBottom: 16 }}>
                <TweenOneGroup
                    enter={{
                        scale: 0.8,
                        opacity: 0,
                        type: 'from',
                        duration: 100,
                    }}
                    onEnd={(e: any) => {
                        if (e.type === 'appear' || e.type === 'enter') {
                            (e.target as any).style = 'display: inline-block';
                        }
                    }}
                    leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                    appear={false}
                >
                    {tagChild}
                </TweenOneGroup>

            </div>
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 80 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <>
                    <Tag onClick={showInput} style={tagPlusStyle}>
                        <PlusOutlined /> New Keyword
                    </Tag>
                </>
            )}
        </>
    );
};

export default ChooseKeywords;