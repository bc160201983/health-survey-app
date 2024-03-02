import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";

// Import RadioButton and Checkbox components
import RadioButton from "../components/RadioButton";
import Checkbox from "../components/Checkbox";

const Survey = ({ route, navigation }) => {
  const { questions, surveyTitle } = route.params; // Use title from route.params
  console.log(surveyTitle);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (questionId, option) => {
    const updatedAnswers = answers.filter(
      (answer) => answer.questionId !== questionId
    );
    updatedAnswers.push({ questionId, answer: option });
    setAnswers(updatedAnswers);

    // Move to the next question automatically for single-choice questions
    if (questions[currentQuestionIndex].type !== "multiple_choice") {
      handleNextQuestion();
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{question.question}</Text>
        {/* Display question title */}
        <Text style={styles.descriptionText}>{question.description}</Text>
        {question.type === "true_false" ? (
          <RadioButton
            options={question.options}
            selectedOption={
              answers.find((a) => a.questionId === question.id)?.answer
            }
            onSelect={(option) => handleAnswer(question.id, option)}
          />
        ) : question.type === "multiple_choice" ? (
          <Checkbox
            options={question.options}
            selectedOptions={
              answers.find((a) => a.questionId === question.id)?.answer || []
            }
            onSelect={(options) => handleAnswer(question.id, options)}
          />
        ) : (
          <Text>Unsupported question type.</Text>
        )}
      </View>
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Survey Completed", answers);
      navigation.navigate("FinishScreen");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderProgressBar = () => {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.surveyTitle}>{surveyTitle}</Text>

      {/* Corrected to use title from route.params */}
      {renderProgressBar()}
      {questions && questions.length > 0 && renderQuestion()}
      <View style={styles.buttonContainer}>
        {currentQuestionIndex > 0 && (
          <Button title="Back" onPress={handlePreviousQuestion} />
        )}
        <Button
          title={
            currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"
          }
          onPress={handleNextQuestion}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  surveyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Adjusted for spacing
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default Survey;
