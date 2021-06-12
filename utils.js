import axios from "axios";
import { Constants } from "react-native-unimodules";

export async function getData(base64Image) {
	const headerElem = new FormData();
	headerElem.append("base64Image", "data:image/jpeg;base64," + base64Image);
	headerElem.append("language", String("eng"));
	headerElem.append("detectOrientation", String("false"));
	headerElem.append("isCreateSearchablePdf", String("false"));
	headerElem.append("isSearchablePdfHideTextLayer", String("false"));
	headerElem.append("scale", String("false"));
	headerElem.append("isTable", String("false"));
	headerElem.append("OCREngine", String("2"));
	const request = {
		method: "POST",
		url: String("https://api.ocr.space/parse/image"),
		headers: {
			apikey: String(Constants.manifest.extra.API_KEY),
			"Content-Type": "multipart/form-data",
		},
		data: headerElem,
		maxContentLength: Infinity,
		maxBodyLength: Infinity,
	};
	const { data } = await axios(request);
	try {
		const {
			ParsedResults: [{ ParsedText }],
		} = data;
		return ParsedText;
	} catch {
		return data;
	}
}
export function findItem(text = String()) {
	const matched = text.match(/[A-Z][a-z0-9]{30}/gm);
	if (matched && Array.isArray(matched)) {
		if (matched.length == 1) return matched[0];
		else return matched.reduce((prev, curr) => prev + "\n" + curr);
	}
	return matched;
}
