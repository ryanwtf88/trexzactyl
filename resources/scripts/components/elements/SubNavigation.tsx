import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';

const SubNavigation = styled.div`
    ${tw`bg-neutral-900 bg-opacity-40 backdrop-blur-xl border-b border-white/5 overflow-x-auto mb-4 sm:mb-10 w-full`};

    & > div {
        ${tw`flex text-sm mx-auto px-2 max-w-7xl`};

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 text-neutral-400 no-underline whitespace-nowrap transition-all duration-300 font-bold text-xs`};

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                ${tw`text-neutral-100`};
            }

            &:active,
            &.active {
                ${tw`text-blue-400`};
                box-shadow: inset 0 -2px ${theme`colors.blue.500`.toString()};
            }
        }
    }
`;

export default SubNavigation;
