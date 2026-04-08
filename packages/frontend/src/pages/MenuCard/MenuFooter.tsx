import { Link } from 'react-router-dom'

const MenuFooter = () => {
  return (
    <footer className="text-muted-foreground border-t px-4 py-8 text-center text-sm">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/menu/impressum" className="hover:text-foreground underline">
          Impressum
        </Link>
        <span>·</span>
        <Link
          to="/menu/datenschutz"
          className="hover:text-foreground underline"
        >
          Datenschutz
        </Link>
        <span>·</span>
        <Link to="/menu/agb" className="hover:text-foreground underline">
          AGB
        </Link>
      </div>
      <p className="mt-2">
        © {new Date().getFullYear()} Christengemeinde Immanuel e. V.
      </p>
      <Link
        to="/admin/login"
        className="mt-2 inline-block text-xs opacity-50 hover:opacity-100"
      >
        Mitarbeiter-Login
      </Link>
    </footer>
  )
}

export default MenuFooter
