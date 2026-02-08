import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Divider,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

/* ---------------- PREGNANCY DIET ---------------- */
const pregnancyDiet = {
  first: {
    underweight: {
      calories: "2200–2400 kcal",
      meals: [
        "Milk, banana, soaked almonds",
        "Rice, dal, ghee, vegetables",
        "Fruit smoothie",
        "Roti, paneer, sabzi",
      ],
    },
    normal: {
      calories: "2000–2200 kcal",
      meals: [
        "Milk + fruits",
        "Rice, dal, vegetables",
        "Sprouts / fruit",
        "Roti, sabzi",
      ],
    },
    overweight: {
      calories: "1800–2000 kcal",
      meals: [
        "Low-fat milk + fruit",
        "Brown rice, dal, sabzi",
        "Roasted chana",
        "Roti, vegetables",
      ],
    },
  },

  second: {
    underweight: {
      calories: "2400–2600 kcal",
      meals: [
        "Milk + boiled egg / banana",
        "Rice, dal, vegetables",
        "Curd + nuts",
        "Roti, paneer",
      ],
    },
    normal: {
      calories: "2200–2400 kcal",
      meals: [
        "Milk + fruit",
        "Rice, dal, vegetables",
        "Fruit + nuts",
        "Roti, sabzi",
      ],
    },
    overweight: {
      calories: "2000–2200 kcal",
      meals: [
        "Low-fat milk",
        "Brown rice, dal",
        "Buttermilk",
        "Roti, vegetables",
      ],
    },
  },

  third: {
    underweight: {
      calories: "2600–2800 kcal",
      meals: [
        "Milk, dates, almonds",
        "Rice, dal, vegetables",
        "Fruit smoothie",
        "Roti, paneer",
      ],
    },
    normal: {
      calories: "2400–2600 kcal",
      meals: [
        "Milk + fruits",
        "Rice, dal, vegetables",
        "Fruit",
        "Roti, sabzi",
      ],
    },
    overweight: {
      calories: "2200–2400 kcal",
      meals: [
        "Low-fat milk",
        "Brown rice, dal",
        "Fruit",
        "Roti, vegetables",
      ],
    },
  },
};

/* ---------------- CHILD DIET (6m – 2y) ---------------- */
const childDiet = {
  "6-8": [
    "Breast milk / formula",
    "Mashed banana",
    "Rice cereal / dal water",
  ],
  "9-11": [
    "Breast milk / formula",
    "Mashed vegetables",
    "Soft rice + dal",
    "Fruit puree",
  ],
  "12-18": [
    "Milk",
    "Soft roti dipped in dal",
    "Boiled vegetables",
    "Curd",
  ],
  "18-24": [
    "Milk",
    "Roti, rice, dal",
    "Vegetables",
    "Fruits",
  ],
};

/* ---------------- HELPERS ---------------- */
const getBMI = (w, h) => (w / ((h / 100) ** 2)).toFixed(1);
const getBMIType = (bmi) =>
  bmi < 18.5 ? "underweight" : bmi < 25 ? "normal" : "overweight";

/* ---------------- COMPONENT ---------------- */
export default function NutritionPlanner() {
  const [mode, setMode] = useState("mother");

  // mother
  const [trimester, setTrimester] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [motherResult, setMotherResult] = useState(null);

  // child
  const [age, setAge] = useState("");
  const [childResult, setChildResult] = useState(null);

  const generateMotherPlan = () => {
    const bmi = getBMI(weight, height);
    const type = getBMIType(bmi);
    setMotherResult({
      bmi,
      type,
      ...pregnancyDiet[trimester][type],
    });
  };

  const generateChildPlan = () => {
    setChildResult(childDiet[age]);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold">
        🥗 Nutrition Planner
      </Typography>
      <Typography color="text.secondary">
        Diet planning for pregnant mothers & children (6 months – 2 years)
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, v) => v && setMode(v)}
        sx={{ mt: 3 }}
      >
        <ToggleButton value="mother">🤰 Mother</ToggleButton>
        <ToggleButton value="child">👶 Child</ToggleButton>
      </ToggleButtonGroup>

      {/* ---------------- MOTHER ---------------- */}
      {mode === "mother" && (
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Trimester"
                value={trimester}
                onChange={(e) => setTrimester(e.target.value)}
              >
                <MenuItem value="first">1st Trimester</MenuItem>
                <MenuItem value="second">2nd Trimester</MenuItem>
                <MenuItem value="third">3rd Trimester</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </Grid>
          </Grid>

          <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={generateMotherPlan}>
            Generate Mother Diet
          </Button>

          {motherResult && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="info">BMI: {motherResult.bmi} ({motherResult.type})</Alert>
              <Chip label={`Calories: ${motherResult.calories}`} sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {motherResult.meals.map((m, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Card><CardContent>{m}</CardContent></Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* ---------------- CHILD ---------------- */}
      {mode === "child" && (
        <Box sx={{ mt: 4 }}>
          <TextField
            select
            fullWidth
            label="Child Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <MenuItem value="6-8">6–8 months</MenuItem>
            <MenuItem value="9-11">9–11 months</MenuItem>
            <MenuItem value="12-18">12–18 months</MenuItem>
            <MenuItem value="18-24">18–24 months</MenuItem>
          </TextField>

          <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={generateChildPlan}>
            Generate Child Diet
          </Button>

          {childResult && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success">Recommended Child Diet</Alert>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {childResult.map((m, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Card><CardContent>{m}</CardContent></Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      <Divider sx={{ mt: 5 }} />
      <Alert severity="warning" sx={{ mt: 2 }}>
        ⚠️ This is a guidance tool. Always consult a pediatrician or doctor.
      </Alert>
    </Container>
  );
}