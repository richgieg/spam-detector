import { HamModel, ModelTrainingResults } from "@/HamModel";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { parse } from "csv-parse/sync";

const TRAINING_DATA_FILE = '01_training_data.csv';

type Props = {
  hamModel: HamModel,
  trainingCompleted: boolean,
  setTrainingCompleted: Dispatch<SetStateAction<boolean>>,
  setTrainingResults: Dispatch<SetStateAction<ModelTrainingResults | null>>,
};

export function Trainer({ hamModel, trainingCompleted, setTrainingCompleted, setTrainingResults }: Props) {
  const [trainingFileContent, setTrainingFileContent] = useState<string | null>(null);

  const onTrainingFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTrainingFileContent(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.name !== TRAINING_DATA_FILE) {
        alert(`Please select "${TRAINING_DATA_FILE}"`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setTrainingFileContent(e.target?.result as string ?? null);
      };
      reader.readAsText(file);
    }
  };

  const onClickTrain = () => {
    if (trainingFileContent) {
      const trainingDataRows = (parse(trainingFileContent) as string[][]).slice(1);
      const results = hamModel.train(trainingDataRows);
      setTrainingResults(results);
      setTrainingCompleted(true);
      alert('Model trained!');
    }
  };

  return (
    <div className="border-2 border-black p-2 w-1/3">
      <div className="font-medium mb-2">STEP 1 - Select TRAINING Data</div>
      <input
        type="file"
        accept=".csv"
        disabled={trainingCompleted}
        onChange={onTrainingFileChange}
      />
      <div className="font-medium mb-2 mt-4">STEP 2 - TRAIN the Model</div>
      <button
        className="block w-full rounded-lg border-2 border-black px-4 py-1 bg-blue-100 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-gray-100"
        disabled={trainingFileContent === null || trainingCompleted}
        onClick={onClickTrain}
      >
        TRAIN
      </button>
    </div>
  );
}
