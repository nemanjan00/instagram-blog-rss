const request = require("request");

module.exports = (app) => {
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

		request.post(url, options, function (error, response, body) {
			if(error){
				res.code(500);

				res.send("Error getting feed");
			}

			body = body.replace("for (;;);", "");

			body = JSON.parse(body);

			res.json(body);

			let posts = body.payload.cards;

			posts = posts.map((post) => {
				return post.__html;
			}).map((post) => {
				console.log(post.split("</div><div class=")[0]);

				//console.log(post);
			});

			//console.log(JSON.stringify(posts, null, 4));
		});
	});

	return router;
};
