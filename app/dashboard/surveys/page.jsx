"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/ui/dashboard/products/products.module.css";
import db from "../../lib/firebase"; // Ensure this path points to your Firebase config file
import { collection, getDocs, query } from "firebase/firestore";

const SurveyPage = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const querySnapshot = await getDocs(collection(db, "Surveys"));
      const surveysArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toDateString(), // Handle dates appropriately
      }));
      setSurveys(surveysArray);
    };

    fetchSurveys();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Link href="/dashboard/surveys/add" legacyBehavior>
          <a className={styles.addButton}>Add New Survey</a>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Description</td>
            <td>Created At</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id}>
              <td>{survey.title}</td>
              <td>{survey.description}</td>
              <td>{survey.createdAt}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/surveys/${survey.id}`} legacyBehavior>
                    <a className={styles.button}>View</a>
                  </Link>
                  {/* Implement delete functionality as needed */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Implement Pagination as needed */}
    </div>
  );
};

export default SurveyPage;
