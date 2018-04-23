const request = require("request");
const parseString = require("xml2js").parseString;
const RSS = require("rss");

module.exports = () => {
	const router = require("express").Router();

	router.get("/", (req, res) => {
		const headers = {
			"accept-language": "en-US,en;q=0.9",
			"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36"
		};

		const form = {
			__user: 0,
			__a: 1
		};

		const options = {
			headers: headers,
			form: form
		};

		const url = "https://business.instagram.com/v2/business/async/blogcard/?number_to_load=30&fully_curated=false&request_uri=https%3A%2F%2Fbusiness.instagram.com%2Fblog%2F%3F&filter_cms_id=670018146504888&dpr=1";

		const feed = new RSS({
			title: "Instagram business blog"
		});

		request.post(url, options, function (error, response, body) {
			if(error){
				res.code(500);

				res.send("Error getting feed");
			}

			body = body.replace("for (;;);", "");

			body = JSON.parse(body);

			let posts = body.payload.cards;

			posts = posts.map((post) => {
				return post.__html;
			}).map((post) => {
				return new Promise((resolve, reject) => {
					parseString(post, function (err, result) {
						if(err){
							reject(err);
						}

						resolve(result);
					});
				});
			});

			Promise.all(posts).then((posts) => {
				posts.map((post) => {
					return post.div.div[0].a;
				}).map((post) => {
					const postData = {
						title: post[0].div[1].div[1]._,
						description: post[0].div[1].div[2].p[1]._,
						url: "https://business.instagram.com" + post[0].$.href,
						date: post[0].div[1].div[0].div[0].abbr[0].$["data-utime"]*1000
					};

					return postData;
				}).forEach((post) => {
					feed.item(post);
				});

				res.send(feed.xml());
			});
		});
	});

	return router;
};
