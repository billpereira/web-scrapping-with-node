// * Our Draft sample:
// const sample = {
//     title: 'Bird Box ',
//     rank: 1,
//     imdbRating: 6.7,
//     descriptionUrl : 'https://www.imdb.com/title/tt2737304/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=ea4e08e1-c8a3-47b5-ac3a-75026647c16e&pf_rd_r=QH7MAXFYPP3F823PW1X6&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=moviemeter&ref_=chtmvm_tt_1',
//     posterUrl: 'https://www.imdb.com/title/tt2737304/mediaviewer/rm1969058304'
// }

const cheerio = require('cheerio');
const request = require('request-promise');

mainUrl = 'https://www.imdb.com/chart/moviemeter?ref_=nv_mv_mpm';

async function scrapeTitleRanksAndRatings() {
	const result = await request.get(mainUrl);
	const $ = await cheerio.load(result);

	const movies = $('tr')
		.map((i, element) => {
			const title = $(element)
				.find('td.titleColumn > a')
				.text();
			const descriptionUrl =
				'https://www.imdb.com' +
				$(element)
					.find('td.titleColumn > a')
					.attr('href');
			const imdbRating = $(element)
				.find('td.ratingColumn.imdbRating')
				.text()
				.trim();
			return { title, imdbRating, rank: i, descriptionUrl };
		})
		.get();

	return movies;
}

async function scrapePosterUrl(movies) {
	const moviesWithPosterUrls = await Promise.all(
		movies.map(async movie => {
			try {
				const html = await request.get(movie.descriptionUrl);
				const $ = await cheerio.load(html);
				movie.posterUrl =
					'https://www.imdb.com' + $('div.poster > a').attr('href');
				return movie;
			} catch (err) {
				// console.error(err);
			}
		})
	);
	return moviesWithPosterUrls;
}

async function main() {
	let movies = await scrapeTitleRanksAndRatings();
	movies = await scrapePosterUrl(movies);
	console.log(movies);
}

main();
