import { useState } from "react";
import { Input, Tag } from "antd";

export const TableKeywordsSeach = (props: any) => {
    const { Search } = Input;
    const [searchKeywords, setSearchKeywords] = useState<any>('');
    const colors = ['red', 'volcano', 'orange', 'gold', 'green', 'cyan', 'blue', 'geekblue', ' purple']
    const randomColor = colors[parseInt(((1 << 24) * Math.random()).toFixed(2)) % (colors.length - 1)];

    return (
        <>
            <Search placeholder='Search in keywords' style={{ width: 200 }} onChange={(w) => setSearchKeywords(w.target.value)} />
            <div style={{ display: 'flex', flexWrap: "wrap", margin: '10px 0', flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                {searchKeywords.length > 1 && props.record.keywords.filter((keyword: string) => keyword.toLowerCase().includes(searchKeywords.toLowerCase())).map((keyword: string, index: number) => {
                    return <Tag key={index} color={randomColor} style={{ justifyItems: 'center', width: 'fit-content', margin: '3px' }}>{keyword}</Tag>
                })}
            </div>
        </>
    )
}

export default TableKeywordsSeach;