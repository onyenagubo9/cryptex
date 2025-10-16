export default function SubHeader({ title }) {
  return (
    <header className="sticky top-0 bg-gray-950/40 backdrop-blur-md z-50 border-b border-gray-800 p-4 flex justify-center items-center">
      <h1 className="text-xl font-bold text-yellow-400 text-center">{title}</h1>
    </header>
  );
}
