import React, {useEffect} from 'react';
import styled from 'styled-components'
import moment from 'moment'
import {HeaderBar} from "../HeaderBar";
import {StatusBar} from "../StatusBar";
import {CalendarGrid} from "../CalendarGrid";
import {useState} from "react";

const AppWrapper = styled.div`
  text-align: center;
  border-top: 1px solid #F4F4F9;
  border-left: 1px solid #F4F4F9;
  border-right: 1px solid #F4F4F9;
  border-bottom: 1px solid #F4F4F9;
  overflow: hidden;
  width: 100%;
  max-height: 1080px;
  max-width: 1406px;
`;
const EventFormBgWrapper = styled.div`
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.25);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const EventFormWrapper = styled(AppWrapper)`
  background-color: lightgrey;
  color: black;
  width: min-content;
  min-width: 20vw;
  max-width: 50vw;
  position: fixed;
  top: ${props => props.cursorPos.y}px;
  left: ${props => props.cursorPos.x}px;
  border-radius: .2vw;
`;
const EventInput = styled.textarea`
  padding: 8px 14px;
  font-size: .85rem;
  width: 100%;
  outline: unset;
  border: unset;
  border-bottom: 1px solid lightgrey;
  resize: none;
  height: 60px;
`;
const ButtonsWrapper = styled.div`
  padding: 8px 14px;
  display: flex;
  justify-content: flex-end;
`;
const dbUrl = 'http://localhost:3001'
const daysToDisplay = 42
const defaultEvent = {
  title: '',
  description: '',
  datetime: moment().unix()
}

function App() {

  moment.updateLocale('en', {week: {dow: 1}});
  const [startDay, setStartDay] = useState(moment().startOf('month'));

  const prevMonthHandler = () => setStartDay(prev => prev.clone().subtract(1, 'month'));
  const todayHandler = () => setStartDay(() => moment());
  const nextMonthHandler = () => setStartDay(prev => prev.clone().add(1, 'month'));

  window.moment = moment;
  const firstDisplayedDay = startDay.clone().startOf('week');
  const lastDisplayedDay = firstDisplayedDay.clone().add(daysToDisplay - 1, 'days');

  const [event, setEvent] = useState(null);
  const [method, setMethod] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({x: 0, y: 0});

  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch(`${dbUrl}/events?datetime_gte=${firstDisplayedDay.unix()}&datetime_lte=${lastDisplayedDay.unix()}`)
        .then(resp => resp.json())
        .then(resp => {
          console.log('responce: ', resp, lastDisplayedDay, firstDisplayedDay);
          setEvents(resp);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDay]);

  const eventHandler = (methodName, cursorX, cursorY, targetDay, eventToUpdate) => {
    setCursorPos({x: cursorX, y: cursorY});
    setFormVisible(true);

    if (eventToUpdate) {
      setEvent(eventToUpdate);
    } else {
      let newEvent = defaultEvent;
      newEvent.datetime = startDay.clone().day(parseInt(targetDay) + 1).unix();
      setEvent(newEvent);
    }
    setMethod(methodName);
  }
  const cancelButtonHandler = () => {
    setFormVisible(false);
    setEvent(undefined);
  }
  const changeEventHandler = (text, field) => {
    setEvent(prevState => ({
      ...prevState,
      [field]: text
    }))
  }
  const eventFetchHandler = () => {
    const fetchUrl = method === 'Update' ? `${dbUrl}/events/${event.id}` : `${dbUrl}/events`;
    const httpMethod = method === 'Update' ? 'PATCH' : 'POST';
    console.log(fetchUrl, method)

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }).then(res => res.json()).then(res => {
      console.log(res);
      if (method === 'Update') {
        setEvents(prevState => prevState.map(eventEl => eventEl.id === res.id ? res : eventEl));
      } else {
        setEvents(prevState => [...prevState, res]);
      }
    cancelButtonHandler();
    });
  }
  const eventRemoveHandler = () => {
    const fetchUrl =  `${dbUrl}/events/${event.id}`;
    const httpMethod = 'DELETE';

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(res => {
      console.log(res);
      setEvents(prevState => prevState.filter(eventEl => eventEl.id !== event.id));
      cancelButtonHandler();
    });
  }
  return (
      <>
        {
          isFormVisible ? (
              <EventFormBgWrapper onClick={() => {setFormVisible(false)}}>
                <EventFormWrapper onClick={(e) => {e.stopPropagation()}} cursorPos={cursorPos}>
                  <EventInput
                      value={event.title}
                      onChange={(e) => changeEventHandler(e.target.value, 'title')}
                      placeholder='Title'
                  />
                  <EventInput
                      value={event.description}
                      onChange={(e) => changeEventHandler(e.target.value, 'description')}
                      placeholder='Description'
                  />
                  <ButtonsWrapper>
                    <button onClick={cancelButtonHandler}>Cancel</button>
                    <button onClick={eventFetchHandler}>{method}</button>
                    {method === 'Update' ? (<button onClick={eventRemoveHandler}>Remove</button>) : null}
                  </ButtonsWrapper>
                </EventFormWrapper>
              </EventFormBgWrapper>
          ) : null
        }
        <AppWrapper>
          <HeaderBar/>
          <StatusBar
              startDay={startDay}
              prevMonthHandler={prevMonthHandler}
              todayHandler={todayHandler}
              nextMonthHandler={nextMonthHandler}
          />
          <CalendarGrid startDay={startDay} daysToDisplay={daysToDisplay} events={events} eventHandler={eventHandler}/>
        </AppWrapper>
      </>
  );
}

export default App;
