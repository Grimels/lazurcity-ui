import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import { SideBar } from './components/SideBar';
import { ROUTES } from './routes';
import { store } from './store';

import './App.css';
import './styles/_reset.scss';
import { CalendarSection } from './components/CalendarSection';
import { DashboardSection } from './components/DashboardSection';
import { Login } from './components/Login';
import { FreeRoomsListSection } from './components/FreeRoomsListSection';
import { BusyRoomsListSection } from './components/BusyRoomsListSection';

store.subscribe(() => {
    console.log(store.getState());
})

function App() {
    const isLoggedInStored = !!localStorage.getItem('isLoggedIn');
    const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInStored);

    useEffect(() => {
        document.title = 'LazurCity';
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
    }

    if (!isLoggedIn) {
        return <Login onSuccess={handleLogin}/>
    }

    return (
        <div className="App">
            <Provider store={store}>
                <BrowserRouter>
                    <SideBar routes={ROUTES}/>

                    <Switch>
                        <Route exact path="/calendar" component={CalendarSection}/>
                        <Route exact path="/dashboard" component={DashboardSection}/>
                        <Route exact path="/rooms/free" component={FreeRoomsListSection}/>
                        <Route exact path="/rooms/busy" component={BusyRoomsListSection}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        </div>
    );
}

export default App;
