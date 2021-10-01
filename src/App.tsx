import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import { SideBar } from './components/SideBar';
import { ROUTES } from './routes';
import { store } from './store';

import './App.css';
import './styles/_reset.scss';
import { CalendarNavigation } from './components/CalendarNavigation';

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
						<Route exact path="/calendar" component={CalendarNavigation}/>
					</Switch>
				</BrowserRouter>
			</Provider>
		</div>
	);
}

export default App;
