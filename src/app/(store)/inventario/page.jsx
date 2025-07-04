import SearchInput from "@/app/ui/actiontools/SearchInput";
import Inventory from "@/app/ui/lists/Inventory";

export const metadata = {
  title: 'Inventario'
}

export default async function Page(props) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <>
      <SearchInput />
      <Inventory query={query} currentPage={currentPage} />
    </>
  );
};