import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
`;
export const FlexRow = styled(Flex)`
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const FlexCol = styled(FlexRow)`
  flex: 0 1 0%;
  min-width: 2.5em;
`;
export const FlexColGrow = styled(FlexRow)`
  flex: 1 1 0%;
  justify-content: flex-start;
`;
export const FlexCols = styled(Flex)`
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
export const FillScreen = styled(FlexCols)`
  min-height: 90vh;
`;
