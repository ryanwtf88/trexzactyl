import tw from 'twin.macro';
import { Form } from 'formik';
import { breakpoint } from '@/theme';
import React, { forwardRef } from 'react';
import styled from 'styled-components/macro';
import FlashMessageRender from '@/components/FlashMessageRender';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container className={'relative'}>
        <div css={tw`fixed inset-0 z-[-1] pointer-events-none overflow-hidden`}>
            <div css={tw`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full`} />
            <div
                css={tw`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full`}
            />
        </div>

        {title && (
            <h2 css={tw`text-4xl text-center text-neutral-100 font-black uppercase tracking-tighter py-8`}>{title}</h2>
        )}
        <FlashMessageRender css={tw`mb-4 px-1`} />
        <Form {...props} ref={ref} css={tw`relative z-10`}>
            <div
                css={tw`w-full bg-neutral-900/40 backdrop-blur-xl border border-neutral-700/50 shadow-2xl rounded-3xl p-10`}
            >
                <div css={tw`flex-1`}>{props.children}</div>
            </div>
        </Form>
        <div
            css={tw`mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-neutral-500 gap-4`}
        >
            <p>
                &copy;{' '}
                <a href={'https://host.trexz.xyz'} css={tw`text-blue-400 hover:text-blue-300 transition-colors`}>
                    Trexzactyl
                </a>
                &nbsp;&bull;&nbsp;
                <a href={'https://github.com/ryanwtf88'} css={tw`hover:text-neutral-400 transition-colors`}>
                    Designed by RY4N
                </a>
            </p>
            <div css={tw`flex gap-4`}>
                <a href={'https://host.trexz.xyz'} css={tw`hover:text-neutral-400 transition-colors`}>
                    {' '}
                    Site{' '}
                </a>
                <span css={tw`opacity-30`}>&bull;</span>
                <a href={'https://github.com/Trexzactyl/Trexzactyl'} css={tw`hover:text-neutral-400 transition-colors`}>
                    {' '}
                    GitHub{' '}
                </a>
            </div>
        </div>
    </Container>
));
