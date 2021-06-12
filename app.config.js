import "dotenv/config";
export default {
	name: "vaxScene",
	version: "1.0.0",
	extra: {
		API_KEY: process.env.API_KEY,
	},
	android: {
		package: "com.sample.vaxscene",
	},
};
