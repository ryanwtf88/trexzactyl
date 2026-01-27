import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import * as Icon from 'react-feather';
import styled from 'styled-components/macro';
import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import ContentBox from '@/components/elements/ContentBox';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import StripePurchaseForm from '@/components/store/forms/StripePurchaseForm';
import PaypalPurchaseForm from '@/components/store/forms/PaypalPurchaseForm';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('sm')`
      width: calc(50% - 1rem);
    `}

        ${breakpoint('md')`
      ${tw`w-auto flex-1`};
    `}
    }
`;

export default () => {
    const [resources, setResources] = useState<Resources>();
    const earn = useStoreState((state) => state.storefront.data!.earn);
    const paypal = useStoreState((state) => state.storefront.data!.gateways?.paypal);
    const stripe = useStoreState((state) => state.storefront.data!.gateways?.stripe);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock title={'Account Balance'} description={'Purchase credits easily via Stripe or PayPal.'}>
            <div css={tw`lg:grid lg:grid-cols-2 my-10 gap-8`}>
                <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                    <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl lg:w-1/4 h-full flex flex-col justify-center`}>
                        <p css={tw`text-neutral-500 font-black uppercase tracking-widest text-xs mb-2`}>Current Balance</p>
                        <h1 css={tw`text-5xl font-black text-neutral-100 uppercase tracking-tighter`}>
                            {resources.balance} <span css={tw`text-neutral-600 text-2xl ml-2`}>Credits</span>
                        </h1>
                    </div>
                </div>

                <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center`}>
                    <p css={tw`text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8`}>Purchase Credits</p>
                    <div css={tw`w-full max-w-sm`}>
                        {!paypal && !stripe ? (
                            <p className={'text-gray-400 text-sm'}>
                                Payment gateways are unavailable at this time.
                            </p>
                        ) : (
                            <div css={tw`space-y-4`}>
                                {paypal && <div css={tw`p-2 bg-white/5 rounded-2xl border border-white/5`}><PaypalPurchaseForm /></div>}
                                {stripe && <div css={tw`p-2 bg-white/5 rounded-2xl border border-white/5 text-left`}><StripePurchaseForm /></div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {earn.enabled && (
                <div css={tw`mt-20 text-center lg:text-left`}>
                    <h1 css={tw`text-5xl font-black uppercase tracking-tighter text-neutral-100 mb-2`}>Idle Credit Earning</h1>
                    <h3 css={tw`text-2xl text-neutral-500 font-medium tracking-tight mb-10`}>
                        Passive rewards for simply having the panel open.
                    </h3>

                    <div css={tw`lg:grid lg:grid-cols-2 gap-8`}>
                        <div css={tw`bg-blue-600/5 backdrop-blur-md border border-blue-500/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center`}>
                            <p css={tw`text-xs font-black uppercase tracking-[0.3em] text-blue-400/60 mb-6`}>Earning Rate</p>
                            <h1 css={tw`text-7xl font-black text-neutral-100 flex items-baseline tracking-tighter`}>
                                {earn.amount} <span css={tw`text-xl ml-4 font-black uppercase tracking-widest text-blue-400`}>credits / min</span>
                            </h1>
                        </div>

                        <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col justify-center`}>
                            <h3 css={tw`text-lg font-black uppercase tracking-widest text-neutral-100 mb-4 flex items-center justify-center lg:justify-start`}>
                                <Icon.Zap css={tw`mr-2 text-yellow-400`} size={20} /> How it works
                            </h3>
                            <div css={tw`space-y-4 text-neutral-400 font-medium leading-relaxed max-w-md mx-auto lg:mx-0`}>
                                <p>You earn credits automatically by keeping any page of this panel open in your browser.</p>
                                <div css={tw`bg-blue-400/10 rounded-2xl p-4 border border-blue-400/10`}>
                                    <p css={tw`text-sm text-blue-400`}>
                                        <span css={tw`font-black`}>{earn.amount} credits</span> will be added to your balance every minute of active session time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageContentBlock>
    );
};
