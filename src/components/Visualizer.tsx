import { ModelTestingResults, ModelTrainingResults } from "@/HamModel";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, Rectangle, ResponsiveContainer, XAxis, YAxis } from "recharts";

type Props = {
  trainingResults: ModelTrainingResults | null,
  testingResults: ModelTestingResults | null,
};

export function Visualizer({ trainingResults, testingResults }: Props) {

  if (trainingResults === null || testingResults === null) {
    return (
      <div className="border-2 border-black p-2 text-center">
        NOTE: Visualizations will appear here after completing steps 1 through 4.
      </div>
    );
  }

  return (
    <>

      <div className="border-2 border-black p-6">
        <div className="text-lg font-bold mb-2 text-center">
          Messages in Training Data
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={[
                  { name: 'Ham', value: trainingResults.totalHamMessageCount, fill: 'green' },
                  { name: 'Spam', value: trainingResults.totalSpamMessageCount, fill: 'red' },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={(entry) => `${entry.name} (${entry.value})`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border-2 border-black p-6">
        <div className="text-lg font-bold mb-6 text-center">
          Frequency of Most Common Words in Training Data Spam Messages
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={trainingResults.mostFrequentSpamWords}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Bar dataKey="spamCount" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border-2 border-black p-6 flex justify-center">
        <table>
          <caption className="text-lg font-bold mb-6">
            Prediction Accuracy on Messages in Test Data
          </caption>
          <tbody>
            <tr>
              <td colSpan={2}></td>
              <td colSpan={2} className="border-2 border-black text-center p-2 font-bold text-xl">Actual</td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td className="border-2 border-black w-36 text-center p-2 font-bold">Ham</td>
              <td className="border-2 border-black w-36 text-center p-2 font-bold">Spam</td>
            </tr>
            <tr>
              <td rowSpan={2} className="border-2 border-black w-36 text-center p-2 font-bold text-xl">Predicted</td>
              <td className="border-2 border-black w-36 text-center p-2 font-bold">Ham</td>
              <td className="border-2 border-black text-center p-2 text-3xl text-[green]">{testingResults.truePositives}</td>
              <td className="border-2 border-black text-center p-2 text-3xl text-[red]">{testingResults.falsePositives}</td>
            </tr>
            <tr>
              <td className="border-2 border-black text-center p-2 font-bold">Spam</td>
              <td className="border-2 border-black text-center p-2 text-3xl text-[red]">{testingResults.falseNegatives}</td>
              <td className="border-2 border-black text-center p-2 text-3xl text-[green]">{testingResults.trueNegatives}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </>
  );
}

// Prevent noisy warnings from recharts library.
const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
