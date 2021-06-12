import React, { useState } from "react";
import { Button, StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { findItem, getData } from "./utils";

const DEFAULT_HEIGHT = Dimensions.get("screen").height;
const DEFAULT_WITH = Dimensions.get("screen").width;
const PADDING_TOP = Dimensions.get("screen").fontScale;

function App() {
	const [isLoading, setIsLoading] = useState(false);
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
	const photoOptions = { base64: true, quality: 0.2, aspect: [720, 480] };
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
					{found && !isLoading ? <Text style={{ color: "green", fontSize: 23 }}>FoundVoucher: {found}</Text> : null}
					{isLoading ? <ActivityIndicator size="small" color="navy" /> : <Text>{text}</Text>}
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
		alignItems: "center",
		justifyContent: "center",
		padding: 5,
		paddingBottom: 20,
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
		padding: 5,
	},
	image: {
		marginVertical: 15,
		height: DEFAULT_HEIGHT / 2,
		width: DEFAULT_WITH / 2,
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
