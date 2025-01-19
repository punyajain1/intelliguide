import { Infocard } from "./dataDisplay/informationCard";
import { ContestDisplay } from "./dataDisplay/contest";
import WrongProblemsCard from "./dataDisplay/wrongquescard";
import LanguageUsed from "./dataDisplay/language";
import DataDisplay from "./dataDisplay/accuracy";
import Verdict from "./dataDisplay/failedcase";


export function DataHandle(UserHandle_display: { userHandle: string }) {

  if (UserHandle_display === null || UserHandle_display === undefined) {
    return <div>get analyze of your profile enter user handle</div>;
  }

  return (
    <div>
      <div className="p-4 m-auto w-full">
        <Infocard userHandle={UserHandle_display} />
      </div>

      <div className="flex justify-center ">
        <div className=" w-full h-auto py-10 ">
          <ContestDisplay userHandle={UserHandle_display} />
        </div>
      </div>

      <div className="">
        <WrongProblemsCard userHandle={UserHandle_display} />

      </div>

      <div className="flex justify-center m-10 ">
        <LanguageUsed userHandle={UserHandle_display} />
      </div>

      <div className="flex flex-col gap-3 justify-center items-center p-5 sm:px-12">
        <h1 className="text-5xl text-[#c9b57a] font-serif font-bold m-3 text-center">Frequency Of Wrong Topics</h1>
        <DataDisplay userHandle={UserHandle_display} />
      </div>

      <div className="flex justify-center m-10">
        <Verdict userHandle={UserHandle_display} />
      </div>
    </div>
  );
}