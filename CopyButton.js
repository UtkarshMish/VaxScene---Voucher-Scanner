import ExpoClipboard from "expo-clipboard";
import React from "react";
import { View, Text, TouchableHighlight, ToastAndroid, StyleSheet } from "react-native";

export default function CopyButton({ voucher }) {
	const handleCopy = () => {
		ExpoClipboard.setString(voucher);
		ToastAndroid.show("voucher copied to clipboard!", ToastAndroid.SHORT);
	};
	return (
		<TouchableHighlight onPress={handleCopy} underlayColor={"rgb(0, 200, 81)"} style={styles.container}>
			<View>
				<Text style={styles.buttonTitle}>Copy</Text>
			</View>
		</TouchableHighlight>
	);
}
const styles = StyleSheet.create({
	container: {
		width: 80,
		backgroundColor: "rgb(236, 236, 236)",
		borderRadius: 20,
		top: 2,
		right: 2,
		height: 45,
		justifyContent: "center",
		zIndex: 1,
		flex: 1,
		alignSelf: "flex-end",
		position: "relative",
		borderColor: "hsla(258, 24%, 32%, 1)",
		borderWidth: 1,
	},
	buttonTitle: {
		fontSize: 17,
		fontWeight: "bold",
		textAlign: "center",
		width: "100%",
	},
});
