/* global chai, sinon, fixture */

'use strict';

import BEMQuery from '../src/BEMQuery';
import { SelectorEngine } from './support/mocks/bemquery-selector-engine';

const expect = chai.expect;

describe( 'BEMQuery', () => {
	before( () => {
		fixture.setBase( 'tests/support/fixtures' );
	} );

	afterEach( () => {
		fixture.cleanup();
	} );

	it ( 'is a class', () => {
		expect( BEMQuery ).to.be.a( 'function' );
	} );

	it( 'requires proper type of selector', () => {
		const selectorEngine = new SelectorEngine();

		expect( () => {
			new BEMQuery( undefined, null, selectorEngine );
		} ).to.throw( TypeError, 'Selector must be set' );

		expect( () => {
			new BEMQuery( 1, null, selectorEngine );
		} ).to.throw( TypeError, 'Selector must be a string, object, array or DOM element' );
	} );

	it ( 'requires proper type of SelectorEngine', () => {
		expect( () => {
			new BEMQuery( 'bogus', document, 1 );
		} ).to.throw( TypeError, 'SelectorEngine must be an object with find method defined' );

		expect( () => {
			new BEMQuery( 'bogus', document, {} );
		} ).to.throw( TypeError, 'SelectorEngine must be an object with find method defined' );
	} );

	it( 'creates elements property based on the first parameter', () => {
		fixture.load( 'elements.html' );

		SelectorEngine.elements = [
			'tutiturumtu'
		];

		const selectorEngine1 = new SelectorEngine();

		// Selector
		const bemQuery1 = new BEMQuery( 'bogus', document, selectorEngine1 );
		expect( bemQuery1.elements ).to.deep.equal( SelectorEngine.elements );

		// NodeList
		const elements = document.querySelectorAll( '.block' );
		const bemQuery2 = new BEMQuery( elements, document, selectorEngine1 );
		expect( bemQuery2.elements ).to.deep.equal( Array.from( elements ) );

		// BEMQuery instance
		SelectorEngine.elements = [];

		const bemQuery3 = new BEMQuery( bemQuery1, document, selectorEngine1 );
		expect( bemQuery3.elements ).to.deep.equal( bemQuery1.elements );
	} );

	it( 'changes context of searching based on second parameter', () => {
		fixture.load( 'elements.html' );

		const context1 = document.querySelector( '.block' );
		const context2 = document.querySelector( '.block__elem' );

		// Element as a context
		const selectorEngine1 = new SelectorEngine();
		const spy1 = sinon.spy( selectorEngine1, 'find' );

		new BEMQuery( 'bogus', context1, selectorEngine1 );

		expect( spy1 ).to.have.been.calledWith( 'bogus', context1 );

		// BEMQuery instance as a context
		SelectorEngine.elements = [
			context2,
			context1
		];

		const selectorEngine2 = new SelectorEngine();
		const spy2 = sinon.spy( selectorEngine2, 'find' );

		new BEMQuery( 'bogus', new BEMQuery( 'bogus', document, selectorEngine1 ), selectorEngine2 );

		expect( spy2 ).to.have.been.calledWith( 'bogus', context2 );

		// Fallback to document as a context
		new BEMQuery( 'bogus', null, selectorEngine1 );

		expect( spy1 ).to.have.been.calledWith( 'bogus', document );
	} );

	it( 'has iterator returning new BEMQuery instance', () => {
		fixture.load( 'elements.html' );

		let i = 0;
		const elements = document.querySelectorAll( '.block' );

		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( elements, document, selectorEngine );

		expect( bemQuery ).has.property( Symbol.iterator );

		for ( let element of bemQuery ) { // eslint-disable-line prefer-const
			expect( element ).to.be.instanceof( BEMQuery );

			expect( element.elements ).to.have.lengthOf( 1 );
			expect( element.elements[ 0 ] ).to.equal( elements[ i++ ] );
		}
	} );
} );
