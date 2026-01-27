import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import React, { useState, useEffect } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button';
import { Dialog } from '@/components/elements/dialog';
import { getCosts, Costs } from '@/api/store/getCosts';
import purchaseResource from '@/api/store/purchaseResource';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import PurchaseBox from '@/components/elements/store/PurchaseBox';
import PageContentBlock from '@/components/elements/PageContentBlock';

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
    const [open, setOpen] = useState(false);
    const [costs, setCosts] = useState<Costs>();
    const [resource, setResource] = useState('');
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    useEffect(() => {
        getCosts().then((costs) => setCosts(costs));
    }, []);

    const purchase = (resource: string) => {
        clearFlashes('store:resources');

        purchaseResource(resource)
            .then(() => {
                setOpen(false);
                addFlash({
                    type: 'success',
                    key: 'store:resources',
                    message: 'Resource has been added to your account.',
                });
            })
            .catch((error) => clearAndAddHttpError({ key: 'store:resources', error }));
    };

    if (!costs) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock
            title={'Buy Resources'}
            description={'Buy more resources to add to your server.'}
            showFlashKey={'store:resources'}
        >
            <SpinnerOverlay size={'large'} visible={open} />
            <Dialog.Confirm
                open={open}
                onClose={() => setOpen(false)}
                title={'Confirm resource seletion'}
                confirm={'Continue'}
                onConfirmed={() => purchase(resource)}
            >
                Are you sure you want to purchase this resource ({resource})? This will take the credits from your
                account and add the resource. This is not a reversible transaction.
            </Dialog.Confirm>
            <Container css={tw`lg:grid lg:grid-cols-4 my-10 gap-8`}>
                <PurchaseBox
                    type={'CPU'}
                    amount={50}
                    suffix={'%'}
                    cost={costs.cpu}
                    setOpen={setOpen}
                    icon={<Icon.Cpu />}
                    setResource={setResource}
                    description={'Improve server load times and processing performance.'}
                />
                <PurchaseBox
                    type={'Memory'}
                    amount={1}
                    suffix={'GB'}
                    cost={costs.memory}
                    setOpen={setOpen}
                    icon={<Icon.PieChart />}
                    setResource={setResource}
                    description={'Improve overall server stability and memory headroom.'}
                />
                <PurchaseBox
                    type={'Disk'}
                    amount={1}
                    suffix={'GB'}
                    cost={costs.disk}
                    setOpen={setOpen}
                    icon={<Icon.HardDrive />}
                    setResource={setResource}
                    description={'Expand storage capacity for more files and data.'}
                />
                <PurchaseBox
                    type={'Slots'}
                    amount={1}
                    cost={costs.slots}
                    setOpen={setOpen}
                    icon={<Icon.Server />}
                    setResource={setResource}
                    description={'Increase your server slot limit to deploy new instances.'}
                />
            </Container>
            <Container css={tw`lg:grid lg:grid-cols-4 my-10 gap-8`}>
                <PurchaseBox
                    type={'Ports'}
                    amount={1}
                    cost={costs.ports}
                    setOpen={setOpen}
                    icon={<Icon.Share2 />}
                    setResource={setResource}
                    description={'Add extra network ports for additional services.'}
                />
                <PurchaseBox
                    type={'Backups'}
                    amount={1}
                    cost={costs.backups}
                    setOpen={setOpen}
                    icon={<Icon.Archive />}
                    setResource={setResource}
                    description={'Secure more backup slots to keep your data safe.'}
                />
                <PurchaseBox
                    type={'Databases'}
                    amount={1}
                    cost={costs.databases}
                    setOpen={setOpen}
                    icon={<Icon.Database />}
                    setResource={setResource}
                    description={'Add more MySQL databases for your applications.'}
                />
                <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6`}>
                    <h3 css={tw`text-sm font-black uppercase tracking-widest text-neutral-100 mb-4 flex items-center`}>
                        <Icon.Info size={16} css={tw`mr-2 text-blue-400`} /> Usage Guide
                    </h3>
                    <div css={tw`space-y-4`}>
                        <div>
                            <p css={tw`text-xs font-black uppercase tracking-widest text-blue-400 mb-1`}>Existing Servers</p>
                            <p css={tw`text-xs text-neutral-400 leading-relaxed font-medium`}>
                                Navigate to a server&apos;s &apos;Edit&apos; tab to allocate newly purchased resources.
                            </p>
                        </div>
                        <div>
                            <p css={tw`text-xs font-black uppercase tracking-widest text-blue-400 mb-1`}>New Deployments</p>
                            <p css={tw`text-xs text-neutral-400 leading-relaxed font-medium`}>
                                Allocated resources can be assigned during the creation process in the storefront.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
            <div css={tw`flex justify-center items-center mt-16`}>
                <div
                    className={'group'}
                    css={tw`w-full max-w-4xl bg-blue-600/5 backdrop-blur-sm border border-blue-500/20 p-8 rounded-3xl text-center relative overflow-hidden`}
                >
                    <div css={tw`absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <h1 css={tw`text-4xl font-black uppercase tracking-tighter text-neutral-100 mb-2`}>Ready to get started?</h1>
                    <p css={tw`text-neutral-400 font-medium mb-8`}>Deploy your next high-performance server in seconds.</p>
                    <Link to={'/store/create'}>
                        <Button css={tw`px-12 bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:border-blue-500/60 font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-lg`}>
                            Create a server
                        </Button>
                    </Link>
                </div>
            </div>
        </PageContentBlock>
    );
};
