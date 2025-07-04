'use client'

import {usePathname } from "next/navigation";
import Link from "next/link";
import Add from "@/app/ui/icons/add.svg";

export default function NewRegister({ allowNew = true }) {
  const pathname = usePathname();
  let href = `${pathname}/create`;

  if (pathname === '/ventas') {
    href = `${pathname}/create?page=1&query=disponibles`
  }
  
  return (
    <Link
      href={href}
      className={`${!allowNew && "hidden"} flex gap-2 absolute bottom-16 md:bottom-0 right-0 m-4 p-4 w-fit bg-green-300 dark:bg-green-700 rounded-full cursor-pointer shadow-md dark:shadow-none hover:bg-green-400 dark:hover:bg-green-600 items-center transition`}>
      <Add />
      <span className="text-sm font-semibold">Nuevo</span>
    </Link>
  )
}