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
function findPurpose(element = String()) {
	let purpose = element.match(/voucher number for [a-z< ]{10}/gim);
	if (purpose && purpose.length == 1 && Array.isArray(purpose)) {
		purpose = purpose[0].replace("voucher number for ", "").trim();
	}
	return purpose;
}
function findPayerName(element = String()) {
	let payerName = element.match(/is created by [a-z<\/2 ]{20,53}>/gim);
	if (payerName && payerName.length == 1 && Array.isArray(payerName)) {
		payerName = payerName[0].replace("is created by ", "").trim();
	}
	return payerName;
}
function findPrice(elem = String()) {
	let price = elem.match(/INR [a-z<\/2 ]{0,10}>/gim);
	if (price && price.length == 1 && Array.isArray(price)) {
		price = price[0].replace("INR ", "").trim();
	}
	return price;
}

function findExpiry(elem = String()) {
	let expiry = elem.match(/valid up to[a-z<\/2 ]{0,15}>/gim);
	if (expiry && expiry.length == 1 && Array.isArray(expiry)) {
		expiry = expiry[0].replace("valid up to", "").trim();
	}
	return expiry;
}
function findTollFree(elem = String()) {
	let number = elem.match(/contact [a-z<\/0-9 ]{0,25}>/gim);
	if (number && number.length == 1 && Array.isArray(number)) {
		number = number[0].replace("contact", "").trim();
	}
	return number;
}
export function findItem(text = String()) {
	let matchedVoucher = text.match(/[a-z0-9]{35,36}/gim);
	const purpose = findPurpose(text);
	const payerName = findPayerName(text);
	const price = findPrice(text);
	const expiry = findExpiry(text);
	const number = findTollFree(text);
	if (matchedVoucher && Array.isArray(matchedVoucher)) {
		if (matchedVoucher.length == 1) {
			matchedVoucher = matchedVoucher[0];
		} else {
			matchedVoucher = matchedVoucher.reduce((prev, curr) => prev + "\n" + curr);
		}
	}
	return {
		voucher: matchedVoucher,
		purpose: purpose,
		payerName: payerName,
		price: price,
		expiry: expiry,
		number: number,
	};
}
