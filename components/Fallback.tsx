import { View, Text, StyleSheet } from "react-native";

const Fallback = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>加载中...</Text>
    </View>
  );
};

export default Fallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
