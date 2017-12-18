'use strict';

function checkSelectorEngine( selectorEngine ) {
	return typeof selectorEngine === 'object' && typeof selectorEngine.find === 'function';
}

function determineContext( context ) {
	if ( context instanceof BEMQuery ) { // eslint-disable-line no-use-before-define
		context = context.elements[ 0 ];
	}

	if ( !( context instanceof HTMLElement ) && context !== document ) {
		context = document;
	}

	return context;
}

function fetchElements( query, context, selectorEngine ) {
	if ( !query ) {
		throw new TypeError( 'Selector must be set.' );
	}

	if ( typeof query === 'string' ) {
		return selectorEngine.find( query, context ).elements;
	} else if ( query instanceof HTMLElement ) {
		return [
			query
		];
	} else if ( query instanceof BEMQuery ) { // eslint-disable-line no-use-before-define
		return query.elements;
	} else if ( typeof query === 'object' ) {
		return Array.from( query );
	} else {
		throw new TypeError( 'Selector must be a string, object, array or DOM element.' );
	}
}

class BEMQuery {
	constructor( query, context, selectorEngine ) {
		if ( !checkSelectorEngine( selectorEngine ) ) {
			throw new TypeError( 'SelectorEngine must be an object with find method defined.' );
		}

		this.selectorEngine = selectorEngine;

		context = determineContext( context );

		this.elements = fetchElements( query, context, selectorEngine );
	}

	get() {}

	each() {}

	[ Symbol.iterator ]() {
		let i = 0;
		const elements = this.elements;
		const selectorEngine = this.selectorEngine;

		return {
			next() {
				if ( i < elements.length ) {
					const element = elements[ i++ ];

					return {
						value: new BEMQuery( [ element ], document, selectorEngine ),
						done: false
					};
				}

				return {
					done: true
				};
			}
		};
	}
}

export default BEMQuery;
