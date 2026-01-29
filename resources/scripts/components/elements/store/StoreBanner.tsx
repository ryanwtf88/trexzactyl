import tw from 'twin.macro';
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from '@/components/elements/button';

interface BannerProps {
    className: string;
    title: string;
    action: string;
    link: string;
}

export default (props: BannerProps) => {
    return (
        <div
            css={[
                tw`w-full bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800/50 transition-all duration-300 relative`,
                tw`hover:border-blue-500/30 hover:shadow-2xl`,
            ]}
        >
            <div className={props.className} css={tw`absolute inset-0 opacity-30`} />
            <div
                css={tw`bg-neutral-900/80 backdrop-blur-md text-center p-6 m-4 mt-32 relative z-10 rounded-2xl border border-white/5`}
            >
                <p css={tw`text-2xl text-neutral-200 font-bold mb-4`}>{props.title}</p>
                <Link to={`/store/${props.link}`}>
                    <Button
                        css={tw`w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:border-blue-500/60 font-bold text-xs py-3 rounded-xl transition-all shadow-lg`}
                    >
                        {props.action}
                    </Button>
                </Link>
            </div>
        </div>
    );
};
