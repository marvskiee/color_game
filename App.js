import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  View,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { colors } from "./assets/colors";
export default function App() {
  // you may edit this timer variable based on how many seconds you want
  const defaultTimer = 60;
  // you may edit this live variable how many lives you want
  const lives = 5;
  // this variable will handle the correct answer once the generatorColor trigger
  const colorName = useRef();
  // there are two pages "home" and "game" the default is "home"
  const [page, setPage] = useState("home");
  // will store the score value
  const score = useRef(0);
  // to store the defaultTimer by seconds
  const [timerInSeconds, setTimerInSeconds] = useState({
    seconds: defaultTimer,
  });
  // to store the lives by default
  const livesRef = useRef(lives);
  // will set the four choices using array
  const [choices, setChoices] = useState([
    { backgroundColor: "pink", name: "pink" },
    { backgroundColor: "blue", name: "blue" },
    { backgroundColor: "green", name: "green" },
    { backgroundColor: "yellow", name: "yellow" },
  ]);
  // this variable consider if the game is over based on value
  const [gameOver, setGameOver] = useState(false);
  const mounted = useRef();
  // this function will trigger when the components mounted
  useEffect(() => {
    if (!mounted.current) {
      generateColor();
      mounted.current = true;
    }
  });
  // will generate the color keys based on colors imported from above
  const colorGenerator = (obj) => {
    // ["brown","blue"]
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
  };
  // two ways to trigger this function when choiceHandler is clicked and when the game started
  const generateColor = () => {
    // this variable will handle the generated color for the 4 choices
    let arr = [];
    do {
      let randomColorKey = colorGenerator(colors);
      if (!arr.includes(randomColorKey)) {
        arr.push(randomColorKey);
      }
    } while (arr.length != 4);

    const temp_answer = arr[Math.floor(Math.random() * 4)];
    colorName.current = temp_answer;
    // rgba (127, 255, 212, 1)
    setChoices([
      { backgroundColor: `rgba(${colors[arr[0]].join()})`, name: arr[0] },
      { backgroundColor: `rgba(${colors[arr[1]].join()})`, name: arr[1] },
      { backgroundColor: `rgba(${colors[arr[2]].join()})`, name: arr[2] },
      { backgroundColor: `rgba(${colors[arr[3]].join()})`, name: arr[3] },
    ]);
  };
  // this will trigger when the play button is clicked
  const startHandler = () => {
    // change the page to proceed to the game interface
    setPage("game");
    // this function is for timer every 1 second it will update the value, decrement by 1
    const interval = setInterval(() => {
      // if the time is over
      if (timerInSeconds.seconds <= 0) {
        // to stop the timer
        clearInterval(interval);
        // set the dialog of gameover to true
        setGameOver(true);
      } else {
        // if the lives variable is equal to 0
        if (livesRef.current == 0) {
          // to stop the timer
          clearInterval(interval);
        }
        // decrement by 1
        setTimerInSeconds({ seconds: (timerInSeconds.seconds -= 1) });
      }
    }, 1000);
    // 1000 means 1 second
  };
  // when choices is clicked it will check the answer by passing the parameter num
  const choiceHandler = (num) => {
    // contains value that you pressed
    // sample value of choices ["blue","red","green","yellow"]
    const yourAnswer = choices[num].name;
    // validate if the current colorname matches to your answer
    if (yourAnswer == colorName.current) {
      // if true update the score variable
      score.current = score.current + 1;
    } else {
      // validate the lives as its near to game over
      if (livesRef.current > 1) {
        // updates the lives when the answer is wrong
        livesRef.current = livesRef.current - 1;
      } else {
        // update the lives to 0
        livesRef.current = 0;
        // show the gameover dialog and updates the value of gameover dialog to true
        setGameOver(true);
      }
    }
    // to generate color for both answer and selection
    generateColor();
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* show the game screen when the page value is not equal to "home" */}
      {page != "home" ? (
        <>
          {/* show the gameover dialog if its true */}
          {gameOver && (
            <View style={styles.gameover_container}>
              <Text style={styles.largeText}>Game Over</Text>
              <Text style={[styles.mediumText, { marginTop: 10 }]}>
                Your Score
              </Text>
              <Text style={styles.largeText}>{score.current}</Text>
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => {
                  score.current = 0;
                  livesRef.current = lives;
                  setTimerInSeconds({ seconds: defaultTimer });
                  setPage("home");
                  setGameOver(false);
                }}
              >
                <Text style={styles.btn}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* user interface of the game */}
          <View style={{ paddingVertical: 30 }}>
            <Text style={styles.smallText}>Which one is </Text>
            {colorName.current && (
              <Text style={styles.mediumText}>{colorName.current}?</Text>
            )}
          </View>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View style={{ width: "50%" }}>
              <Text style={styles.smallText}>Score</Text>
              <Text style={styles.largeText}>{score.current}</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={styles.smallText}>Timer</Text>
              <Text style={styles.largeText}>{timerInSeconds.seconds}s</Text>
            </View>
          </View>
          <View
            style={{
              flexWrap: "wrap",
              alignItems: "center",
              flexDirection: "row",
              width: 320,
            }}
          >
            {choices.map(({ backgroundColor }, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0}
                onPress={() => choiceHandler(index)}
                style={[
                  {
                    borderColor: "white",
                    borderWidth: 2,
                    width: 150,
                    borderRadius: 30,
                    aspectRatio: 1 / 1,
                    margin: 5,
                    backgroundColor: backgroundColor,
                  },
                ]}
              />
            ))}
            <Text
              style={[
                styles.smallText,
                {
                  textAlign: "center",
                  width: "100%",
                  padding: 10,
                },
              ]}
            >
              Lives: {livesRef.current}
            </Text>
          </View>
        </>
      ) : (
        <>
          {/* this is home user interface  */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleScreen}>Color Guessing Game</Text>
            <View
              style={{
                marginTop: 20,
                flex: 0,
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                width: 220,
              }}
            >
              {choices.map(({ backgroundColor }, index) => (
                <View
                  key={index}
                  style={[
                    {
                      borderRadius: 20,
                      margin: 5,
                      width: 100,
                      aspectRatio: 1 / 1,
                      backgroundColor: backgroundColor,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 20,
            }}
            onPress={startHandler}
          >
            <Text style={styles.btn}>Play</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0E3441",
  },
  titleScreen: {
    fontWeight: "900",
    color: "white",
    textTransform: "uppercase",
    fontSize: 30,
    textAlign: "center",
    padding: 10,
  },
  btn: {
    backgroundColor: "#EE3466",
    padding: 20,
    textAlign: "center",
    fontSize: 20,
    width: 180,
    color: "white",
    borderRadius: 100,
    fontWeight: "600",
  },
  gameover_container: {
    top: 0,
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(1, 1, 1, 0.8)",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  gameover_card: {
    borderRadius: 10,
    backgroundColor: "white",
    padding: 20,
  },
  smallText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  mediumText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  largeText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 50,
  },
});
