import React, { useState } from "react";
import { Button, StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { findItem, getData } from "./utils";
import Boxed from "./Boxed";
const DEFAULT_HEIGHT = Dimensions.get("screen").height;
const DEFAULT_WITH = Dimensions.get("screen").width;
const PADDING_TOP = Dimensions.get("screen").fontScale;

function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [imgSrc, setImgSrc] = useState(null);
	const [text, setText] = useState("");
	const [found, setFound] = useState({
		voucher: null,
		purpose: null,
		payerName: null,
		price: null,
		expiry: null,
		number: null,
	});
	const recognizeTextFromImage = async (data) => {
		setIsLoading(true);

		try {
			const recognizedText = await getData(data);
			setText(recognizedText);
			const items = findItem(recognizedText);
			console.log(items);
			setFound(items);
		} catch (err) {
			console.log(err);
			setText("Error: Unable to Process");
		}

		setIsLoading(false);
	};

	const recognizeFromPicker = async (options) => {
		try {
			const image = await ImagePicker.launchImageLibraryAsync(options);
			setImgSrc({ uri: image.uri });
			await recognizeTextFromImage(image.base64);
		} catch (err) {
			if (err.message !== "User cancelled image selection") {
				console.error(err);
			}
		}
	};

	const recognizeFromCamera = async (options) => {
		try {
			if (!(await ImagePicker.getCameraPermissionsAsync())) {
				await ImagePicker.requestCameraPermissionsAsync();
			}
			const image = await ImagePicker.launchCameraAsync(options);
			setImgSrc({ uri: image.uri });
			await recognizeTextFromImage(image.base64);
		} catch (err) {
			if (err.message !== "User cancelled image selection") {
				console.error(err);
			}
		}
	};
	const photoOptions = { base64: true, quality: 0.15, aspect: [1920, 1080] };
	const { voucher, expiry, number, payerName, price, purpose } = found;
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
							await recognizeFromCamera(photoOptions);
						}}
					/>
				</View>
				<View style={styles.button}>
					<Button
						disabled={isLoading}
						title="Picker"
						onPress={async () => {
							await recognizeFromPicker(photoOptions);
						}}
					/>
				</View>
			</View>
			{imgSrc && (
				<ScrollView style={styles.imageContainer} contentContainerStyle={styles.scroller}>
					<Image style={styles.image} source={imgSrc} />
					{isLoading && <ActivityIndicator size="small" color="navy" />}
					{typeof found !== "string" && !isLoading && (voucher || purpose || payerName || price || expiry || number) ? (
						<Boxed voucher={voucher} purpose={purpose} payerName={payerName} price={price} expiry={expiry} number={number} />
					) : null}
					{typeof found == "string" && !isLoading && <Text>{found}</Text>}
					{!isLoading && <Text style={styles.lowText}>{text}</Text>}
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: PADDING_TOP + 25,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	scroller: {
		padding: 5,
		paddingBottom: 20,
		width: DEFAULT_WITH,
	},
	options: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
	},
	button: {
		marginHorizontal: 10,
		width: 100,
	},
	imageContainer: {
		padding: 5,
	},
	image: {
		marginVertical: 15,
		alignSelf: "center",
		height: DEFAULT_HEIGHT / 2,
		width: DEFAULT_WITH / 1.25,
		borderRadius: 20,
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
	lowText: {
		marginTop: 15,
		paddingTop: 10,
	},
});

export default App;
