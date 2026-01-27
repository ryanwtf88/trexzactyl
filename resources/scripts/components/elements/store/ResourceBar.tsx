import tw from 'twin.macro';
import classNames from 'classnames';
import * as Icon from 'react-feather';
import styled from 'styled-components/macro';
import { megabytesToHuman } from '@/helpers';
import React, { useState, useEffect } from 'react';
import Spinner from '@/components/elements/Spinner';
import ContentBox from '@/components/elements/ContentBox';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import StoreContainer from '@/components/elements/StoreContainer';
import { getResources, Resources } from '@/api/store/getResources';

const Wrapper = styled.div`
    ${tw`text-2xl flex flex-row justify-center items-center`};
`;

interface RowProps {
    className?: string;
    titles?: boolean;
}

interface BoxProps {
    title: string;
    description: string;
    icon: React.ReactElement;
    amount: number;
    toHuman?: boolean;
    suffix?: string;
}

export default ({ className, titles }: RowProps) => {
    const [resources, setResources] = useState<Resources>();

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources) return <Spinner size={'large'} centered />;

    const ResourceBox = (props: BoxProps) => (
        <ContentBox css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-xl p-2 transition-all hover:bg-neutral-900/60`}>
            <Tooltip content={props.description}>
                <Wrapper css={tw`flex flex-col items-center py-1`}>
                    <div css={tw`bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 mb-1 text-blue-400`}>
                        {React.cloneElement(props.icon as React.ReactElement, { size: 14 })}
                    </div>
                    <p css={tw`text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-0.5 leading-none`}>
                        {props.title}
                    </p>
                    <div css={tw`flex items-baseline`}>
                        <span css={tw`text-sm font-black text-neutral-100 tabular-nums`}>
                            {props.toHuman ? megabytesToHuman(props.amount) : props.amount}
                        </span>
                        {props.suffix && (
                            <span css={tw`text-[10px] text-neutral-500 font-bold ml-0.5 tracking-tight`}>
                                {props.suffix}
                            </span>
                        )}
                    </div>
                </Wrapper>
            </Tooltip>
        </ContentBox>
    );

    return (
        <StoreContainer css={tw`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4`}>
            <ResourceBox
                title={'Credits'}
                description={'Available credits'}
                icon={<Icon.DollarSign />}
                amount={resources.balance}
            />
            <ResourceBox
                title={'CPU'}
                description={'Available CPU capacity'}
                icon={<Icon.Cpu />}
                amount={resources.cpu}
                suffix={'%'}
            />
            <ResourceBox
                title={'Memory'}
                description={'Available memory'}
                icon={<Icon.PieChart />}
                amount={resources.memory}
                toHuman
            />
            <ResourceBox
                title={'Disk'}
                description={'Available storage'}
                icon={<Icon.HardDrive />}
                amount={resources.disk}
                toHuman
            />
            <ResourceBox
                title={'Slots'}
                description={'Available server slots'}
                icon={<Icon.Server />}
                amount={resources.slots}
            />
            <ResourceBox
                title={'Ports'}
                description={'Available network ports'}
                icon={<Icon.Share2 />}
                amount={resources.ports}
            />
            <ResourceBox
                title={'Backups'}
                description={'Available backup slots'}
                icon={<Icon.Archive />}
                amount={resources.backups}
            />
            <ResourceBox
                title={'Databases'}
                description={'Available MySQL databases'}
                icon={<Icon.Database />}
                amount={resources.databases}
            />
        </StoreContainer>
    );
};
