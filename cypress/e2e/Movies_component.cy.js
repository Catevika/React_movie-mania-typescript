import * as HomePage from '../page-objects/home-page';
import {
	closeVideoModal,
	getFirstMovieDetails,
	getMovieDetails,
	getNoMovieMessage,
	getNotAvailable,
	openVideoModal
} from '../page-objects/movies_component';

describe('Movies page spec', () => {
	beforeEach(() => {
		HomePage.navigateHome();
	});

	it('navigate to MovieDetails page', () => {
		HomePage.search('Top Gun');
		getFirstMovieDetails();
	});

	it('show message when no MovieDetails data', () => {
		HomePage.search('sdfg');
		getNoMovieMessage();
		HomePage.clear();
		HomePage.search('Atmos Redbull F1');
		getMovieDetails();
		HomePage.hasMainTitle(/Atmos Redbull F1/i);
		getNotAvailable(10);
	});

	it('open & close Video Modal', () => {
		HomePage.search('Top Gun');
		getFirstMovieDetails();
		openVideoModal();
		closeVideoModal();
	});
});
