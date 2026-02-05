import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const Community = () => {
  const [query, setQuery] = useState("");
  const [disease, setDisease] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setError("");
    setDisease(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/diseases/${query}`
      );
      setDisease(res.data);
    } catch {
      setError("Disease not found in database");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🌸 Community Health Guide
      </Typography>

      {/* SEARCH */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          label="Enter disease name (e.g. Anemia)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* RESULT */}
      {disease && (
        <Card sx={{ mt: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {disease.disease_name}
            </Typography>

            <Typography mt={1}>
              <b>Category:</b> {disease.category}
            </Typography>

            <Typography mt={1}>
              <b>Severity:</b> {disease.severity}
            </Typography>

            {/* SYMPTOMS */}
            <Section title="Symptoms" items={disease.symptoms} />

            {/* MEDICINES */}
            <Section title="Common Medicines" items={disease.common_medicines} />

            {/* SPECIALIST */}
            <Typography mt={3}>
              <b>Recommended Specialist:</b>{" "}
              {disease.recommended_specialist}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

const Section = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box mt={3}>
      <Typography fontWeight="bold">{title}</Typography>
      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
        {items.map((item, i) => (
          <Chip key={i} label={item} />
        ))}
      </Box>
    </Box>
  );
};

export default Community;