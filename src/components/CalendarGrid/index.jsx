import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(100px, 1fr));
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
  cursor: pointer;
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
  min-height: ${props => props.isHeader ? 24 : 60}px;
  max-width: 200px;
  max-height: 120px;
  
  
  ${props => !props.isHeader && `aspect-ratio: 10 / 6;`}
  
  background-color: ${props => props.isWeekend ? '#F4F4F9' : '#FFFFFF'};
  color: ${props => props.isHeader ? '#131314'
          : !props.isSelectedMonth ? '#c3c2c2'
                  : props.isWeekend ? '#828083' : '#131314'};
`;
const EventBlockWrapper = styled.div`
  overflow-y: clip; 
`;
const EventWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
`;
// noinspection CssInvalidPropertyValue
const EventButton = styled.button`
  width: -webkit-fill-available;
  width: -moz-available;
  cursor: pointer;
  border: unset;
  background: inherit;
  font-size: 0.75em;
  height: 1.3em;
  margin-bottom: 1px;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #f2dff7;
`;
export const CalendarGrid = ({startDay, daysToDisplay, events, eventHandler}) => {
  const startDayOfView = startDay.clone().startOf('month').startOf('week');
  const dayPtr = startDayOfView.clone();
  const days = [...Array(daysToDisplay)].map(() => {
    let ret = dayPtr.clone();
    dayPtr.add(1, 'day');
    return ret;
  });

  const isCurrentDay = (dayPtr) => moment().isSame(dayPtr, 'day');
  const isSelectedMonth = (dayPtr) => startDay.isSame(dayPtr, 'month')

  let eventsArr = events.slice().sort((a, b) => a.datetime - b.datetime);
  let temp = [];
  return (
      <>
        <GridWrapper isHeader>
          {[...Array(7)].map((_, i) => (
              <CellWrapper isHeader key={moment().day(i + 1).unix()}>
                <RowInCell justifyContent={'flex-end'} pr={1}>
                  {moment().day(i + 1).format('ddd')}
                </RowInCell>
              </CellWrapper>))}
        </GridWrapper>
        <GridWrapper>
          {
            days.map((dayInstance, i) => (
                <CellWrapper
                    key={dayInstance.unix()}
                    isWeekend={dayInstance.day() === 6 || dayInstance.day() === 0}
                    isSelectedMonth={isSelectedMonth(dayInstance)}
                >
                  <RowInCell
                      justifyContent={'flex-end'}
                  >
                    <DateWrapper data-index={i} onDoubleClick={(e)=>{eventHandler('Create', e.clientX, e.clientY, e.target.dataset.index); console.log(e)}}>
                      {!isCurrentDay(dayInstance)
                          ? dayInstance.format('D')
                          : <CurrentDay>{dayInstance.format('D')}</CurrentDay>
                      }
                    </DateWrapper>
                  </RowInCell>
                  <EventBlockWrapper>
                    {
                      eventsArr.reduce((eventsToShow, event, i) => {
                        if (event.datetime >= dayInstance.clone().startOf('day').unix()
                            && event.datetime <= dayInstance.clone().endOf('day').unix()) {
                          eventsToShow.push(event)
                        } else {
                          temp.push(event)
                        }
                        if (i === eventsArr.length - 1) {
                          eventsArr = temp.slice();
                          temp = []
                        }

                        return eventsToShow;
                      }, []).map((event,i) =>
                          <RowInCell key={`${event.datetime}ev${i}`} justifyContent={'space-around'}>
                            <EventButton onDoubleClick={(e)=>{eventHandler('Update', e.clientX, e.clientY, undefined, event)}}>
                                <EventWrapper>{event.title}</EventWrapper>
                            </EventButton>
                          </RowInCell>)

                    }
                  </EventBlockWrapper>

                </CellWrapper>
            ))
          }
        </GridWrapper>
      </>
  );
};
