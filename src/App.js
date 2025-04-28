import './App.css';
import FormularioIncidente from './components/FormularioIncidente';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-800 text-white p-4 mb-6">
        <h1 className="text-2xl font-bold text-center">Generador de Comunicados de Incidentes</h1>
      </header>
      <main className="container mx-auto px-4 pb-8">
        <FormularioIncidente />
      </main>
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm mt-8">
        © {new Date().getFullYear()} Generador de Comunicados de Incidentes
      </footer>
    </div>
  );
}

export default App;
