import { HamModel, ModelTestingResults } from "@/HamModel";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { parse } from "csv-parse/sync";

const TESTING_DATA_FILE = '02_testing_data.csv';

type Props = {
  hamModel: HamModel,
  trainingCompleted: boolean,
  testingCompleted: boolean,
  setTestingCompleted: Dispatch<SetStateAction<boolean>>,
  setTestingResults: Dispatch<SetStateAction<ModelTestingResults | null>>,
};

export function Tester({ hamModel, trainingCompleted, testingCompleted, setTestingCompleted, setTestingResults }: Props) {
  const [testingFileContent, setTestingFileContent] = useState<string | null>(null);

  const onTestingFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTestingFileContent(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.name !== TESTING_DATA_FILE) {
        alert(`Please select "${TESTING_DATA_FILE}"`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestingFileContent(e.target?.result as string ?? null);
      };
      reader.readAsText(file);
    }
  };

  const onClickTest = () => {
    if (testingFileContent) {
      const testingDataRows = (parse(testingFileContent) as string[][]).slice(1);
      const results = hamModel.test(testingDataRows);
      setTestingResults(results);
      setTestingCompleted(true);
      alert('Model tested!');
    }
  };

  return (
    <div className="border-2 border-black p-2 w-1/3">
      <div className="font-medium mb-2">STEP 3 - Select TESTING Data</div>
      <input
        type="file"
        accept=".csv"
        disabled={!trainingCompleted || testingCompleted}
        onChange={onTestingFileChange}
      />
      <div className="font-medium mb-2 mt-4">STEP 4 - TEST the Model</div>
      <button
        className="block w-full rounded-lg border-2 border-black px-4 py-1 bg-blue-100 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-gray-100"
        disabled={testingFileContent === null || testingCompleted || !trainingCompleted}
        onClick={onClickTest}
      >
        TEST
      </button>
    </div>
  );
}
