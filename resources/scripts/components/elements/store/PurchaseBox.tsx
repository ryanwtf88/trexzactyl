import tw from 'twin.macro';
import { Button } from '@/components/elements/button';
import React, { Dispatch, SetStateAction } from 'react';

interface BoxProps {
    type: string;
    icon: React.ReactElement;
    amount: number;
    suffix?: string;
    description: string;
    cost: number;

    setOpen: Dispatch<SetStateAction<boolean>>;
    setResource: Dispatch<SetStateAction<string>>;
}

export default (props: BoxProps) => (
    <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-blue-500/30 hover:bg-neutral-900/60`}>
        <div css={tw`bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 mb-6 group-hover:scale-110 transition-transform duration-300`}>
            {React.cloneElement(props.icon as React.ReactElement, { size: 32, css: tw`text-blue-400` })}
        </div>

        <h2 css={tw`text-xl font-black uppercase tracking-widest text-neutral-100 mb-2`}>
            {props.type}
        </h2>

        <p css={tw`text-sm text-neutral-400 font-medium mb-6 px-4 leading-relaxed h-10 overflow-hidden`}>
            {props.description}
        </p>

        <div css={tw`w-full bg-neutral-950/40 rounded-xl p-4 border border-white/5 mb-6`}>
            <p css={tw`text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1`}>
                Cost per {props.amount}{props.suffix}
            </p>
            <p css={tw`text-2xl font-black text-neutral-100`}>
                {props.cost} <span css={tw`text-xs text-neutral-400 font-bold ml-1 tracking-normal`}>CREDITS</span>
            </p>
        </div>

        <Button
            css={tw`w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:border-blue-500/60 font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg`}
            onClick={() => {
                props.setOpen(true);
                props.setResource(props.type.toLowerCase());
            }}
        >
            Add +{props.amount}{props.suffix}
        </Button>
    </div>
);
