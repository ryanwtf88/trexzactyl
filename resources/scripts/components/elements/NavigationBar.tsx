import React, { useState } from 'react';
import tw from 'twin.macro';
import http from '@/api/http';
import * as Icon from 'react-feather';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import { NavLink, Link } from 'react-router-dom';
import ProgressBar from '@/components/elements/ProgressBar';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import SearchContainer from '@/components/dashboard/search/SearchContainer';

const Nav = styled.nav`
    ${tw`fixed top-0 left-0 right-0 z-50 bg-neutral-900/40 backdrop-blur-xl border-b border-white/5`};
`;

const NavContent = styled.div`
    ${tw`max-w-[1200px] mx-auto h-16 flex items-center justify-between px-4 sm:px-6`};
`;

const NavLinks = styled.div`
    ${tw`hidden md:flex items-center space-x-1 h-full ml-8`};

    & > a {
        ${tw`inline-block py-3 px-4 text-neutral-400 no-underline whitespace-nowrap transition-all duration-300 font-bold text-xs`};

        &.active {
            ${tw`text-blue-400`};
            &::after {
                content: '';
                ${tw`absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]`};
            }
        }
    }
`;

const RightNav = styled.div`
    ${tw`flex items-center space-x-3`};
`;

const ActionButton = styled.div`
    ${tw`bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-all duration-300 cursor-pointer text-neutral-400 hover:text-neutral-100 border border-transparent hover:border-white/5 flex items-center justify-center`};
`;

export default () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const logo = useStoreState((state) => state.settings.data?.logo);
    const tickets = useStoreState((state) => state.settings.data?.tickets);
    const store = useStoreState((state) => state.storefront.data?.enabled);
    const rootAdmin = useStoreState((state) => state.user.data?.rootAdmin);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <Nav>
            <ProgressBar />
            <SpinnerOverlay visible={isLoggingOut} />
            <NavContent>
                <div css={tw`flex items-center h-full`}>
                    <Link
                        to={'/'}
                        className={'group'}
                        css={tw`flex items-center transition-transform duration-300 hover:scale-105`}
                    >
                        <img
                            className={'h-8 sm:h-9 w-auto'}
                            src={logo ?? 'https://avatars.githubusercontent.com/u/91636558'}
                            alt={'Logo'}
                        />
                    </Link>

                    <NavLinks>
                        <NavLink to={'/'} exact>
                            SERVERS
                        </NavLink>
                        <NavLink to={'/account'}>ACCOUNT</NavLink>
                        {store && <NavLink to={'/store'}>STORE</NavLink>}
                        {tickets && <NavLink to={'/tickets'}>TICKETS</NavLink>}
                        {rootAdmin && <a href={'/admin'}>ADMIN</a>}
                    </NavLinks>
                </div>

                <RightNav>
                    <ActionButton>
                        <SearchContainer size={18} />
                    </ActionButton>

                    <button onClick={onTriggerLogout} css={tw`focus:outline-none mr-2 sm:mr-0`}>
                        <Tooltip placement={'bottom'} content={'Logout'}>
                            <ActionButton css={tw`text-red-400/80 hover:text-red-400`}>
                                <Icon.LogOut size={18} />
                            </ActionButton>
                        </Tooltip>
                    </button>

                    {/* Mobile Navigation Icons */}
                    <div css={tw`md:hidden flex items-center space-x-1 border-l border-white/5 pl-2 ml-1`}>
                        <NavLink to={'/'} exact css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                            <Icon.Server size={18} />
                        </NavLink>
                        <NavLink to={'/account'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                            <Icon.User size={18} />
                        </NavLink>
                        {store && (
                            <NavLink to={'/store'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                                <Icon.ShoppingCart size={18} />
                            </NavLink>
                        )}
                        {tickets && (
                            <NavLink to={'/tickets'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                                <Icon.MessageSquare size={18} />
                            </NavLink>
                        )}
                        {rootAdmin && (
                            <a href={'/admin'} css={tw`text-neutral-400 hover:text-neutral-100 p-2`}>
                                <Icon.Settings size={18} />
                            </a>
                        )}
                    </div>
                </RightNav>
            </NavContent>
        </Nav>
    );
};
