'use client'
import React, { useMemo, useState } from 'react';
import { Input, Tree } from 'antd';
import type { TreeDataNode } from 'antd';

const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
let defaultData: TreeDataNode[] = [];

defaultData = [
    {
        key: "r-1",
        title: "现金区",
        children: [
            {
                key: "c-01",
                title: "左1摄像头",
            },
            {
                key: "c-02",
                title: "左2摄像头",
            },
            {
                key: "c-03",
                title: "右1摄像头",
            },
            {
                key: "c-04",
                title: "右2摄像头",
            },
            {
                key: "c-05",
                title: "正摄像头",
            },
        ]
    },
    {
        key: "r-2",
        title: "客户区",
        children: [
            {
                key: "c-06",
                title: "左1摄像头",
            },
            {
                key: "c-07",
                title: "左2摄像头",
            },
            {
                key: "c-08",
                title: "右1摄像头",
            },
            {
                key: "c-09",
                title: "右2摄像头",
            },
            {
                key: "c-10",
                title: "正摄像头",
            },
        ]
    }
]

// 展平数据 生成key-value对
const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: TreeDataNode[]) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key } = node;
        dataList.push({ key, title: node.title as string});
        if (node.children) {
            generateList(node.children);
        }
    }
};
generateList(defaultData);

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey!;
};

const Taskloc: React.FC = () => {
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const onExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const newExpandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, defaultData);
                }
                return null;
            })
            .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    const treeData = useMemo(() => {
        const loop = (data: TreeDataNode[]): TreeDataNode[] =>
            data.map((item) => {
                const strTitle = item.title as string;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{strTitle}</span>
                    );
                if (item.children) {
                    return { title, key: item.key, children: loop(item.children) };
                }

                return {
                    title,
                    key: item.key,
                };
            });

        return loop(defaultData);
    }, [searchValue]);

    return (
        <div>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
            <Tree
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={treeData}
            />
        </div>
    );
};

export default Taskloc;