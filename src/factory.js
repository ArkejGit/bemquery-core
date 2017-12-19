'use strict';

import bse from 'bemquery-selector-engine';
import BEMQuery from './BEMQuery';

function factory( query, context = document ) {
	const selectorEngine = bse();
	const bemQuery = new BEMQuery( query, context, converter, selectorEngine );

	return bemQuery;
}

export default factory;