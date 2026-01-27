import React from 'react';
import tw from 'twin.macro';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    icon: IconProp;
    iconCss?: string;
    children: React.ReactChild[] | React.ReactChild;
}

export default ({ children, icon, iconCss }: Props) => (
    <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-lg transition-all hover:bg-neutral-900/60 hover:border-blue-500/20`}>
        <p css={tw`text-neutral-300 font-medium truncate flex items-center`}>
            <span css={tw`bg-blue-600/10 p-2 rounded-lg mr-3 flex items-center justify-center`}>
                <FontAwesomeIcon icon={icon} className={'text-blue-400 ' + iconCss} />
            </span>
            <span css={tw`text-sm tracking-tight`}>
                {children}
            </span>
        </p>
    </div>
);
