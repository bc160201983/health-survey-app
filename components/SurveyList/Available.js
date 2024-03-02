import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import SurveyItem from "../SurveyItem"; // Adjust the import path as necessary
import { surveysData } from "../../data";

const Available = ({ navigation }) => {
  // console.log(surveysData);

  const handlePress = (survey) => {
    // Navigation or action goes here
    navigation.navigate("StartScreen", {
      surveyId: survey.id,
      surveyTitle: survey.title,
      questions: survey.questions,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={surveysData}
        renderItem={({ item }) => (
          <SurveyItem survey={item} onPress={() => handlePress(item)} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Available;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
});
