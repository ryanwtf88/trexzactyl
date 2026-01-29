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
import ManualPurchaseForm from '@/components/store/forms/ManualPurchaseForm';

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
    const earn = useStoreState((state) => state.storefront.data?.earn);
    const paypal = useStoreState((state) => state.storefront.data?.gateways?.paypal);
    const stripe = useStoreState((state) => state.storefront.data?.gateways?.stripe);
    const bkash = useStoreState((state) => state.storefront.data?.gateways?.bkash);
    const nagad = useStoreState((state) => state.storefront.data?.gateways?.nagad);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources || !earn) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock title={'Account Balance'} description={'Purchase credits easily via Stripe or PayPal.'}>
            <div css={tw`lg:grid lg:grid-cols-2 my-10 gap-8`}>
                <div
                    className={'group'}
                    css={tw`bg-neutral-900/40 backdrop-blur-xl border border-neutral-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all hover:border-blue-500 shadow-2xl`}
                >
                    <div
                        css={tw`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60`}
                    />
                    <div
                        css={tw`absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/10 opacity-50`}
                    />
                    <div css={tw`absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full`} />

                    <div css={tw`relative z-10`}>
                        <div
                            css={tw`bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                        >
                            <Icon.DollarSign size={32} css={tw`text-blue-400`} strokeWidth={2.5} />
                        </div>
                        <p css={tw`text-neutral-500 font-bold text-xs mb-2`}>Total Available Assets</p>
                        <h1 css={tw`text-6xl md:text-7xl font-black text-white flex items-baseline justify-center`}>
                            {resources.balance.toLocaleString()}{' '}
                            <span css={tw`text-neutral-500 text-2xl ml-4 font-bold`}>Credits</span>
                        </h1>
                    </div>
                </div>

                <div
                    css={tw`bg-neutral-900/40 backdrop-blur-xl border border-neutral-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl hover:border-blue-500 transition-all`}
                >
                    <div
                        css={tw`absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-50`}
                    />
                    <p css={tw`text-xs font-bold text-neutral-500 mb-8`}>Secure Checkout</p>
                    <div css={tw`w-full max-w-sm relative z-10`}>
                        {!paypal && !stripe ? (
                            <p className={'text-gray-400 text-sm font-bold'}>Payment gateways are offline.</p>
                        ) : (
                            <div css={tw`space-y-6`}>
                                {paypal && (
                                    <div
                                        className={'group'}
                                        css={tw`shadow-lg hover:shadow-xl transition-all p-1 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10`}
                                    >
                                        <PaypalPurchaseForm />
                                    </div>
                                )}
                                {stripe && (
                                    <div
                                        className={'group'}
                                        css={tw`shadow-lg hover:shadow-xl transition-all p-1 bg-white/5 rounded-2xl border border-white/5 text-left hover:bg-white/10`}
                                    >
                                        <StripePurchaseForm />
                                    </div>
                                )}
                                {(bkash || nagad) && (
                                    <div
                                        className={'group'}
                                        css={tw`p-6 bg-white/5 rounded-2xl border border-white/5 text-left relative overflow-hidden hover:border-blue-500 transition-all`}
                                    >
                                        <div
                                            css={tw`absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-blue-500/20`}
                                        />
                                        <h3 css={tw`text-base text-white font-bold mb-4 flex items-center`}>
                                            <Icon.CreditCard size={18} css={tw`mr-2 text-blue-400`} strokeWidth={2.5} />
                                            Manual Gateway
                                        </h3>
                                        <ManualPurchaseForm />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {earn.enabled && (
                <div css={tw`mt-32 mb-20`}>
                    <div css={tw`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6`}>
                        <div>
                            <h1 css={tw`text-5xl font-black text-white mr-4`}>Idle Earning</h1>
                            <h3 css={tw`text-xl text-neutral-500 font-bold mt-2`}>Rewards for active sessions</h3>
                        </div>
                    </div>

                    <div css={tw`lg:grid lg:grid-cols-2 gap-8`}>
                        <div
                            className={'group'}
                            css={tw`bg-neutral-900/40 backdrop-blur-xl border border-neutral-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl hover:border-green-500 transition-all`}
                        >
                            <div
                                css={tw`absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-transparent opacity-50`}
                            />
                            <div
                                css={tw`bg-green-600/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border border-green-500/20 group-hover:rotate-12 transition-transform duration-500 shadow-lg`}
                            >
                                <Icon.Zap size={40} css={tw`text-green-400 animate-pulse`} strokeWidth={2.5} />
                            </div>
                            <p css={tw`text-neutral-500 font-bold text-xs mb-4`}>Live Accumulation Rate</p>
                            <h1 css={tw`text-7xl font-black text-white flex items-baseline tracking-tighter`}>
                                {earn.amount} <span css={tw`text-2xl ml-4 font-bold text-green-400`}>Cr / Min</span>
                            </h1>
                        </div>

                        <div
                            className={'group'}
                            css={tw`bg-neutral-900/40 backdrop-blur-xl border border-neutral-700 rounded-3xl p-12 flex flex-col justify-center relative overflow-hidden shadow-2xl hover:border-blue-500 transition-all`}
                        >
                            <div
                                css={tw`absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/5 blur-[100px] rounded-full`}
                            />
                            <h3 css={tw`text-xl font-bold text-white mb-6 flex items-center`}>
                                <Icon.Info css={tw`mr-3 text-blue-400`} size={24} strokeWidth={2.5} />
                                Protocol Manual
                            </h3>
                            <div css={tw`space-y-6 relative z-10 font-bold`}>
                                <p css={tw`text-neutral-400 text-sm leading-loose`}>
                                    Your account balance increases automatically while you remain active on the panel.
                                </p>
                                <div
                                    css={tw`bg-blue-600/10 rounded-2xl p-6 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all`}
                                >
                                    <p css={tw`text-sm text-blue-300 tracking-wide italic leading-relaxed`}>
                                        <span css={tw`text-white font-bold mr-1.5`}>{earn.amount} Credits</span>
                                        will be deposited for every 60 seconds of uptime.
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
