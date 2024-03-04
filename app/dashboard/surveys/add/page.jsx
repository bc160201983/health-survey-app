"use client";
import React, { useState } from "react";
import styles from "@/app/ui/dashboard/surveys/AddSurvey/AddSurvey.module.css";
import db from "@/app/lib/firebase";
import { collection, addDoc, doc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AddSurveyPage = () => {
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    status: "available",
    questions: [],
  });

  const router = useRouter();

  const addQuestion = () => {
    const newQuestions = [
      ...survey.questions,
      { question: "", type: "multiple_choice", options: [{ text: "" }] },
    ];
    setSurvey({ ...survey, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = survey.questions.filter((_, idx) => idx !== index);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = survey.questions.map((question, idx) => {
      if (idx === questionIndex) {
        return { ...question, options: [...question.options, { text: "" }] };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = survey.questions.map((question, idx) => {
      if (idx === questionIndex) {
        const updatedOptions = question.options.filter(
          (_, optIdx) => optIdx !== optionIndex
        );
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = survey.questions.map((question, idx) => {
      if (idx === index) {
        return { ...question, [event.target.name]: event.target.value };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const updatedQuestions = survey.questions.map((question, qIdx) => {
      if (qIdx === questionIndex) {
        const updatedOptions = question.options.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            return { ...option, text: event.target.value };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setSurvey({ ...survey, questions: updatedQuestions });
  };
  const handleSurveyChange = (event) => {
    const { name, value } = event.target;
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const batch = writeBatch(db);
      const surveyRef = await addDoc(collection(db, "Surveys"), {
        title: survey.title,
        description: survey.description,
        status: survey.status,
        start_tiome: new Date(),
        end_time: new Date(),
        createdAt: new Date(),
        isActive: true,
      });

      survey.questions.forEach((question) => {
        const questionRef = doc(
          collection(db, `Surveys/${surveyRef.id}/Questions`)
        );
        batch.set(questionRef, {
          ...question,
          options: question.options.map((option) => option.text),
        });
      });

      await batch.commit();
      console.log("Survey and questions saved successfully");
      router.push("/dashboard/surveys");
      // Optionally reset the survey state or navigate the user to a different page
    } catch (error) {
      console.error("Error saving survey: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Survey Title & Description Inputs remain unchanged */}
        <input
          type="text"
          placeholder="Survey Title"
          name="title"
          required
          value={survey.title}
          onChange={handleSurveyChange}
          className={styles.input}
        />
        <textarea
          required
          name="description"
          rows="4"
          placeholder="Survey Description"
          value={survey.description}
          onChange={handleSurveyChange}
          className={styles.textarea}
        ></textarea>
        {survey.questions.map((question, index) => (
          <div key={index} className={styles.questionContainer}>
            {/* Question Text Input */}
            <input
              type="text"
              placeholder="Question"
              name="question"
              value={question.question}
              onChange={(event) => handleQuestionChange(index, event)}
              className={styles.input}
            />
            {/* Question Type Selector */}
            <select
              name="type"
              value={question.type}
              onChange={(event) => handleQuestionChange(index, event)}
              className={styles.select}
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="text">Text</option>
            </select>
            {/* Options for "Multiple Choice" */}
            {question.type === "multiple_choice" && (
              <>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.optionContainer}>
                    <input
                      type="text"
                      placeholder="Option"
                      value={option.text}
                      onChange={(event) =>
                        handleOptionChange(index, optionIndex, event)
                      }
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index, optionIndex)}
                      className={styles.button}
                    >
                      Remove Option
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(index)}
                  className={styles.button}
                >
                  Add Option
                </button>
              </>
            )}
            {/* Remove Question Button */}
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className={styles.button}
            >
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className={styles.button}>
          Add Question
        </button>
        <button type="submit" className={styles.submitButton}>
          Submit Survey
        </button>
      </form>
    </div>
  );
};

export default AddSurveyPage;
