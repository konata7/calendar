import React from 'react';
import styled from 'styled-components'

const StatusBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #FFFFFF;
  color: black;
  padding: 16px;
`

const TextWrapper = styled.span`
  font-size: 32px;
  
`

const TitleWrapper = styled(TextWrapper)`
  font-weight: bold;
  margin-right: 8px;
`

const ButtonBlockWrapper = styled.div`
  display: flex;
  align-items: center;
`

const NavButton = styled.button`
  border: unset;
  background-color: #F4F4F9;
  height: 20px;
  margin-right: 2px;
  border-radius: 4px;
  color: black;
  outline: unset;
  cursor: pointer;
`
const TodayButton = styled(NavButton)`
  padding-right: 16px;
  padding-left: 16px;
  font-weight: bold;
`

export const StatusBar = ({startDay,prevMonthHandler,todayHandler,nextMonthHandler}) => {

    return (
        <StatusBarWrapper>
            <div>
                <TitleWrapper>{startDay.format('MMMM')}</TitleWrapper>
                <TextWrapper>{startDay.format('YYYY')}</TextWrapper>
            </div>
            <ButtonBlockWrapper>
                <NavButton onClick={prevMonthHandler}>&lt;</NavButton>
                <TodayButton onClick={todayHandler}>Today</TodayButton>
                <NavButton onClick={nextMonthHandler}>&gt;</NavButton>
            </ButtonBlockWrapper>
        </StatusBarWrapper>
    );
};