import axios from "axios";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
	cropping: true,
	height: DEFAULT_HEIGHT,
	width: DEFAULT_WITH,
};

function findItem(text = String()) {
	const matched = text.match(/^[A-Z][a-z0-9]{30}/gm);
	if (matched && matched.length == 1) return matched[0];
	else return matched;
}
async function getData(data) {
	const headerElem = new FormData();
	headerElem.append("base64Image", "data:image/jpeg;base64," + data);
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
			apikey: String("46671404ef88957"),
			"Content-Type": "multipart/form-data",
		},
		data: headerElem,
		maxContentLength: Infinity,
		maxBodyLength: Infinity,
	};
	const {
		data: {
			ParsedResults: [{ ParsedText }],
		},
	} = await axios(request);
	// const result = await axios.post(
	// 	"https://api.ocr.space/parse/image",
	// 	{
	// 		apikey: String("46671404ef88957"),
	// 		base64Image: "data:image/jpeg;base64," + data,
	// 		language: String("eng"),
	// 		detectOrientation: String("false"),
	// 		isCreateSearchablePdf: String("false"),
	// 		isSearchablePdfHideTextLayer: String("false"),
	// 		scale: String("false"),
	// 		isTable: String("false"),
	// 		OCREngine: String("2"),
	// 	},
	// 	{
	// 		maxBodyLength: Infinity,
	//     maxContentLength: Infinity,
	// 		headers: {
	// 			apikey: String("46671404ef88957"),
	// 		},
	// 	}
	// );
	return ParsedText;
}

function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [imgSrc, setImgSrc] = useState(null);
	const [text, setText] = useState("");
	const [found, setFound] = useState(null);
	const recognizeTextFromImage = async (data) => {
		setIsLoading(true);

		try {
			const recognizedText = await getData(data);
			setText(recognizedText);
			setFound(findItem(recognizedText));
		} catch (err) {
			console.error(err);
			setText("");
		}

		setIsLoading(false);
		setProgress(0);
	};

	const recognizeFromPicker = async (options = defaultPickerOptions) => {
		try {
			const image = await ImagePicker.launchImageLibraryAsync(options);
			setImgSrc({ uri: image.base64 });
			await recognizeTextFromImage(image.base64);
		} catch (err) {
			if (err.message !== "User cancelled image selection") {
				console.error(err);
			}
		}
	};

	const recognizeFromCamera = async () => {
		try {
			if (!(await ImagePicker.getCameraPermissionsAsync())) {
				await ImagePicker.requestCameraPermissionsAsync();
			}
			const image = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.2, aspect: [720, 480] });
			setImgSrc({ uri: image.base64 });
			await recognizeTextFromImage(image.base64);
		} catch (err) {
			if (err.message !== "User cancelled image selection") {
				console.error(err);
			}
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>VaxScene OCR example App</Text>
			<Text style={styles.instructions}>Select an image source:</Text>
			<View style={styles.options}>
				<View style={styles.button}>
					<Button
						disabled={isLoading}
						title="Camera"
						onPress={async () => {
							await recognizeFromCamera();
						}}
					/>
				</View>
				<View style={styles.button}>
					<Button
						disabled={isLoading}
						title="Picker"
						onPress={async () => {
							await recognizeFromPicker();
						}}
					/>
				</View>
			</View>
			{imgSrc && (
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={imgSrc} />
					{isLoading ? <Text>{progress}</Text> : <Text>{text}</Text>}
					{found ? <Text style={{ color: "green", fontSize: 23 }}>FoundVoucher: {found}</Text> : null}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	options: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
	},
	button: {
		marginHorizontal: 10,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		marginVertical: 15,
		height: DEFAULT_HEIGHT / 2.5,
		width: DEFAULT_WITH / 2.5,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		margin: 10,
	},
	instructions: {
		textAlign: "center",
		color: "#333333",
		marginBottom: 5,
	},
});

export default App;
