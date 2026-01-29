import tw from 'twin.macro';
import { format } from 'date-fns';
import useFlash from '@/plugins/useFlash';
import { useRouteMatch } from 'react-router';
import React, { useEffect, useState } from 'react';
import { Alert } from '@/components/elements/alert';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button';
import PageContentBlock from '@/components/elements/PageContentBlock';
import NewMessageDialog from '@/components/tickets/forms/NewMessageDialog';
import { Ticket, getTicket, getMessages, deleteTicket, TicketMessage } from '@/api/account/tickets';

const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
        pending: tw`bg-blue-500/10 text-blue-400 border-blue-500/30`,
        'in-progress': tw`bg-yellow-500/10 text-yellow-400 border-yellow-500/30`,
        unresolved: tw`bg-red-500/10 text-red-400 border-red-500/30`,
        resolved: tw`bg-green-500/10 text-green-400 border-green-500/30`,
        warning: tw`bg-yellow-500/10 text-yellow-400 border-yellow-500/30`,
    };

    return (
        <span
            css={[
                tw`text-[10px] font-bold py-1 px-2.5 rounded-md border`,
                (colors as any)[status] || tw`bg-neutral-800 text-neutral-400 border-neutral-700`,
            ]}
        >
            {status}
        </span>
    );
};

export default () => {
    const { clearFlashes } = useFlash();
    const match = useRouteMatch<{ id: string }>();
    const id = parseInt(match.params.id);

    const [visible, setVisible] = useState(false);
    const [ticket, setTicket] = useState<Ticket>();
    const [messages, setMessages] = useState<TicketMessage[]>();

    const doRedirect = () => {
        clearFlashes('tickets');

        // @ts-expect-error this is valid
        window.location = '/tickets';
    };

    const doRefresh = () => {
        clearFlashes('tickets');

        getTicket(id).then((data) => setTicket(data));
        getMessages(id).then((data) => setMessages(data));
    };

    const doDeletion = () => {
        clearFlashes('tickets');

        deleteTicket(id).then(() => doRedirect());
    };

    useEffect(() => {
        clearFlashes('tickets');

        doRefresh();
    }, []);

    if (!ticket) return <Spinner centered />;

    return (
        <PageContentBlock title={'View Ticket'} showFlashKey={'tickets'}>
            <NewMessageDialog open={visible} onClose={() => setVisible(false)} />

            <div className={'flex flex-wrap items-center justify-between gap-4 mt-6'}>
                <div className={'flex items-center gap-4'}>
                    <Button
                        css={tw`bg-neutral-800/50 text-neutral-300 border border-neutral-700 hover:bg-neutral-800/80 font-bold text-xs px-4 py-2 rounded-lg transition-all`}
                        onClick={doRedirect}
                    >
                        View All Tickets
                    </Button>
                    <StatusBadge status={ticket.status} />
                </div>
                <Button.Danger
                    css={tw`bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600/20 font-bold text-xs px-4 py-2 rounded-lg transition-all`}
                    onClick={doDeletion}
                >
                    Delete Ticket
                </Button.Danger>
            </div>

            <div
                css={tw`mt-10 p-8 rounded-2xl border border-neutral-700 bg-neutral-900/50 backdrop-blur-md relative overflow-hidden`}
            >
                <div css={tw`absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16`} />
                <h1 css={tw`text-2xl font-black text-neutral-100 mb-6 relative z-10`}>{ticket.title}</h1>
                <div css={tw`text-neutral-300 leading-relaxed relative z-10 whitespace-pre-wrap`}>{ticket.content}</div>
                {ticket.createdAt && (
                    <div css={tw`mt-8 pt-6 border-t border-neutral-700/50 text-right opacity-50`}>
                        <p css={tw`text-[10px] font-bold text-neutral-400`}>
                            Created on&nbsp;{format(ticket.createdAt, "MMM do 'at' h:mma")}
                        </p>
                    </div>
                )}
            </div>

            <div css={tw`mt-12 space-y-6`}>
                <h2 css={tw`text-sm font-bold text-neutral-400 px-4 mb-4`}>Conversation</h2>
                {!messages ? (
                    <div css={tw`p-8 text-center text-neutral-500 font-medium italic opacity-50`}>
                        Waiting for responses...
                    </div>
                ) : (
                    messages
                        .filter((m) => m.content !== ticket.content)
                        .map((message) => (
                            <div key={message.id}>
                                {message.userEmail === 'system' ? (
                                    <div
                                        css={tw`px-8 py-4 bg-neutral-800/30 rounded-xl border border-neutral-700/30 mx-auto max-w-2xl opacity-60 italic text-center text-neutral-400 text-sm`}
                                    >
                                        {message.content}
                                    </div>
                                ) : (
                                    <div
                                        css={tw`p-6 rounded-xl border border-neutral-700 bg-neutral-900/50 backdrop-blur-md`}
                                    >
                                        <div css={tw`flex items-center justify-between mb-4`}>
                                            <p css={tw`text-xs font-bold text-blue-400`}>
                                                Response from {message.userEmail}
                                            </p>
                                            {message.createdAt && (
                                                <p css={tw`text-[10px] font-bold text-neutral-500 opacity-50`}>
                                                    {format(message.createdAt, "MMM do 'at' h:mma")}
                                                </p>
                                            )}
                                        </div>
                                        <div css={tw`text-neutral-300 leading-relaxed whitespace-pre-wrap`}>
                                            {message.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                )}
            </div>

            <div className={'flex justify-center items-center mt-12'}>
                <Button
                    onClick={() => setVisible(true)}
                    css={tw`bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:border-blue-500/60 font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-lg`}
                >
                    Post a Reply
                </Button>
            </div>
        </PageContentBlock>
    );
};
