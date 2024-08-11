import { useState } from "react";
import { HamModel, ModelTestingResults, ModelTrainingResults } from "@/HamModel";
import { Trainer } from "@/components/Trainer";
import { Tester } from "@/components/Tester";
import { Predicter } from "@/components/Predicter";
import { Visualizer } from "@/components/Visualizer";
import { Header } from "@/components/Header";
import Head from "next/head";

export default function Home() {
  const [hamModel] = useState(new HamModel());
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [trainingResults, setTrainingResults] = useState<ModelTrainingResults | null>(null);
  const [testingCompleted, setTestingCompleted] = useState(false);
  const [testingResults, setTestingResults] = useState<ModelTestingResults | null>(null);

  return (
    <div className="container mx-auto px-16 space-y-3 py-3">
      <Head><title>SMS Message Ham Prediction Model v1.0</title></Head>
      <div className="flex space-x-3">
        <Header />
        <Trainer
          hamModel={hamModel}
          trainingCompleted={trainingCompleted}
          setTrainingCompleted={setTrainingCompleted}
          setTrainingResults={setTrainingResults}
        />
        <Tester
          hamModel={hamModel}
          trainingCompleted={trainingCompleted}
          testingCompleted={testingCompleted}
          setTestingCompleted={setTestingCompleted}
          setTestingResults={setTestingResults}
        />
      </div>
      <Predicter
        hamModel={hamModel}
        trainingCompleted={trainingCompleted}
        testingCompleted={testingCompleted}
      />
      <Visualizer
        trainingResults={trainingResults}
        testingResults={testingResults}
      />
    </div>
  );
}
