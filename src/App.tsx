import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import { SideBar } from './components/SideBar';
import { ROUTES } from './routes';
import { store } from './store';

import './App.css';
import './styles/_reset.scss';
import { CalendarSection } from './components/CalendarSection';
import { DashboardSection } from './components/DashboardSection';

store.subscribe(() => {
	console.log(store.getState());
})

function App() {
	return (
		<div className="App">
			<Provider store={store}>
				<BrowserRouter>
					<SideBar routes={ROUTES}/>
					
					<Switch>
						<Route exact path="/calendar" component={CalendarSection}/>
						<Route exact path="/dashboard" component={DashboardSection}/>
					</Switch>
				</BrowserRouter>
			</Provider>
		</div>
	);
}

export default App;
