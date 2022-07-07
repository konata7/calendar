import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1px;
  background-color: ${props => props.isHeader ? '#FFFFFF' : '#E5E4E6'};
  ${props => !props.isHeader && 'padding-top: 1px'};
  
`;
const DateWrapper = styled.div`
    height: 29px;
    width: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
`;
const CurrentDay = styled.div`
  height: 100%;
  width: 100%;
  background: red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

`;
const RowInCell = styled.div`
    display: flex;
    justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
    ${props => props.pr && `padding-right: ${props.pr * 8}px`}
`;
const CellWrapper = styled.div`
  min-width: 100px;
  min-height: ${props => props.isHeader ? 24 : 80}px;
  background-color: ${props => props.isWeekend ? '#F4F4F9' : '#FFFFFF'};
  color: ${props => props.isHeader ? '#131314'
                    :!props.isSelectedMonth ? '#c3c2c2' 
                    :props.isWeekend ? '#828083' : '#131314'}; 
`;

export const CalendarGrid = ({startDay, daysToDisplay}) => {
    const startDayOfView = startDay.clone().startOf('month').startOf('week');
    const dayPtr = startDayOfView.clone();
    const days = [...Array(daysToDisplay)].map(() => {
        let ret = dayPtr.clone();
        dayPtr.add(1, 'day');
        return ret;
    });

    const isCurrentDay = (dayPtr) => moment().isSame(dayPtr, 'day');
    const isSelectedMonth = (dayPtr) => startDay.isSame(dayPtr, 'month')

    return (
        <>
            <GridWrapper isHeader>
                {[...Array(7)].map((_,i)=> (
                    <CellWrapper isHeader key={moment().day(i + 1).unix()}>
                        <RowInCell justifyContent={'flex-end'} pr={1}>
                            {moment().day(i + 1).format('ddd')}
                        </RowInCell>
                    </CellWrapper>))}
            </GridWrapper>
            <GridWrapper>
                {
                    days.map((dayInstance) => (
                        <CellWrapper
                            key={dayInstance.unix()}
                            isWeekend={dayInstance.day() === 6 || dayInstance.day() === 0 }
                            isSelectedMonth={isSelectedMonth(dayInstance)}
                        >
                            <RowInCell
                                justifyContent={'flex-end'}
                            >
                                <DateWrapper>
                                    {!isCurrentDay(dayInstance)
                                        ? dayInstance.format('D')
                                        : <CurrentDay>{dayInstance.format('D')}</CurrentDay>
                                    }
                                </DateWrapper>
                            </RowInCell>
                        </CellWrapper>
                    ))
                }
            </GridWrapper>
        </>
    );
};
