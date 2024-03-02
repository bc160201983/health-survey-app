import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Available from "../components/SurveyList/Available";
import Pending from "../components/SurveyList/Pending";
import Completed from "../components/SurveyList/Completed";
import { globalStyles } from "../styles/global";

const Tab = createMaterialTopTabNavigator();

// Example function to fetch survey counts
const fetchSurveyCounts = async () => {
  // Simulate fetching data
  return {
    available: 5,
    pending: 3,
    completed: 8,
  };
};

const Home = ({ navigation }) => {
  const [counts, setCounts] = useState({
    available: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    const getCounts = async () => {
      const counts = await fetchSurveyCounts();
      setCounts(counts);
    };

    getCounts();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Tab.Navigator>
        <Tab.Screen
          name={`Available (${counts.available})`}
          component={Available}
          options={{
            tabBarLabel: ({ color }) => (
              <TabBarLabel
                title={`Available`}
                count={counts.available}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={`Pending (${counts.pending})`}
          component={Pending}
          options={{
            tabBarLabel: ({ color }) => (
              <TabBarLabel
                title={`Pending`}
                count={counts.pending}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={`Completed (${counts.completed})`}
          component={Completed}
          options={{
            tabBarLabel: ({ color }) => (
              <TabBarLabel
                title={`Completed`}
                count={counts.completed}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const TabBarLabel = ({ title, count, color }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={{ color }}>{title}</Text>
    <View style={styles.countCircle}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  countCircle: {
    marginLeft: 6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "white",
    fontSize: 12,
  },
});

export default Home;
