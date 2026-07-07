import * as React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Appbar,
  Button,
  Divider,
  IconButton,
  Menu,
  PaperProvider,
  Modal,
  TextInput,
} from "react-native-paper";
import DailyMacrosStats from "@/components/DailyMacrosStats";
import { getFoodList } from "../services/api";
import { router, useNavigation } from "expo-router";
import TokenStorage from "../services/tokenStorage";
import { ReactStorage, ValEnum } from "../services/reactStorage";

export default function HomeScreen() {
  const [data, setData] = React.useState(null);
  const [, setLoading] = React.useState(true);
  const [, setError] = React.useState(null);
  const [caloriesGoal, setCaloriesGoal] = React.useState(4500);
  const [adviceAI] = React.useState(
    `Eat a balanced diet: include more vegetables, fruits, proteins, and whole grains, avoid overeating, and minimize sugar and processed food intake. Drink enough water, follow a regular eating schedule, and avoid late-night snacks.`
  );
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [visibleModal, setVisibleModal] = React.useState(false); // Состояние для управления модальным окном
  const [goal, setGoal] = React.useState("");

  const navigation = useNavigation();
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", async () => {
      console.log("Screen is focused");
      const dataString = await ReactStorage.loadVal(ValEnum.DAILYINFO);
      if (dataString) {
        const data = JSON.parse(dataString);
        setData(data);
      }
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      console.log("Screen is unfocused");
    });

    return () => {
      // Cleanup event listeners
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const checkJwtTocken = async (): Promise<boolean> => {
    return !!(await TokenStorage.loadToken());
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFoodList();
        ReactStorage.saveVal(ValEnum.DAILYINFO, response[0]);
        setData(response[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    checkJwtTocken().then((val) => {
      console.log(val);
      if (val) {
        fetchData();
      } else {
        router.replace("./LoginPage");
      }
    });

    // fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      console.log("Данные обновляются...");
      const response = await getFoodList();
      setData(response[0]);
    } catch (err) {
      setError(err.message);
      console.error("Ошибка при обновлении данных:", err);
    } finally {
      setLoading(false);
    }
  };

  const { nutrition } = data || {};
  const totalCalories = nutrition?.calories || 0;

  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);

  const openModal = () => {
    closeMenu(); // Закрытие меню перед открытием модального окна
    setVisibleModal(true); // Открытие модального окна
  };

  const closeModal = () => setVisibleModal(false);

  const handleGoalSubmit = () => {
    const parsedGoal = parseInt(goal, 10);
    if (isNaN(parsedGoal) || parsedGoal <= 0) {
      return;
    }

    setCaloriesGoal(parsedGoal);
    setGoal("");
    closeModal();
  };

  const handleLogOut = () => {
    TokenStorage.deleteToken().then(() => {
      router.replace("./LoginPage");
    });
  };

  return (
    <PaperProvider>
      <View style={styles.index}>
        <Appbar.Header style={styles.appbarHeader}>
          <Appbar.Content title="AnyMeal" titleStyle={{ color: "white" }} />
          <View
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: 50,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Menu
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              visible={visibleMenu}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-vertical" // Иконка для кнопки меню
                  iconColor="white"
                  size={30}
                  style={{ marginTop: "-35px" }}
                  onPress={openMenu}
                />
              }
            >
              <Menu.Item onPress={openModal} title="Set goal" />
              <Divider />
              <Menu.Item onPress={handleLogOut} title="Log out" />
            </Menu>
          </View>
        </Appbar.Header>
        <View style={styles.header}>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.calories}>{totalCalories} cal</Text>
          <Text style={styles.caloriesGoal}>/ {caloriesGoal} goal</Text>
        </View>
        <ScrollView style={styles.container}>
          <Text style={styles.textOfSection}>Stats</Text>
          <DailyMacrosStats
            proteins={nutrition?.proteins || 0}
            carbs={nutrition?.carbohydrates || 0}
            fat={nutrition?.fats || 0}
          />
          <Text style={styles.textOfSection}>AI advice</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={styles.infoBox}
          >
            <Text style={styles.textAdvice}>{adviceAI}</Text>
          </ScrollView>
          <Button
            icon="refresh"
            mode="contained"
            buttonColor="#89BD71"
            style={{ marginTop: 50 }}
            onPress={refreshData}
          >
            Refresh
          </Button>
        </ScrollView>

        {/* Модальное окно для установки цели */}
        <Modal
          visible={visibleModal}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}
        >
          <TextInput
            label="Set your calorie goal"
            value={goal}
            onChangeText={setGoal}
            style={styles.input}
            keyboardType="numeric"
          />
          <Button
            textColor="white"
            buttonColor="#89BD71"
            mode="contained"
            onPress={handleGoalSubmit}
            style={styles.button}
          >
            Set Goal
          </Button>
        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  index: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 30,
  },
  appbarHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#89BD71",
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
    backgroundColor: "#89BD71",
  },
  infoBox: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  textAdvice: {
    fontSize: 15,
  },
  calories: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
  },
  caloriesGoal: {
    fontSize: 18,
    color: "#ededed",
    fontWeight: "400",
  },
  textOfSection: {
    marginTop: 30,
    fontSize: 20,
    color: "#2e2e2e",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
