import { ArrowLeft } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import MenuFooter from './MenuFooter'

const MenuLegalLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-8">
      <Link
        to="/menu"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Menükarte
      </Link>

      <div className="legal-content text-foreground [&_a]:text-primary [&_p]:text-muted-foreground [&_strong]:text-foreground space-y-6 text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 [&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:my-3 [&_ul]:space-y-1.5">
        {children ?? <Outlet />}
      </div>

      <div className="mt-12">
        <MenuFooter />
      </div>
    </div>
  )
}

export default MenuLegalLayout
