import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import CopyButton from "./CopyButton";
const DEFAULT_HEIGHT = Dimensions.get("screen").height;
const DEFAULT_WIDTH = Dimensions.get("screen").width;
export default function Boxed({ voucher, purpose, payerName, price, expiry, number, ...rest }) {
	return (
		<View
			{...rest}
			style={{
				backgroundColor: "#01162715",
				padding: 5,
				borderRadius: 20,
				margin: 10,
				position: "relative",
				minHeight: 80,
				height: "auto",
				width: "92%",
			}}
		>
			<CopyButton voucher={voucher} />
			<View style={styles.container}>
				{voucher && (
					<View style={styles.textContainer}>
						<Text style={{ color: "black", fontSize: 20, marginRight: 50 }}>Voucher No:</Text>
						<Text style={styles.title}>{voucher}</Text>
					</View>
				)}
				{purpose && (
					<View style={styles.textContainer}>
						<Text style={styles.main}>
							purpose: <Text style={styles.title}>{purpose}</Text>
						</Text>
					</View>
				)}
				{payerName && (
					<View style={styles.textContainer}>
						<Text style={styles.main}>
							Payer Name: <Text style={styles.title}>{payerName}</Text>
						</Text>
					</View>
				)}
				{price && (
					<View style={styles.textContainer}>
						<Text style={styles.main}>
							price: <Text style={styles.title}>{price}</Text>
						</Text>
					</View>
				)}
				{expiry && (
					<View style={styles.textContainer}>
						<Text style={styles.main}>
							expiry: <Text style={styles.title}>{expiry}</Text>
						</Text>
					</View>
				)}
				{number && (
					<View style={styles.textContainer}>
						<Text style={styles.main}>
							number: <Text style={styles.title}>{number}</Text>
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	textContainer: {
		flex: 1,
		display: "flex",
		flexWrap: "wrap",
		flexDirection: "row",
	},
	container: {
		flex: 1,
		display: "flex",
		justifyContent: "center",
		alignSelf: "center",
		textAlign: "center",
	},
	main: { color: "black", fontSize: 16, fontFamily: "sans-serif" },
	title: {
		color: "green",
		fontWeight: "bold",
		width: "100%",
		fontSize: 17,
		flexWrap: "wrap",
		display: "flex",
		height: "100%",
		overflow: "visible",
	},
});
