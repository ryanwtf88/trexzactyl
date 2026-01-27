import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { Form, Formik, FieldProps } from 'formik';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { number, object, string } from 'yup';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import Select from '@/components/elements/Select';
import { Egg, getEggs } from '@/api/store/getEggs';
import createServer from '@/api/store/createServer';
import Spinner from '@/components/elements/Spinner';
import { getNodes, Node } from '@/api/store/getNodes';
import { getNests, Nest } from '@/api/store/getNests';
import { Button } from '@/components/elements/button';
import InputSpinner from '@/components/elements/InputSpinner';
import StoreError from '@/components/elements/store/StoreError';
import React, { ChangeEvent, useEffect, useState } from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';

interface CreateValues {
    name: string;
    description: string | null;
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number | null;
    databases: number | null;

    egg: number;
    nest: number;
    node: number;
}

export default () => {
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState<Resources>();

    const user = useStoreState((state) => state.user.data!);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const [egg, setEgg] = useState<number>(0);
    const [eggs, setEggs] = useState<Egg[]>();
    const [nest, setNest] = useState<number>(0);
    const [nests, setNests] = useState<Nest[]>();
    const [node, setNode] = useState<number>(0);
    const [nodes, setNodes] = useState<Node[]>();

    useEffect(() => {
        clearFlashes();

        getResources().then((resources) => setResources(resources));

        getEggs().then((eggs) => setEggs(eggs));
        getNests().then((nests) => setNests(nests));
        getNodes().then((nodes) => setNodes(nodes));
    }, []);

    const changeNest = (e: ChangeEvent<HTMLSelectElement>) => {
        setNest(parseInt(e.target.value));

        getEggs(parseInt(e.target.value)).then((eggs) => {
            setEggs(eggs);
            setEgg(eggs[0].id);
        });
    };

    const submit = (values: CreateValues) => {
        setLoading(true);
        clearFlashes('store:create');

        createServer(values, egg, nest, node)
            .then((data) => {
                if (!data.id) return;

                setLoading(false);
                clearFlashes('store:create');
                // @ts-expect-error this is valid
                window.location = `/server/${data.id}`;
            })
            .catch((error) => {
                setLoading(false);
                clearAndAddHttpError({ key: 'store:create', error });
            });
    };

    if (!resources) return <Spinner size={'large'} centered />;

    if (!nodes) {
        return (
            <StoreError
                message={'No nodes are available for deployment. Try again later.'}
                admin={'Ensure you have at least one node that can be deployed to.'}
            />
        );
    }

    if (!nests || !eggs) {
        return (
            <StoreError
                message={'No server types are available for deployment. Try again later.'}
                admin={'Ensure you have at least one egg which is in a public nest.'}
            />
        );
    }

    return (
        <PageContentBlock title={'Create Server'} showFlashKey={'store:create'}>
            <Formik
                onSubmit={submit}
                initialValues={{
                    name: `${user.username}'s server`,
                    description: 'Write a server description here.',
                    cpu: resources.cpu,
                    memory: resources.memory,
                    disk: resources.disk,
                    ports: resources.ports,
                    backups: resources.backups,
                    databases: resources.databases,
                    nest: 1,
                    egg: 1,
                    node: 1,
                }}
                validationSchema={object().shape({
                    name: string().required().min(3),
                    description: string().optional().min(3).max(191),

                    cpu: number().required().min(25).max(resources.cpu),
                    memory: number().required().min(256).max(resources.memory),
                    disk: number().required().min(256).max(resources.disk),

                    ports: number().required().min(1).max(resources.ports),
                    backups: number().optional().max(resources.backups),
                    databases: number().optional().max(resources.databases),

                    node: number().required().default(node),
                    nest: number().required().default(nest),
                    egg: number().required().default(egg),
                })}
            >
                <Form css={tw`space-y-6`}>
                    {/* Basic Details & Resource Limits Row */}
                    <div css={tw`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
                        <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden transition-all hover:bg-neutral-900/60`}>
                            <div css={tw`flex items-center mb-4`}>
                                <div css={tw`bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 mr-3`}>
                                    <Icon.Tag size={18} css={tw`text-blue-400`} />
                                </div>
                                <h2 css={tw`text-sm font-black uppercase tracking-widest text-neutral-100`}>Basic Details</h2>
                            </div>
                            <div css={tw`space-y-4`}>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Server Name</h3>
                                    <Field name={'name'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Description (Optional)</h3>
                                    <Field name={'description'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                            </div>
                        </div>

                        <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden transition-all hover:bg-neutral-900/60`}>
                            <div css={tw`flex items-center mb-4`}>
                                <div css={tw`bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 mr-3`}>
                                    <Icon.Cpu size={18} css={tw`text-blue-400`} />
                                </div>
                                <h2 css={tw`text-sm font-black uppercase tracking-widest text-neutral-100`}>Resource Limits</h2>
                            </div>
                            <div css={tw`grid grid-cols-3 gap-3`}>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>CPU (%)</h3>
                                    <Field name={'cpu'} type={'number'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>RAM (MB)</h3>
                                    <Field name={'memory'} type={'number'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Disk (MB)</h3>
                                    <Field name={'disk'} type={'number'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                            </div>
                            <div css={tw`mt-4 flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-500`}>
                                <span>Pool: <span css={tw`text-blue-400`}>{resources.cpu}% CPU</span></span>
                                <span>Pool: <span css={tw`text-blue-400`}>{resources.memory}MB RAM</span></span>
                                <span>Pool: <span css={tw`text-blue-400`}>{resources.disk}MB Disk</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Scaling & Deployment Row */}
                    <div css={tw`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
                        <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden transition-all hover:bg-neutral-900/60`}>
                            <div css={tw`flex items-center mb-4`}>
                                <div css={tw`bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 mr-3`}>
                                    <Icon.Layers size={18} css={tw`text-blue-400`} />
                                </div>
                                <h2 css={tw`text-sm font-black uppercase tracking-widest text-neutral-100`}>Scaling</h2>
                            </div>
                            <div css={tw`grid grid-cols-3 gap-3`}>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Ports</h3>
                                    <Field name={'ports'} type={'number'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>DBs</h3>
                                    <Field name={'databases'} type={'number'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Backups</h3>
                                    <Field name={'backups'} type={'number'} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-sm`} />
                                </div>
                            </div>
                            <div css={tw`mt-4 flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-500`}>
                                <span>Pool: <span css={tw`text-blue-400`}>{resources.ports} Ports</span></span>
                                <span>Pool: <span css={tw`text-blue-400`}>{resources.databases} DBs</span></span>
                                <span>Pool: <span css={tw`text-blue-400`}>{resources.backups} Backups</span></span>
                            </div>
                        </div>

                        <div css={tw`bg-neutral-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden transition-all hover:bg-neutral-900/60`}>
                            <div css={tw`flex items-center mb-4`}>
                                <div css={tw`bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 mr-3`}>
                                    <Icon.Grid size={18} css={tw`text-blue-400`} />
                                </div>
                                <h2 css={tw`text-sm font-black uppercase tracking-widest text-neutral-100`}>Deployment</h2>
                            </div>
                            <div css={tw`grid grid-cols-2 gap-3 mb-3`}>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Select Node</h3>
                                    <Select name={'node'} onChange={(e) => setNode(parseInt(e.target.value))} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-xs`}>
                                        {!node && <option>Select a node...</option>}
                                        {nodes.map((n) => (
                                            <option key={n.id} value={n.id}>
                                                {n.name} ({n.location}) | {100 - parseInt(((n?.used / n?.total) * 100).toFixed(0))}% Free
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Server Nest</h3>
                                    <Select name={'nest'} onChange={(e) => changeNest(e)} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-xs`}>
                                        {!nest && <option>Select a nest...</option>}
                                        {nests.map((n) => (
                                            <option key={n.id} value={n.id}>{n.name}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div css={tw`w-full`}>
                                <h3 css={tw`text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 ml-1`}>Server Egg</h3>
                                <Select name={'egg'} onChange={(e) => setEgg(parseInt(e.target.value))} css={tw`bg-neutral-900/50 border-neutral-800 focus:border-blue-500/50 rounded-xl h-10 text-xs`}>
                                    {!egg && <option>Select an egg...</option>}
                                    {eggs.map((e) => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div css={tw`bg-blue-600/5 backdrop-blur-sm border border-blue-500/20 p-6 rounded-2xl flex flex-col lg:flex-row items-center justify-between mt-6`}>
                        <div css={tw`mb-4 lg:mb-0 text-center lg:text-left`}>
                            <h2 css={tw`text-xl font-black uppercase tracking-tighter text-neutral-100`}>Finalize Deployment</h2>
                            <p css={tw`text-neutral-500 text-xs font-medium`}>Ready to launch your high-performance instance?</p>
                        </div>
                        <div css={tw`w-full lg:w-auto`}>
                            <InputSpinner visible={loading}>
                                <Button
                                    type={'submit'}
                                    css={tw`w-full lg:px-12 bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:border-blue-500/60 font-black uppercase tracking-widest text-xs py-3 rounded-xl transition-all shadow-lg`}
                                    size={Button.Sizes.Large}
                                    disabled={loading}
                                >
                                    <Icon.Zap size={16} css={tw`mr-2`} /> Deploy Instance
                                </Button>
                            </InputSpinner>
                        </div>
                    </div>
                </Form>
            </Formik>
        </PageContentBlock>
    );
};
