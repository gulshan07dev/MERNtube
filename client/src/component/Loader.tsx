import { LineWave } from "react-loader-spinner";

export default function Loader() {
  return (
    <section className="h-screen w-screen bg-white dark:bg-dark_bg flex justify-center items-center">
      <LineWave
        visible={true}
        height="160"
        width="160"
        color="#4fa94d"
        ariaLabel="line-wave-loading"
      />
    </section>
  );
}
