import Head from "@/components/Head";

export default function ComingSoon() {
  return (
    <>
      <Head
        title={"Coming Soon"}
        description={"This page is under construction. Check back later!"}
      />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">🚧 Coming Soon 🚧</h1>
      </div>
    </>
  );
}
