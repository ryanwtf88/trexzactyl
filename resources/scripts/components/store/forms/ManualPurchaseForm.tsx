import React, { useState, useEffect } from 'react';
import { useStoreState } from '@/state/hooks';
import http from '@/api/http';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { object, string, number } from 'yup';
import Field from '@/components/elements/Field';
import Button from '@/components/elements/button/Button';
import Spinner from '@/components/elements/Spinner';
import tw from 'twin.macro';
import useFlash from '@/plugins/useFlash';
import * as Icon from 'react-feather';
import styled from 'styled-components/macro';
import { motion, AnimatePresence } from 'framer-motion';

interface Values {
    amount: string;
    currency: string;
    sender_number: string;
    transaction_id: string;
}

const GatewayCard = styled(motion.div)<{ active: boolean; color: string }>`
    ${tw`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden`};
    ${(props) =>
        props.active
            ? `border-color: ${props.color}; background: rgba(0,0,0,0.3);`
            : tw`border-neutral-700 bg-neutral-900 opacity-60 hover:opacity-100`};
    box-shadow: ${(props) => (props.active ? `0 0 20px ${props.color}40` : 'none')};
`;

const InstructionCard = styled(motion.div)<{ color: string }>`
    ${tw`rounded-xl p-6 mt-6 border relative overflow-hidden`};
    background: linear-gradient(145deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.9) 100%);
    border-color: ${(props) => props.color};
    box-shadow: 0 10px 30px -10px ${(props) => props.color}20;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: ${(props) => props.color};
        box-shadow: 0 0 15px ${(props) => props.color};
    }
`;

const Step = styled.div`
    ${tw`flex items-start mb-4 last:mb-0 relative z-10`};
`;

const StepNumber = styled.span<{ color: string }>`
    ${tw`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold mr-4 flex-shrink-0 shadow-lg`};
    background: ${(props) => props.color};
    box-shadow: 0 0 10px ${(props) => props.color}60;
`;

const CopyButton = styled.button`
    ${tw`ml-3 px-2 py-1 rounded bg-neutral-700 text-xs text-white hover:bg-neutral-600 transition-colors uppercase font-bold tracking-wide`};
`;

const PriceDisplay = ({
    amount,
    currencyCode,
    price,
    color,
}: {
    amount: string;
    currencyCode: string;
    price: number;
    color: string;
}) => {
    const val = parseInt(amount) || 0;
    const cost = (val / 100) * price;

    return (
        <div css={tw`bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex justify-between items-center mt-4`}>
            <span css={tw`text-gray-400 font-medium`}>Total Payment Required</span>
            <span style={{ color }} css={tw`font-bold text-2xl`}>
                {cost.toFixed(2)} {currencyCode}
            </span>
        </div>
    );
};

export default () => {
    const { addFlash, clearFlashes } = useFlash();
    const storefront = useStoreState((state) => state.storefront.data);
    const user = useStoreState((state) => state.user.data);

    const [copied, setCopied] = useState(false);

    if (!storefront || !user) return null;

    const gateways = storefront.gateways;
    const userId = user.uuid;
    const creditPrice = storefront.credit_price;
    const currency = storefront.currency;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes('store:manual');
        http.post('/api/client/store/manual', {
            amount: parseInt(values.amount),
            currency: values.currency,
            sender_number: values.sender_number,
            transaction_id: values.transaction_id,
        })
            .then(() => {
                setSubmitting(false);
                resetForm();
                addFlash({
                    type: 'success',
                    key: 'store:manual',
                    message: 'Payment submitted successfully! Waiting for approval.',
                });
            })
            .catch((error) => {
                setSubmitting(false);
                addFlash({
                    type: 'danger',
                    key: 'store:manual',
                    message: error.response?.data?.errors?.[0]?.detail || 'Unable to submit payment.',
                });
            });
    };

    if (!gateways?.bkash && !gateways?.nagad) return null;

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                amount: '100',
                currency: gateways.bkash ? 'bkash' : 'nagad',
                sender_number: '',
                transaction_id: '',
            }}
            validationSchema={object().shape({
                amount: number().required().min(10, 'Minimum 10 credits.'),
                currency: string().required(),
                sender_number: string().required('Required.'),
                transaction_id: string().required('Required.'),
            })}
        >
            {({ isSubmitting, values, setFieldValue }) => {
                const isBkash = values.currency === 'bkash';
                const activeColor = isBkash ? '#E2136E' : '#F6921E'; // bKash Pink : Nagad Orange
                const activeNumber = isBkash ? gateways.bkash : gateways.nagad;
                const activeName = isBkash ? 'bKash' : 'Nagad';

                return (
                    <Form>
                        <div css={tw`mb-8`}>
                            <h2 css={tw`text-2xl font-bold text-white mb-2`}>Manual Payment</h2>
                            <p css={tw`text-gray-400`}>Select your preferred mobile wallet to proceed.</p>
                        </div>

                        <div css={tw`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6`}>
                            {gateways.bkash && (
                                <GatewayCard
                                    active={values.currency === 'bkash'}
                                    color='#E2136E'
                                    onClick={() => setFieldValue('currency', 'bkash')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div css={tw`flex items-center justify-between`}>
                                        <span css={tw`font-bold text-xl text-white`}>bKash</span>
                                        {values.currency === 'bkash' && (
                                            <Icon.CheckCircle size={24} css={tw`text-[#E2136E]`} />
                                        )}
                                    </div>
                                    <div css={tw`mt-2 text-gray-400 text-sm`}>Pay via App or *247#</div>
                                </GatewayCard>
                            )}
                            {gateways.nagad && (
                                <GatewayCard
                                    active={values.currency === 'nagad'}
                                    color='#F6921E'
                                    onClick={() => setFieldValue('currency', 'nagad')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div css={tw`flex items-center justify-between`}>
                                        <span css={tw`font-bold text-xl text-white`}>Nagad</span>
                                        {values.currency === 'nagad' && (
                                            <Icon.CheckCircle size={24} css={tw`text-[#F6921E]`} />
                                        )}
                                    </div>
                                    <div css={tw`mt-2 text-gray-400 text-sm`}>Pay via App or *167#</div>
                                </GatewayCard>
                            )}
                        </div>

                        <Field name={'amount'} label={'Credits to Purchase'} type={'number'} />

                        <PriceDisplay
                            amount={values.amount}
                            currencyCode={currency}
                            price={creditPrice}
                            color={activeColor}
                        />

                        <AnimatePresence exitBeforeEnter>
                            <InstructionCard
                                key={values.currency}
                                color={activeColor}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 css={tw`text-xl font-bold text-white mb-6 flex items-center`}>
                                    <Icon.Smartphone size={20} css={tw`mr-3 opacity-80`} />
                                    Payment Instructions
                                </h3>

                                <div css={tw`space-y-4`}>
                                    <Step>
                                        <StepNumber color={activeColor}>1</StepNumber>
                                        <div css={tw`text-gray-300`}>
                                            Open your <strong>{activeName} App</strong> and select{' '}
                                            <strong>Send Money</strong>.
                                        </div>
                                    </Step>
                                    <Step>
                                        <StepNumber color={activeColor}>2</StepNumber>
                                        <div css={tw`text-gray-300`}>
                                            Enter Receiver Number:{' '}
                                            <span css={tw`text-white font-mono font-bold text-lg ml-1`}>
                                                {activeNumber}
                                            </span>
                                            <CopyButton
                                                type='button'
                                                onClick={() => copyToClipboard(activeNumber || '')}
                                            >
                                                {copied ? <Icon.CheckCircle size={12} /> : <Icon.Copy size={12} />}{' '}
                                                {copied ? 'COPIED' : 'COPY'}
                                            </CopyButton>
                                        </div>
                                    </Step>
                                    <Step>
                                        <StepNumber color={activeColor}>3</StepNumber>
                                        <div css={tw`text-gray-300`}>
                                            Enter Amount:{' '}
                                            <strong style={{ color: activeColor }}>
                                                {(((parseInt(values.amount) || 0) / 100) * creditPrice).toFixed(2)}{' '}
                                                {currency}
                                            </strong>
                                        </div>
                                    </Step>
                                    <Step>
                                        <StepNumber color={activeColor}>4</StepNumber>
                                        <div css={tw`text-gray-300`}>
                                            Enter Reference: <strong css={tw`text-white`}>{userId}</strong> (Optional)
                                        </div>
                                    </Step>
                                    <div tw='mt-4 p-4 rounded-lg bg-black/40 border border-white/5'>
                                        <div tw='flex justify-between items-center mb-2'>
                                            <span tw='text-neutral-400 text-sm'>Amount in USD</span>
                                            <span tw='text-white font-medium'>{values.amount} USD</span>
                                        </div>
                                        <div tw='flex justify-between items-center'>
                                            <span tw='text-neutral-400 text-sm'>Amount in BDT</span>
                                            <span tw='text-white font-bold text-lg'>
                                                {(
                                                    Number(values.amount) *
                                                    (storefront?.gateways.conversion_rate || 115)
                                                ).toFixed(2)}{' '}
                                                BDT
                                            </span>
                                        </div>
                                        <p tw='text-[10px] text-neutral-500 mt-2 italic text-right'>
                                            Rate: 1 USD = {storefront?.gateways.conversion_rate || 115} BDT
                                        </p>
                                    </div>
                                    <Step>
                                        <StepNumber color={activeColor}>5</StepNumber>
                                        <div css={tw`text-gray-300`}>
                                            Confirm with your PIN. Copy the <strong>Transaction ID</strong>.
                                        </div>
                                    </Step>
                                </div>
                            </InstructionCard>
                        </AnimatePresence>

                        <div css={tw`mt-8 p-6 bg-neutral-800 rounded-xl border border-neutral-700`}>
                            <h3 css={tw`text-lg font-bold text-white mb-4`}>Verify Transaction</h3>
                            <div css={tw`grid grid-cols-1 md:grid-cols-2 gap-6`}>
                                <Field
                                    name={'sender_number'}
                                    label={'Your Wallet Number'}
                                    description={'The number you sent money from.'}
                                />
                                <Field
                                    name={'transaction_id'}
                                    label={'Transaction ID (TrxID)'}
                                    description={'Paste the ID from the app.'}
                                />
                            </div>
                            <div css={tw`mt-6 text-right`}>
                                <Button
                                    type={'submit'}
                                    disabled={isSubmitting}
                                    size={Button.Sizes.Large}
                                    style={{ background: activeColor, borderColor: activeColor }}
                                >
                                    {isSubmitting ? <Spinner size={'small'} /> : 'Verify Payment'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};
