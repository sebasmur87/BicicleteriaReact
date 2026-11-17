import { useState } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Catalogo from "../components/Catalogo"
import RegistroBanner from "../components/RegistroBanner";
import Servicios from "../components/Servicios"
import Contacto from "../components/Contacto"
import Footer from "../components/Footer"
import LoginModal from "../components/LoginModal"


function Home({ onLogin }) {
  const [mostrarLogin, setMostrarLogin] = useState(false)

  return (
    <>
      <Navbar abrirLogin={() => setMostrarLogin(true)} />
      <Hero />
      <Catalogo />
      <RegistroBanner onRegistro={() => setMostrarLogin(true)} />
      <Servicios />
      <Contacto />
      <Footer />

      <LoginModal
        mostrar={mostrarLogin}
        cerrar={() => setMostrarLogin(false)}
        onLogin={onLogin}
      />
    </>
  )
}

export default Home
