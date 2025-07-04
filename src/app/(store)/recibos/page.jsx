import ActionTools from "@/app/ui/actiontools/NewRegister";
import SearchInput from "@/app/ui/actiontools/SearchInput";
import Receipts from "@/app/ui/lists/Receipts";

export const metadata = {
  title: 'Recibos'
}

export default async function Page(props) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <>
      <SearchInput />
      <Receipts query={query} currentPage={currentPage} />
    </>
  );
};