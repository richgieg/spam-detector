import { HamModel } from "@/HamModel";
import { useEffect, useState } from "react";

type Props = {
  hamModel: HamModel,
  trainingCompleted: boolean,
  testingCompleted: boolean,
};

export function Predicter({ hamModel, trainingCompleted, testingCompleted }: Props) {
  const [message, setMessage] = useState('');
  const [isHam, setIsHam] = useState(true);

  useEffect(() => {
    if (!trainingCompleted || !testingCompleted) {
      return;
    }
    setIsHam(hamModel.predictIsHam(message));
  }, [hamModel, message, trainingCompleted, testingCompleted]);

  return (
    <div className="border-2 border-black p-2">
      <div className="flex">
        <div className="w-1/2">
          <div className="font-medium">STEP 5 - PREDICT Whether This SMS Message is Ham</div>
          <textarea
            className="block w-full h-24 mt-2 border-2 border-gray-400 rounded-lg outline-none p-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={!trainingCompleted || !testingCompleted}
            spellCheck={false}
            placeholder="Enter SMS message here"
          />
        </div>
        <div className={`w-1/2 flex justify-center items-center text-5xl font-bold ${message.trim() && (isHam ? 'text-[green]' : 'text-[red]')}`}>
          {message.trim() ? isHam ? 'HAM' : 'SPAM' : 'RESULT'}
        </div>
      </div>
  </div>
  );
}
