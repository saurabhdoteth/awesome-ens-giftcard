import { ENSDetailCard } from "../components/Card/ENSDetailCard";
import { Navbar } from "../components/Navbar";
import { ens } from "../ens";

export default function Home() {
  return (
    <div className="min-h-screen bg-white-100">
      <Navbar />
      <div className="mt-4 px-4 w-full md:max-w-3xl mx-auto">
        <div className="flex flex-col space-y-4">
          {ens.map((e, i) => (
            <ENSDetailCard key={i} ens={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
