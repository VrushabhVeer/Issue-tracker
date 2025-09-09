import ToastNotification from "./common/ToastNotification";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
    <ToastNotification/>
      <Navbar />
        <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
