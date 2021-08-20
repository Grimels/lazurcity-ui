import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { Route } from '../../routes';
import { useLanguage } from '../../hooks/useLanguage';

import { SEASON } from './constants';

import './SideBar.scss';

interface SideBarProps {
	routes: Route[],
}

export const SideBar: React.FC<SideBarProps> = ({ routes }) => {
	const { language } = useLanguage();
	
	const renderRoutes = () => routes.map(({ path, label, Icon }) => (
		<NavLink
			key={path}
			className="side-bar-navigation-item"
			to={path}
		>
			<Icon className="navigation-item-icon" />
			<span className="navigation-item-label">{label.get(language)}</span>
		</NavLink>
	));
	
	return (
		<aside className="side-bar">
			<div className="season-logo">
				<h2>{SEASON.get(language)}</h2>
			</div>
			<nav className="side-bar-navigation">
				{renderRoutes()}
			</nav>
		</aside>
	)
	
}