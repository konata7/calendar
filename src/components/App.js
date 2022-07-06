import React from 'react';
import styled from 'styled-components'
import moment from 'moment'
import {HeaderBar} from "./HeaderBar";
import {StatusBar} from "./StatusBar";
import {CalendarGrid} from "./CalendarGrid";
import {useState} from "react";

const AppWrapper = styled.div`
      text-align: center;
      border-radius: 8px;
      border-top: 1px solid #F4F4F9;
      border-left: 1px solid #F4F4F9;
      border-right: 1px solid #F4F4F9;
      border-bottom: 1px solid #F4F4F9;
      overflow: hidden;
      box-shadow: 0 0 0 1px #1A1A1A, 0 8px 20px 6px #889;
    `


function App() {

    moment.updateLocale('en', {week: {dow: 1}});
    const [startDay, setStartDay] = useState(moment().startOf('month'));

    const prevMonthHandler = () => setStartDay(prev    => prev.clone().subtract(1, 'month'));
    const todayHandler = () => setStartDay(()    => moment());
    const nextMonthHandler = () => setStartDay(prev    => prev.clone().add(1, 'month'));

    window.moment = moment;
    return (
        <AppWrapper>
            <HeaderBar/>
            <StatusBar
                startDay={startDay}
                prevMonthHandler={prevMonthHandler}
                todayHandler={todayHandler}
                nextMonthHandler={nextMonthHandler}
            />
            <CalendarGrid startDay={startDay}/>
        </AppWrapper>
    );
}

export default App;
