// StartScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const StartScreen = ({ navigation, route }) => {
  const { surveyId, surveyTitle, questions } = route.params;

  const handleStartSurvey = () => {
    // Navigate to the Survey component, passing the necessary survey data
    navigation.navigate("Survey", { surveyId, surveyTitle, questions });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to {surveyTitle}</Text>
      <Text style={styles.description}>
        This survey aims to gather information about your habits and
        preferences. It will take approximately 5-10 minutes to complete.
      </Text>
      <Button title="Start Survey" onPress={handleStartSurvey} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
});

export default StartScreen;
