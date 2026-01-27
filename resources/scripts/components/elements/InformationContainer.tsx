import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import apiVerify from '@/api/account/verify';
import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { getResources } from '@/api/store/getResources';
import Translate from '@/components/elements/Translate';
import InformationBox from '@/components/elements/InformationBox';
import getLatestActivity, { Activity } from '@/api/account/getLatestActivity';
import { wrapProperties } from '@/components/elements/activity/ActivityLogEntry';
import {
    faCircle,
    faCoins,
    faExclamationCircle,
    faScroll,
    faTimesCircle,
    faUserLock,
} from '@fortawesome/free-solid-svg-icons';

export default () => {
    const { addFlash } = useFlash();
    const [bal, setBal] = useState(0);
    const [activity, setActivity] = useState<Activity>();
    const properties = wrapProperties(activity?.properties);
    const user = useStoreState((state) => state.user.data!);
    const store = useStoreState((state) => state.storefront.data!);

    useEffect(() => {
        getResources().then((d) => setBal(d.balance));
        getLatestActivity().then((d) => setActivity(d));
    }, []);

    const verify = () => {
        apiVerify().then((data) => {
            if (data.success)
                addFlash({ type: 'info', key: 'dashboard', message: 'Verification email has been resent.' });
        });
    };

    return (
        <div css={tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full`}>
            {store.earn.enabled ? (
                <InformationBox icon={faCircle as any} iconCss={'animate-pulse'}>
                    Earning <span css={tw`text-green-400 font-bold ml-1`}>{store.earn.amount}</span> <span css={tw`text-neutral-500 text-xs uppercase ml-1`}>credits / min</span>
                </InformationBox>
            ) : (
                <InformationBox icon={faExclamationCircle as any}>
                    Credit earning <span css={tw`text-red-400 font-bold ml-1`}>Disabled</span>
                </InformationBox>
            )}
            <InformationBox icon={faCoins as any}>
                <span css={tw`text-green-400 font-bold mr-1`}>{bal}</span> Credits Available
            </InformationBox>
            <InformationBox icon={faUserLock as any}>
                {user.useTotp ? (
                    <span css={tw`text-green-400 font-bold`}>2FA Secure</span>
                ) : (
                    <span css={tw`text-yellow-400 font-bold`}>Enable 2FA</span>
                )}
            </InformationBox>
            {!user.verified ? (
                <InformationBox icon={faTimesCircle as any} iconCss={'text-yellow-500'}>
                    <span onClick={verify} css={tw`cursor-pointer text-blue-400 hover:text-blue-300 font-bold`}>
                        Verify Account
                    </span>
                </InformationBox>
            ) : (
                <InformationBox icon={faScroll as any}>
                    <div css={tw`flex flex-col`}>
                        <span css={tw`text-neutral-400 text-xs`}>Latest Activity</span>
                        <div css={tw`truncate max-w-[150px]`}>
                            {activity ? (
                                <Translate
                                    ns={'activity'}
                                    values={properties}
                                    i18nKey={activity.event.replace(':', '.')}
                                />
                            ) : (
                                'No logs'
                            )}
                        </div>
                    </div>
                </InformationBox>
            )}
        </div>
    );
};
