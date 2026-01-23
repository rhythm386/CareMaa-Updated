import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <div className="page">
      <h1>CareMaa</h1>
      <p>One platform for pregnancy, nutrition & child care</p>

      <div className="grid">
        <FeatureCard title="Period Tracker" description="Track Period Dates" />
        <FeatureCard title="Pregnancy Tracker" description="Track health & milestones" />
        <FeatureCard title="Vaccination Alerts" description="Never miss vaccines" />
        <FeatureCard title="Nutrition Planner" description="Healthy diet suggestions" />
        <FeatureCard title="AI Risk Prediction" description="Early risk detection" />
        <FeatureCard title="Community Support" description="Doctors & mothers connect" />
      </div>
    </div>
  );
}

export default Home;
